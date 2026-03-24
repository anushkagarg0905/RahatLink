from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    role = Column(String) # 'Warehouse' or 'NGO'
    location_lat = Column(Float, nullable=True)
    location_lng = Column(Float, nullable=True)

class Warehouse(Base):
    __tablename__ = "warehouses"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    address = Column(String)

    inventory = relationship("Inventory", back_populates="warehouse")

class Inventory(Base):
    __tablename__ = "inventory"
    id = Column(Integer, primary_key=True, index=True)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    item_type = Column(String) # Food, Water, Medical Kits, Essentials
    quantity = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow)

    warehouse = relationship("Warehouse", back_populates="inventory")

class Camp(Base):
    __tablename__ = "camps"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    is_disaster_zone = Column(Boolean, default=False)
    urgency = Column(String) # Low, Medium, High, Critical

    needs = relationship("Need", back_populates="camp")

class Need(Base):
    __tablename__ = "needs"
    id = Column(Integer, primary_key=True, index=True)
    camp_id = Column(Integer, ForeignKey("camps.id"))
    item_type = Column(String)
    quantity = Column(Integer)
    urgency = Column(String)
    status = Column(String, default="Pending") # Pending, Partial, Fulfilled

    camp = relationship("Camp", back_populates="needs")

class Allocation(Base):
    __tablename__ = "allocations"
    id = Column(Integer, primary_key=True, index=True)
    warehouse_id = Column(Integer, ForeignKey("warehouses.id"))
    camp_id = Column(Integer, ForeignKey("camps.id"))
    item_type = Column(String)
    qty = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class News(Base):
    __tablename__ = "news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    location = Column(String)
    lat = Column(Float)
    lng = Column(Float)
    is_verified = Column(Boolean, default=False)
    date = Column(DateTime, default=datetime.utcnow)
