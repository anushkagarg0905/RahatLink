from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any
import models
from database import get_db
from sqlalchemy import func

router = APIRouter()

@router.get("/summary", response_model=Dict[str, Any])
def get_analytics_summary(db: Session = Depends(get_db)):
    # Total supply vs demand
    total_supply = db.query(func.sum(models.Inventory.quantity)).scalar() or 0
    total_demand = db.query(func.sum(models.Need.quantity)).scalar() or 0
    total_alerts = db.query(models.News).filter(models.News.is_verified == True).count()
    
    # Demand by item category
    demand_by_category = db.query(
        models.Need.item_type, func.sum(models.Need.quantity)
    ).group_by(models.Need.item_type).all()
    
    # Supply by item category
    supply_by_category = db.query(
        models.Inventory.item_type, func.sum(models.Inventory.quantity)
    ).group_by(models.Inventory.item_type).all()

    # Total distributions made
    total_allocations = db.query(func.sum(models.Allocation.qty)).scalar() or 0

    return {
        "total_supply": total_supply,
        "total_demand": total_demand,
        "total_alerts": total_alerts,
        "total_allocations": total_allocations,
        "demand_by_category": dict(demand_by_category),
        "supply_by_category": dict(supply_by_category)
    }
