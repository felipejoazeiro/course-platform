from fastapi import FastAPI, File, UploadFile, APIRouter, Form, Depends
from google.cloud import storage
from models.courses_table import CoursesTable
from models.file_table import FileTable
from sqlalchemy.orm import Session
from database import SessionLocal
from dotenv import load_dotenv
import os

load_dotenv()

BUCKET_NAME = "apresentation_storage"

router = APIRouter()

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "coursesplatform-9af63b3e2d73.json"

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def upload_to_google_cloud(file: UploadFile, bucket_name: str, destination_blob_name: str):
    storage_client = storage.Client()
    
    bucket = storage_client.get_bucket(bucket_name)
    
    blob = bucket.blob(destination_blob_name)
    
    blob.upload_from_file(file.file)
        
    return blob.public_url

@router.post("/uploadPPT")
async def upload_PPT(courseId: int = Form(...), type: str = Form(...), file: UploadFile = File(...),db: Session = Depends(get_db)):
    course = db.query(CoursesTable).filter(CoursesTable.id==courseId).first()
    file_name = file.filename
    destination_blob_name = f"uploads/{course.title}/{file_name}"
    print(os.getenv('GOOGLE_APPLICATION_CREDENTIALS'))    
    try:
        file_url = upload_to_google_cloud(file, BUCKET_NAME, destination_blob_name)
        
        name = ".".join(file.filename.split('.')[:-1])
        
        new_file = FileTable(name=name, path=file_url, fk_course=courseId, type = type)
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
        
        return {"file_url": file_url, "message": "Arquivo salvo com sucesso."}
    except Exception as e:
        return {"error": str(e)}