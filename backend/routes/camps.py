from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Camp])
def get_camps(db: Session = Depends(get_db)):
    return db.query(models.Camp).all()

@router.post("/", response_model=schemas.Camp)
def create_camp(camp: schemas.CampCreate, db: Session = Depends(get_db)):
    new_camp = models.Camp(**camp.model_dump())
    db.add(new_camp)
    db.commit()
    db.refresh(new_camp)
    return new_camp

@router.get("/{camp_id}/needs", response_model=List[schemas.Need])
def get_needs(camp_id: int, db: Session = Depends(get_db)):
    return db.query(models.Need).filter(models.Need.camp_id == camp_id).all()

@router.post("/{camp_id}/needs", response_model=schemas.Need)
def submit_need(camp_id: int, need: schemas.NeedCreate, db: Session = Depends(get_db)):
    # Create need
    new_need = models.Need(
        camp_id=camp_id,
        item_type=need.item_type,
        quantity=need.quantity,
        urgency=need.urgency
    )
    db.add(new_need)
    db.commit()
    db.refresh(new_need)
    
    # Also update camp urgency if this need's urgency is higher
    # Priority rank: Critical > High > Medium > Low
    camp = db.query(models.Camp).filter(models.Camp.id == camp_id).first()
    urgency_map = {'Low': 1, 'Medium': 2, 'High': 3, 'Critical': 4}
    if urgency_map.get(need.urgency, 0) > urgency_map.get(camp.urgency, 0):
        camp.urgency = need.urgency
        db.commit()
        
    return new_need
