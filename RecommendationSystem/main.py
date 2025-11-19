# recommend_service.py
import os
import math
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://isgsachin_db_user:ishan007@cluster0.hmkqkdo.mongodb.net/GigScape?appName=Cluster0")
DB_NAME = os.getenv("DB_NAME", "GigScape")

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]

app = FastAPI(title="Proposal Recommendation Service")

# --------- Configurable weights ----------
WEIGHTS = {
    "rating": 0.35,
    "acceptance_rate": 0.20,
    "success_rate": 0.20,
    "skill_match": 0.15,
    "price": 0.10,
}
# ----------------------------------------

# Helper
def objid(idstr):
    try:
        return ObjectId(idstr)
    except Exception:
        return None

class RecommendationItem(BaseModel):
    proposal_id: str
    freelancer_id: str
    score: float
    details: Dict[str, Any]

@app.get("/recommendations/job/{job_id}", response_model=List[RecommendationItem])
async def recommend_for_job(job_id: str, top_n: int = 10):
    """
    Return top proposals for a job sorted by computed score.
    """
    job_oid = objid(job_id)
    if job_oid is None:
        raise HTTPException(status_code=400, detail="Invalid job id")

    # Fetch job (to get skills and budget)
    job = await db["jobs"].find_one({"_id": job_oid})
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    job_skills = job.get("skills", [])  # array of ObjectId
    # budget for price normalization
    job_budget = None
    if job.get("fixedBudget") is not None:
        job_budget = job["fixedBudget"]
    elif job.get("budgetMin") is not None:
        job_budget = job["budgetMin"]

    # Fetch proposals for this job
    proposals_cursor = db["praposals"].find({"job": job_oid})
    proposals = await proposals_cursor.to_list(length=None)
    if not proposals:
        return []

    # We'll compute per-freelancer aggregated metrics in batch.
    freelancer_ids = list({p["freelancer"] for p in proposals})
    # Ensure objectids
    freelancer_oids = [f for f in freelancer_ids]

    # 1) Proposal statistics per freelancer (total proposals, accepted proposals)
    pipeline_proposals_stats = [
        {"$match": {"freelancer": {"$in": freelancer_oids}}},
        {"$group": {
            "_id": "$freelancer",
            "total_proposals": {"$sum": 1},
            "accepted_proposals": {"$sum": {"$cond": [{"$eq": ["$status", "accepted"]}, 1, 0]}}
        }}
    ]
    prop_stats = await db["praposals"].aggregate(pipeline_proposals_stats).to_list(length=None)
    prop_stats_map = {doc["_id"]: doc for doc in prop_stats}

    # 2) Reviews per freelancer: avg rating and count
    pipeline_reviews = [
        {"$match": {"reviewee": {"$in": freelancer_oids}}},
        {"$group": {"_id": "$reviewee", "avg_rating": {"$avg": "$rating"}, "review_count": {"$sum": 1}}}
    ]
    reviews = await db["reviews"].aggregate(pipeline_reviews).to_list(length=None)
    reviews_map = {doc["_id"]: doc for doc in reviews}

    # 3) Contracts per freelancer: compute completed contracts and total contracts
    pipeline_contracts = [
        {"$match": {"freelancer": {"$in": freelancer_oids}}},
        {"$group": {"_id": "$freelancer",
                    "total_contracts": {"$sum": 1},
                    "completed_contracts": {"$sum": {"$cond": [{"$eq": ["$status", "completed"]}, 1, 0]}}}}
    ]
    contracts = await db["contracts"].aggregate(pipeline_contracts).to_list(length=None)
    contracts_map = {doc["_id"]: doc for doc in contracts}

    # 4) Fetch freelancer documents (to read skills, stats if needed)
    freelancers_cursor = db["users"].find({"_id": {"$in": freelancer_oids}}, {"skills": 1, "stats": 1})
    freelancers_docs = await freelancers_cursor.to_list(length=None)
    freelancers_map = {f["_id"]: f for f in freelancers_docs}

    # Helper normalization functions
    def safe_div(a,b,default=0):
        try:
            return a / b if b and b != 0 else default
        except Exception:
            return default

    # We'll also compute price normalization: we find min and max bids among proposals to normalize
    bid_values = [p.get("bidAmount", 0) or 0 for p in proposals]
    min_bid = min(bid_values) if bid_values else 0
    max_bid = max(bid_values) if bid_values else 1
    # avoid zero range
    if max_bid - min_bid == 0:
        max_bid = min_bid + 1

    results = []

    for p in proposals:
        fid = p["freelancer"]
        freelancer_doc = freelancers_map.get(fid, {})
        # Proposal-specific
        bid = p.get("bidAmount", 0) or 0

        # Feature 1: avg_rating normalized 0..1 (rating / 5). If no reviews, give small prior 0.6*0.
        rv = reviews_map.get(fid)
        avg_rating = rv["avg_rating"] if rv else None
        if avg_rating is None:
            rating_score = 0.4 * 0  # you can pick prior, using 0 here
        else:
            rating_score = max(0.0, min(1.0, avg_rating / 5.0))

        # Feature 2: acceptance rate (accepted proposals / total proposals)
        ps = prop_stats_map.get(fid)
        if ps:
            acceptance_rate = safe_div(ps.get("accepted_proposals", 0), ps.get("total_proposals", 1))
        else:
            acceptance_rate = 0.0

        # Feature 3: success rate from contracts (completed_contracts / total_contracts)
        cs = contracts_map.get(fid)
        if cs:
            success_rate = safe_div(cs.get("completed_contracts", 0), cs.get("total_contracts", 1))
        else:
            success_rate = 0.0

        # Feature 4: skill match fraction
        freelancer_skills = freelancer_doc.get("skills", [])
        # both are arrays of ObjectId. Convert to strings for set operations
        job_skill_set = set(str(s) for s in job_skills)
        freelancer_skill_set = set(str(s) for s in freelancer_skills)
        if job_skill_set:
            skill_match = len(job_skill_set & freelancer_skill_set) / len(job_skill_set)
        else:
            skill_match = 0.0

        # Feature 5: price score (lower is better) normalized 0..1
        # We'll normalize by min/max bid: lower bid -> closer to 1
        price_norm = 1.0 - ( (bid - min_bid) / (max_bid - min_bid) )
        price_score = max(0.0, min(1.0, price_norm))

        # Combine weighted sum
        score = (
            WEIGHTS["rating"] * rating_score +
            WEIGHTS["acceptance_rate"] * acceptance_rate +
            WEIGHTS["success_rate"] * success_rate +
            WEIGHTS["skill_match"] * skill_match +
            WEIGHTS["price"] * price_score
        )

        results.append({
            "proposal_id": str(p["_id"]),
            "freelancer_id": str(fid),
            "score": float(round(score, 6)),
            "details": {
                "rating_score": round(rating_score, 4),
                "acceptance_rate": round(acceptance_rate, 4),
                "success_rate": round(success_rate, 4),
                "skill_match": round(skill_match, 4),
                "price_score": round(price_score, 4),
                "bid": bid,
            }
        })

    # sort descending by score
    results_sorted = sorted(results, key=lambda x: x["score"], reverse=True)
    return results_sorted[:top_n]

# health
@app.get("/health")
async def health():
    return {"status": "ok"}
