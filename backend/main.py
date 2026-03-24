from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base

# Import models to create tables
import models

# Create the database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="RahatLink API", description="Smart Disaster Relief Inventory Optimizer API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers here later
from routes import auth, warehouses, camps, allocations, news, map_entities, analytics

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(warehouses.router, prefix="/api/warehouses", tags=["warehouses"])
app.include_router(camps.router, prefix="/api/camps", tags=["camps"])
app.include_router(allocations.router, prefix="/api/allocations", tags=["allocations"])
app.include_router(news.router, prefix="/api/news", tags=["news"])
app.include_router(map_entities.router, prefix="/api/map", tags=["map"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["analytics"])

@app.get("/")
def read_root():
    return {"message": "Welcome to RahatLink API"}
