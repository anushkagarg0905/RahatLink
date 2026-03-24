from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db
from services.optimization import run_optimization

router = APIRouter()

@router.get("/", response_model=List[schemas.Allocation])
def get_allocations(db: Session = Depends(get_db)):
    return db.query(models.Allocation).order_by(models.Allocation.created_at.desc()).all()

@router.post("/manual", response_model=schemas.Allocation)
def manual_allocation(alloc: schemas.AllocationCreate, db: Session = Depends(get_db)):
    # check inventory
    inv = db.query(models.Inventory).filter(
        models.Inventory.warehouse_id == alloc.warehouse_id,
        models.Inventory.item_type == alloc.item_type
    ).first()
    
    if not inv or inv.quantity < alloc.qty:
        raise HTTPException(status_code=400, detail="Not enough stock in warehouse")
        
    # deduct inventory
    inv.quantity -= alloc.qty
    
    # Create allocation record
    new_alloc = models.Allocation(**alloc.model_dump())
    db.add(new_alloc)
    
    # Fulfill camp needs (deduct from oldest pending need for this item)
    needs = db.query(models.Need).filter(
        models.Need.camp_id == alloc.camp_id,
        models.Need.item_type == alloc.item_type,
        models.Need.quantity > 0
    ).order_by(models.Need.id.asc()).all()
    
    remaining_qty = alloc.qty
    for need in needs:
        if remaining_qty <= 0:
            break
        deduct = min(need.quantity, remaining_qty)
        need.quantity -= deduct
        remaining_qty -= deduct
        
        if need.quantity == 0:
            need.status = "Fulfilled"
        else:
            need.status = "Partial"
            
    db.commit()
    db.refresh(new_alloc)
    return new_alloc

@router.post("/optimize")
def optimize_allocations(db: Session = Depends(get_db)):
    # Run the optimization logic
    results = run_optimization(db)
    return {"status": "success", "allocations": results}
