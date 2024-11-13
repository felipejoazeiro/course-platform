import os
import io
import base64
import mimetypes
import unicodedata
import re
from fastapi import FastAPI, File, UploadFile, APIRouter, Form, Depends
from google.cloud import storage
from models.courses_table import CoursesTable
from models.file_table import FileTable
from sqlalchemy.orm import Session
from database import SessionLocal
from dotenv import load_dotenv
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google.oauth2 import service_account
from google.cloud import storage
from google.oauth2.service_account import Credentials
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload

load_dotenv()

BUCKET_NAME = "apresentation_storage"

router = APIRouter()

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "coursesplatform-9af63b3e2d73.json"

creds = Credentials.from_service_account_file("coursesplatform-api.json")
drive_service = build('drive', 'v3',credentials=creds)
slides_service = build('slides', 'v1')

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
    
    normalized_name = unicodedata.normalize('NFKD', course.title).encode('ascii', 'ignore').decode('ascii')

    safe_name = re.sub(r'[^a-zA-Z0-9]', '-', normalized_name)

    safe_name = re.sub(r'-+', '-', safe_name)

    safe_name = safe_name.strip('-')
    
    normalized_file_name = unicodedata.normalize('NFKD', file_name).encode('ascii', 'ignore').decode('ascii')
    
    safe_file_name = re.sub(r'[^a-zA-Z0-9]', '-', normalized_file_name)
    
    safe_file_name = re.sub(r'-+', '-', safe_file_name)
    
    safe_file_name = safe_file_name.strip('-')
    
    destination_blob_name = f"uploads/{safe_name}/{safe_file_name}"
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
    
    
def download_file_from_storage(file_url):
    url = file_url

    file_path = url.replace("https://storage.googleapis.com/apresentation_storage/", "")
    
    bucket_name = "apresentation_storage"
    
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(BUCKET_NAME)
    
    blob = bucket.blob(file_path) 
    
    local_file_path = os.path.join("/tmp", file_path.split('/')[-1])
    
    try:
        os.makedirs(os.path.dirname(local_file_path), exist_ok=True)
        
        blob.download_to_filename(local_file_path)
        
        print(f"Arquivo {file_path} baixado com sucesso para {local_file_path}")
        return local_file_path
    
    except Exception as e:
        print(f"Erro ao baixar o arquivo: {e}")
        return None


def create_drive_service():
    credentials = service_account.Credentials.from_service_account_file(
        "coursesplatform-api.json", scopes=["https://www.googleapis.com/auth/drive.file"]
    )
    drive_service = build("drive", "v3", credentials=credentials)
    return drive_service

def upload_to_drive(file_path):
    drive_service = create_drive_service()

    file_metadata = {'name': file_path.split('/')[-1], "mimeType": "application/vnd.google-apps.presentation"}
    media = MediaFileUpload(file_path, mimetype='application/vnd.openxmlformats-officedocument.presentationml.presentation')

    file = drive_service.files().create(body=file_metadata, media_body=media, fields='id').execute()
    print(f"Arquivo carregado com sucesso no Google Drive com ID: {file['id']}")
    return file['id']

def convert_to_google_slides(drive_file_id):
    drive_service = create_drive_service()

    mime_type = "application/vnd.google slides"
    
    drive_service.permissions().create(fileId = drive_file_id, body={'role': 'reader', 'type': 'anyone'}).execute()

    file = drive_service.files().update(
        fileId=drive_file_id,
        body={"mimeType": mime_type}
    ).execute()

    print(f"Arquivo convertido para Google Slides com sucesso!")
    return file['id']    

@router.get("/getApresentation/{file_id}")
async def get_file(file_id: str, db: Session = Depends(get_db)):
    file = db.query(FileTable).filter(FileTable.id == file_id).first()
    
    local_file_path = download_file_from_storage(file.path)
    drive_file_id = upload_to_drive(local_file_path)
    slides_file_id = convert_to_google_slides(drive_file_id)
    
    return {'slidesFileId':slides_file_id}
        
    