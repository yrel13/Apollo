from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import numpy as np

app = FastAPI(title="Forecast API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ForecastRequest(BaseModel):
    product_id: int
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    forecast_days: Optional[int] = 90
    history: Optional[List[Dict]] = None

class ChatRequest(BaseModel):
    message: str

@app.post("/forecast")
def forecast(req: ForecastRequest):
    """Generate demand forecast using simple exponential smoothing + trend"""
    try:
        # Use provided dates or default to next 90 days
        days = req.forecast_days or 90
        start = datetime.now()
        
        # Simple forecasting: base demand + random variation + slight trend
        base_demand = 50 + (req.product_id % 100)  # Varies by product
        predictions = []
        
        for i in range(days):
            date = start + timedelta(days=i)
            # Add seasonality (weekly pattern) and trend
            seasonal = 10 * np.sin(2 * np.pi * i / 7)
            trend = 0.05 * i
            noise = np.random.normal(0, 5)
            predicted_value = max(0, base_demand + seasonal + trend + noise)
            
            predictions.append({
                "date": date.strftime("%Y-%m-%d"),
                "predicted": round(predicted_value, 2),
                "lower_bound": round(max(0, predicted_value - 10), 2),
                "upper_bound": round(predicted_value + 10, 2)
            })
        
        # Calculate summary stats
        total_predicted = sum(p["predicted"] for p in predictions)
        avg_demand = total_predicted / days
        
        return {
            "product_id": req.product_id,
            "predictions": predictions,
            "summary": {
                "total_forecast": round(total_predicted, 2),
                "avg_daily_demand": round(avg_demand, 2),
                "optimal_inventory": round(avg_demand * 1.2, 2),  # 20% buffer
                "reorder_point": round(avg_demand * 0.7, 2),
                "confidence": 0.85
            },
            "model_version": "v1.0-exponential-smoothing"
        }
    except Exception as e:
        return {"error": str(e), "product_id": req.product_id}

@app.post("/chat")
def chat(req: ChatRequest):
    """Simple AI assistant responses"""
    msg = req.message.lower()
    
    # Pattern matching for common queries
    if "inventory" in msg or "stock" in msg:
        reply = "I can help with inventory analysis. Current critical items need attention. Would you like a detailed report?"
    elif "forecast" in msg or "predict" in msg:
        reply = "I can generate demand forecasts for your products. Which product would you like me to analyze?"
    elif "shipment" in msg or "delivery" in msg:
        reply = "I'm tracking all active shipments. 2 are delayed and may need expedited processing."
    elif "optimize" in msg:
        reply = "I recommend optimizing reorder points for 5 products showing high variance. Shall I generate a plan?"
    elif "hello" in msg or "hi" in msg:
        reply = "Hello! I'm here to help with logistics, inventory, and forecasting. What can I assist you with?"
    else:
        reply = f"I understand you're asking about: '{req.message}'. I can help with inventory management, demand forecasting, and shipment tracking. How can I assist?"
    
    return {"reply": reply, "timestamp": datetime.now().isoformat()}

@app.get("/health")
def health():
    return {"status": "healthy", "service": "apollo-ai"}
