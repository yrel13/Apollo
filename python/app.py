from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="Forecast API")

class ForecastRequest(BaseModel):
    product_id: int
    start_date: str = None
    end_date: str = None
    history: List[Dict] = None

@app.post("/forecast")
def forecast(req: ForecastRequest):
    # placeholder quick response
    return {"product_id": req.product_id, "predictions":[{"date":"2025-09-30","predicted":10}], "model_version":"v0.1"}
