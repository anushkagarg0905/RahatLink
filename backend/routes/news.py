from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.News])
def get_news(db: Session = Depends(get_db)):
    return db.query(models.News).order_by(models.News.date.desc()).all()

@router.post("/", response_model=schemas.News)
def create_news(news: schemas.NewsCreate, db: Session = Depends(get_db)):
    new_article = models.News(**news.model_dump())
    db.add(new_article)
    db.commit()
    db.refresh(new_article)
    
    # If the news is verified, check if any camp matches the location 
    # to mark as disaster zone and upgrade urgency to Critical.
    if new_article.is_verified:
        camps = db.query(models.Camp).all()
        # Simplistic matching: if location text matches or proximity is close
        # For hackathon, just marking campsites with the same name as news location
        for camp in camps:
            if camp.name.lower() in new_article.location.lower() or new_article.location.lower() in camp.name.lower():
                camp.is_disaster_zone = True
                camp.urgency = 'Critical'
        db.commit()
        
    return new_article
