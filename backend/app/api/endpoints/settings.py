import json
from fastapi import APIRouter, HTTPException
from app.models.settings_model import SettingsModel
from app.core.config import SETTINGS_FILE_PATH

router = APIRouter()

@router.get("/settings", response_model=SettingsModel)
async def get_settings():
    try:
        with open(SETTINGS_FILE_PATH, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Settings not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/settings")
async def update_settings(settings: SettingsModel):
    try:
        with open(SETTINGS_FILE_PATH, 'w') as f:
            json.dump(settings.dict(), f, indent=2)
        return {"message": "Settings updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
