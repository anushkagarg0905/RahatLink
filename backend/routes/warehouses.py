from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import models, schemas
from database import get_db

router = APIRouter()

@router.get("/", response_model=List[schemas.Warehouse])
def get_warehouses(db: Session = Depends(get_db)):
    return db.query(models.Warehouse).all()

@router.post("/", response_model=schemas.Warehouse)
def create_warehouse(warehouse: schemas.WarehouseCreate, db: Session = Depends(get_db)):
    new_warehouse = models.Warehouse(**warehouse.model_dump())
    db.add(new_warehouse)
    db.commit()
    db.refresh(new_warehouse)
    return new_warehouse

@router.get("/{warehouse_id}/inventory", response_model=List[schemas.Inventory])
def get_inventory(warehouse_id: int, db: Session = Depends(get_db)):
    return db.query(models.Inventory).filter(models.Inventory.warehouse_id == warehouse_id).all()

@router.post("/{warehouse_id}/inventory", response_model=schemas.Inventory)
def update_inventory(warehouse_id: int, inv: schemas.InventoryCreate, db: Session = Depends(get_db)):
    # Check if item exists
    db_inv = db.query(models.Inventory).filter(
        models.Inventory.warehouse_id == warehouse_id,
        models.Inventory.item_type == inv.item_type
    ).first()
    
    if db_inv:
        db_inv.quantity += inv.quantity
        db.commit()
        db.refresh(db_inv)
        return db_inv
    else:
        new_inv = models.Inventory(warehouse_id=warehouse_id, item_type=inv.item_type, quantity=inv.quantity)
        db.add(new_inv)
        db.commit()
        db.refresh(new_inv)
        return new_inv
