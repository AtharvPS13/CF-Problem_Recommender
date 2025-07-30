from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import requests
from main import get_user_submissions, get_user_rating, label_problems
from model import extract_features, train_model, recommend_problems 
from fastapi.middleware.cors import CORSMiddleware
import random

global_rating_stats = {}
global_tag_stats = {}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class HandleRequest(BaseModel):
    handle: str

def get_unsolved_problems(handle: str, submissions: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    try:
        user_rating = get_user_rating(handle)
        
        solved_pids = {
            f"{sub['problem']['contestId']}-{sub['problem']['index']}"
            for sub in submissions
            if sub.get("verdict","") == "OK"  
        }
        
        response = requests.get("https://codeforces.com/api/problemset.problems")
        response.raise_for_status()
        problems = response.json()["result"]["problems"]
        
        return [
            p for p in problems
            if (f"{p['contestId']}-{p['index']}" not in solved_pids and
                user_rating - 300 <= p.get('rating', 0) <= user_rating + 350) and 
                p['contestId'] > 1350
        ]
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@app.post("/recommend")
async def recommend_problems_endpoint(request: HandleRequest):
    try:
        print("Received request for handle:", request.handle)

        submissions = get_user_submissions(request.handle)
        print(f"Fetched {len(submissions)} submissions.")

        if not submissions:
            raise HTTPException(status_code=404, detail="No submissions found for this user")      

        user_rating = get_user_rating(request.handle)
        print("User rating:", user_rating)

        labeled_problems = label_problems(submissions)
        print("Labeled problems sample:", labeled_problems[:2])

        X, y, tag_stats, rating_stats = extract_features(labeled_problems, submissions, user_rating)
        print(f"Extracted features: X={len(X)}, y={len(y)}")
        
        global global_rating_stats
        global_rating_stats = rating_stats
        
        global global_tag_stats
        global_tag_stats = tag_stats


        model = train_model(X, y)
        print("Model trained.")

        unsolved_problems = get_unsolved_problems(request.handle, submissions)
        print(f"Unsolved problems: {len(unsolved_problems)}")

        recommendations = recommend_problems(
            model=model,
            user_rating=user_rating,
            unsolved_problems=unsolved_problems,
            tag_stats=tag_stats,
            rating_stats=rating_stats
        )
        print(f"Generated {len(recommendations)} recommendations.")
        random_recommendations = random.sample(recommendations, 12) if len(recommendations) >= 10 else recommendations

        return {
            "handle": request.handle,
            "current_rating": user_rating,
            "recommendations": random_recommendations,
        }

    except HTTPException as http_err:
        print("HTTPException:", http_err.detail)
        raise http_err
    except Exception as e:
        print("Unhandled error:", e)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
    
@app.get("/api/rating-accuracy")
def get_rating_accuracy():
    if not global_rating_stats:
        raise HTTPException(status_code=404, detail="No rating/tag stats available. Call /recommend first.")

    accuracy_of_ratings=[]
    for rating in sorted(global_rating_stats):
        accepted = global_rating_stats[rating]["AC"]           
        wrong = global_rating_stats[rating]["WA"]   
        accuracy = round((accepted /(accepted+wrong))*100)
        accuracy_of_ratings.append({"rating":rating , "accuracy":accuracy,"accepted":accepted,"wrong":wrong})    
        
    accuracy_of_tags = []
    for tag in global_tag_stats:
        accepted = global_tag_stats[tag]["AC"]
        wrong = global_tag_stats[tag]["WA"]
        accuracy = round((accepted /(accepted+wrong))*100) if (accepted + wrong) > 0 else 0
        accuracy_of_tags.append({
            "tag": tag,
            "accuracy": accuracy,
            "accepted": accepted,
            "wrong": wrong,
            "total": accepted + wrong
        }) 
        
    accuracy_of_tags.sort(key=lambda x: x["total"], reverse=True)      
       
    return {
        "rating_accuracy": accuracy_of_ratings,
        "tag_accuracy": accuracy_of_tags[:10]
    }