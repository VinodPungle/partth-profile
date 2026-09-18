from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
from contextlib import asynccontextmanager

from seed_data import PORTFOLIO

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    await db.portfolio.update_one({"key": "main"}, {"$set": PORTFOLIO}, upsert=True)
    await db.contact_messages.create_index("created_at")
    await db.events.create_index("type")
    logger.info("Portfolio content seeded")
    yield
    client.close()


app = FastAPI(lifespan=lifespan)
api_router = APIRouter(prefix="/api")


class ContactCreate(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    subject: Optional[str] = Field(default="", max_length=120)
    message: str = Field(min_length=10, max_length=2000)


class ContactMessage(ContactCreate):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    read: bool = False


class EventCreate(BaseModel):
    type: str = Field(min_length=1, max_length=40)
    label: Optional[str] = Field(default="", max_length=120)


@api_router.get("/")
async def root():
    return {"message": "Portfolio API", "status": "ok"}


@api_router.get("/portfolio")
async def get_portfolio():
    doc = await db.portfolio.find_one({"key": "main"}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Portfolio content not found")
    return doc


@api_router.post("/contact", response_model=ContactMessage, status_code=201)
async def create_contact(payload: ContactCreate):
    msg = ContactMessage(**payload.model_dump())
    await db.contact_messages.insert_one(msg.model_dump())
    logger.info("New contact message from %s", msg.email)
    return msg


@api_router.get("/contact", response_model=List[ContactMessage])
async def list_contacts():
    docs = await db.contact_messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api_router.post("/events", status_code=201)
async def track_event(payload: EventCreate):
    await db.events.insert_one({
        "id": str(uuid.uuid4()),
        "type": payload.type,
        "label": payload.label,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


@api_router.get("/stats")
async def stats():
    pipeline = [{"$group": {"_id": "$type", "count": {"$sum": 1}}}]
    rows = await db.events.aggregate(pipeline).to_list(50)
    messages = await db.contact_messages.count_documents({})
    return {"events": {r["_id"]: r["count"] for r in rows}, "messages": messages}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
