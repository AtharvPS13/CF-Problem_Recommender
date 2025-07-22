import requests
from collections import defaultdict

def get_user_rating(handle: str) -> int:
    url = f"https://codeforces.com/api/user.info?handles={handle}"
    try:
        response = requests.get(url)
        response.raise_for_status()  
        data = response.json()
        
        if data["status"] != "OK":
            print(f"API Error: {data.get('comment', 'Unknown error')}")
            return -1
            
        if not data["result"]:
            print("User not found")
            return -1
            
        return data["result"][0].get("rating", -1)  # -1 means unrated
        
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        return -1
    except Exception as e:
        print(f"Unexpected error: {e}")
        return -1
    
    
def get_user_submissions(handle:str):
    url = f"https://codeforces.com/api/user.status?handle={handle}&count=500"
    
    try:
        response= requests.get(url)
        response.raise_for_status() 
        return response.json()["result"]
    except Exception as e:
        print(f"Error fetching data: {e}")
        return []


def label_problems(submissions):
    
    problem_stats = defaultdict(lambda: {
        "solved":False,
        "attempts":0,
        "tags":[],
        "rating":None,
    })

    for sub in submissions:
        problem = sub["problem"]
        prob_id = f"{problem['contestId']}-{problem['index']}"
        stats = problem_stats[prob_id]
        
        if stats["attempts"]==0:
            stats["tags"] = problem.get("tags",[])
            stats["rating"] = problem.get("rating",0)
            
        if sub["verdict"]=="OK":
            stats["solved"]=True
            
        stats["attempts"]+=1
    
    labeled_data=[]
    for prob_id,stats in problem_stats.items():
        is_useful = (stats["solved"] and stats["attempts"]>1) or (not stats["solved"])   
        labeled_data.append({
            "prob_id":prob_id,
            "tags": stats["tags"],
            "rating": stats["rating"],
            "useful": int(is_useful) 
        })  
        
    return labeled_data



        