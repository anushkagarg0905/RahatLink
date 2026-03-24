import math
from sqlalchemy.orm import Session
import models

def haversine(lat1, lon1, lat2, lon2):
    # Radius of earth in kilometers
    R = 6371.0
    
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance

def run_optimization(db: Session):
    # Step 1: Load and classify
    camps = db.query(models.Camp).all()
    # Fetch unfulfilled needs
    needs = db.query(models.Need).filter(models.Need.quantity > 0).all()
    
    # Needs Grouped by camp
    camp_needs = {}
    for n in needs:
        if n.camp_id not in camp_needs:
            camp_needs[n.camp_id] = []
        camp_needs[n.camp_id].append(n)
        
    warehouses = db.query(models.Warehouse).all()
    
    # Priority rank: 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1
    urgency_map = {'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1}
    
    # Step 2: Priority Sort
    def camp_sort_key(camp):
        # 1. Disaster Zone first
        # 2. Urgency level
        is_dz = 1 if camp.is_disaster_zone else 0
        urg_val = urgency_map.get(camp.urgency, 0)
        return (is_dz, urg_val)
        
    camps_sorted = sorted(camps, key=camp_sort_key, reverse=True)
    
    allocations_made = []
    
    # Step 3 & 4: Nearest Warehouse & Greedy Allocation
    for camp in camps_sorted:
        c_needs = camp_needs.get(camp.id, [])
        for need in c_needs:
            if need.quantity <= 0:
                continue
                
            # Find warehouses with the needed item
            available_whs = []
            for wh in warehouses:
                # find inventory
                inv = db.query(models.Inventory).filter(
                    models.Inventory.warehouse_id == wh.id,
                    models.Inventory.item_type == need.item_type,
                    models.Inventory.quantity > 0
                ).first()
                if inv:
                    dist = haversine(camp.lat, camp.lng, wh.lat, wh.lng)
                    available_whs.append((dist, wh, inv))
            
            # Sort by distance
            available_whs.sort(key=lambda x: x[0])
            
            for dist, wh, inv in available_whs:
                if need.quantity <= 0:
                    break
                
                allocate_qty = min(need.quantity, inv.quantity)
                
                # Make allocation
                new_alloc = models.Allocation(
                    warehouse_id=wh.id,
                    camp_id=camp.id,
                    item_type=need.item_type,
                    qty=allocate_qty
                )
                db.add(new_alloc)
                allocations_made.append(new_alloc)
                
                # Update inventory and need
                inv.quantity -= allocate_qty
                need.quantity -= allocate_qty
                
                if need.quantity == 0:
                    need.status = "Fulfilled"
                else:
                    need.status = "Partial"
                    
    # Step 5: State Update
    db.commit()
    
    return [
       {"warehouse_id": a.warehouse_id, "camp_id": a.camp_id, "item_type": a.item_type, "qty": a.qty}
       for a in allocations_made
    ]
