import pandas as pd
from collections import defaultdict
from sklearn.ensemble import RandomForestClassifier

import requests
from collections import defaultdict

def get_all_codeforces_tags():
    try:
        response = requests.get("https://codeforces.com/api/problemset.problems")
        response.raise_for_status()
        problems = response.json()["result"]["problems"]
        
        all_tags = set()
        for problem in problems:
            all_tags.update(problem.get("tags", []))
            
        return sorted(all_tags)  
    
    except Exception as e:
        print(f"Error fetching tags: {e}")
        return []

ALL_CF_TAGS = get_all_codeforces_tags()

def extract_features(labeled_problems,submissions,user_rating):
    
    tag_stats = defaultdict(lambda: {"WA": 0, "AC": 0})
    rating_stats = defaultdict(lambda: {"WA": 0, "AC": 0})
    for sub in submissions:
        problem = sub["problem"]
        rating = problem.get("rating",0)
        
        for tag in problem.get("tags",[]):
            if sub.get("verdict", "") == "OK":
                tag_stats[tag]["AC"]+=1
            else:
                tag_stats[tag]["WA"]+=1 
                
        if rating ==0 :
            continue
        elif sub["verdict"]=='OK':
            rating_stats[rating]["AC"]+=1
        else:
            rating_stats[rating]["WA"]+=1 
                                  

    features, labels = [], []
    for problem in labeled_problems:
        feature = {"rating" : problem["rating"]}
        
        for tag in ALL_CF_TAGS:
            feature[f"tag_{tag}"] = 0
            feature[f"{tag}_WA_rate"] = 0.5
            feature[f"{tag}_AC_rate"] = 0.5
        
        for tag in problem.get("tags",[]):
            
            #one-hot encoding for tags
            feature[f"tag_{tag}"]=1
            
            #tags wa and ac rates
            total_attempts = tag_stats[tag]["WA"] + tag_stats[tag]["AC"]
            feature[f"{tag}_WA_rate"] = tag_stats[tag]["WA"]/max(1,total_attempts)
            feature[f"{tag}_AC_rate"] = tag_stats[tag]["AC"]/max(1,total_attempts)
            
            
        prob_rating = problem["rating"]
        if prob_rating > 0:
            
            total_rating_sub = rating_stats[prob_rating]["WA"]+ rating_stats[prob_rating]["AC"]
            feature["rating_struggle_score"] = rating_stats[prob_rating]["WA"] / max(1,total_rating_sub)   
            
            lower_bound = user_rating
            upper_bound = user_rating + 250
            
            if prob_rating <= lower_bound:
                feature["rating_distance_penalty"] = (lower_bound-prob_rating)/100
            elif prob_rating > upper_bound:
                feature["rating_distance_penalty"] = (prob_rating-upper_bound)/100
            else:
                feature["rating_distance_penalty"] = 0  
        else:
            feature["rating_distance_penalty"] = 0          
                
            
        features.append(feature)
        labels.append(problem["useful"]) 
    
    return pd.DataFrame(features).fillna(0), pd.Series(labels), tag_stats, rating_stats
            
            
def train_model(X,y):
    
    model = RandomForestClassifier(
        n_estimators=60,
        class_weight={1:2},
        random_state=42,
    )
    model.fit(X,y)
    return model


def recommend_problems(model, user_rating, unsolved_problems, tag_stats, rating_stats):
    recommendations = []
    
    # Get the EXACT feature order used during training
    feature_columns = model.feature_names_in_
    
    for prob in unsolved_problems:
        feat = {
            "rating": prob.get("rating", 0),
            "rating_distance_penalty": (
                max(0, (user_rating - 100 - prob.get("rating", 0)) / 100) 
                if prob.get("rating", 0) < user_rating - 100
                else max(0, (prob.get("rating", 0) - (user_rating + 250)) / 100)
            ), 
        }
        
        prob_rating = prob.get("rating", 0)
        if prob_rating > 0:
            total_rating_subs = rating_stats[prob_rating]["WA"] + rating_stats[prob_rating]["AC"]
            feat["rating_struggle_score"] = rating_stats[prob_rating]["WA"] / max(1, total_rating_subs)
        else:
            feat["rating_struggle_score"] = 0.5

        
        for tag in ALL_CF_TAGS:
            feat[f"tag_{tag}"] = 0
            feat[f"{tag}_WA_rate"] = 0.5
            feat[f"{tag}_AC_rate"] = 0.5
            
        for tag in prob.get("tags", []):
            feat[f"tag_{tag}"] = 1
            total_tag_subs = tag_stats[tag]["WA"] + tag_stats[tag]["AC"]
            feat[f"{tag}_WA_rate"] = tag_stats[tag]["WA"] / max(1, total_tag_subs)
            feat[f"{tag}_AC_rate"] = tag_stats[tag]["AC"] / max(1, total_tag_subs)

        
        X_pred = pd.DataFrame([feat], columns=feature_columns).fillna(0)
        
        usefulness_prob = model.predict_proba(X_pred)[0][1]
        
        if usefulness_prob > 0.5:
            recommendations.append({
                "problem": prob["name"],
                "contestId": prob["contestId"],
                "index": prob["index"],
                "rating": prob.get("rating", 0),
                "usefulness_score": usefulness_prob,
            })
    
    return sorted(recommendations, key=lambda x: -x["usefulness_score"])[:50]
    
