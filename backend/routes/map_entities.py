from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import models
from database import get_db

router = APIRouter()

@router.get("/", response_model=Dict[str, List[Any]])
def get_map_entities(db: Session = Depends(get_db)):
    # Returns all map markers: warehouses and camps
    warehouses = db.query(models.Warehouse).all()
    camps = db.query(models.Camp).all()
    
    return {
        "warehouses": [{"id": w.id, "name": w.name, "lat": w.lat, "lng": w.lng, "address": w.address} for w in warehouses],
        "camps": [{"id": c.id, "name": c.name, "lat": c.lat, "lng": c.lng, "is_disaster_zone": c.is_disaster_zone, "urgency": c.urgency} for c in camps]
    }
