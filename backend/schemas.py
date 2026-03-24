from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

# --- User ---
class UserBase(BaseModel):
    name: str
    email: str
    role: str # 'Warehouse' or 'NGO'
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str

# --- Warehouse ---
class WarehouseBase(BaseModel):
    name: str
    lat: float
    lng: float
    address: Optional[str] = None

class WarehouseCreate(WarehouseBase):
    user_id: int

class Warehouse(WarehouseBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# --- Inventory ---
class InventoryBase(BaseModel):
    item_type: str
    quantity: int

class InventoryCreate(InventoryBase):
    pass

class Inventory(InventoryBase):
    id: int
    warehouse_id: int
    updated_at: datetime
    class Config:
        from_attributes = True

# --- Camp ---
class CampBase(BaseModel):
    name: str
    lat: float
    lng: float
    is_disaster_zone: bool = False
    urgency: str

class CampCreate(CampBase):
    user_id: int

class Camp(CampBase):
    id: int
    user_id: int
    class Config:
        from_attributes = True

# --- Need ---
class NeedBase(BaseModel):
    item_type: str
    quantity: int
    urgency: str

class NeedCreate(NeedBase):
    pass

class Need(NeedBase):
    id: int
    camp_id: int
    status: str
    class Config:
        from_attributes = True

# --- Allocation ---
class AllocationBase(BaseModel):
    warehouse_id: int
    camp_id: int
    item_type: str
    qty: int

class AllocationCreate(AllocationBase):
    pass

class Allocation(AllocationBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# --- News ---
class NewsBase(BaseModel):
    title: str
    location: str
    lat: float
    lng: float
    is_verified: bool = False

class NewsCreate(NewsBase):
    pass

class News(NewsBase):
    id: int
    date: datetime
    class Config:
        from_attributes = True
