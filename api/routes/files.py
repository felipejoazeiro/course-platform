import os
import io
import base64
import mimetypes
from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from fastapi.responses import FileResponse
from fastapi.responses import JSONResponse
from models.file_table import FileTable
from models.courses_table import CoursesTable
from PIL import Image
from sqlalchemy.orm import Session
from database import SessionLocal
from io import BytesIO
from pptx import Presentation


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok = True)

@router.get('/getFiles/{course_id}')
def get_files(course_id: int,db:Session = Depends(get_db)):
    files = db.query(FileTable).filter(FileTable.fk_course == course_id).all()    
    return files

@router.get('/getFilePDF/{file_id}')
def get_file(file_id: int, db: Session=Depends(get_db)):
    getFile = db.query(FileTable).filter(FileTable.id == file_id).first()
    file_path = getFile.path
        
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    file_like = open(file_path, "rb")

    return StreamingResponse(file_like, media_type="application/pdf")
    
@router.get('/getFileVideo/{file_id}')
def get_file_video(file_id: int, db: Session=Depends(get_db)):
    getFile = db.query(FileTable).filter(FileTable.id == file_id).first()
    
    file_path = getFile.path
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado no servidor")
    
    mime_type, _ = mimetypes.guess_type(file_path)
    
    if mime_type is None:
        mime_type = "application/octet-stream"
    
    file_like = open(file_path, "rb")
    
    return StreamingResponse(file_like, media_type=mime_type)

@router.get('/getApresentation/{file_id}')
async def get_file_apresentation(file_id: int, db: Session=Depends(get_db)):
    getFile = db.query(FileTable).filter(FileTable.id == file_id).first()
    file_path = getFile.path
    
    """ slides_base64 = convert_ppt_to_image(file_path)
         
    return{"slides": slides_base64} """
    
    ppt = Presentation(file_path)
    slides = []

    for slide in ppt.slides:
        img_base64 = slide_to_base64(slide)  # Converte cada slide em base64
        slides.append(img_base64)

    return {"slides": slides}

@router.post('/uploadFile')
async def upload_file(courseId: int = Form(...), type: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):  
    
    if not file:
        raise HTTPException(status_code=400, detail="No selected file")
    
    course = db.query(CoursesTable).filter(CoursesTable.id == courseId).first()
    
    file_path = os.path.join(UPLOAD_FOLDER, course.title, type ,file.filename)

    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    try:
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        name = ".".join(file.filename.split('.')[:-1]) 

        new_file = FileTable(name=name, path=file_path, fk_course=courseId, type= type)  
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)  
        raise HTTPException(status_code=500, detail={"message": "Erro ao salvar o arquivo", "error": str(e)})

    return {"message": "Arquivo salvo com sucesso."}
    
@router.put('/updateFile/{course_id}/{file_id}')
async def update_file(file_id: int ,course_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    existing_file = db.query(FileTable).filter(FileTable.id == file_id).first()
    course = db.query(CoursesTable).filter(CoursesTable.id == course_id).first()
    
    if not existing_file:
        raise HTTPException(status_code=404, detail="Arquivo não encontrado") 
    
    try:
        
        file_path = os.path.join(UPLOAD_FOLDER, course.title, existing_file.type, existing_file.name)
        
        print(existing_file.path)
        
        os.remove(existing_file.path)

        newfile_path = os.path.join(UPLOAD_FOLDER, course.title, existing_file.type, file.filename)
        
        existing_file.path = newfile_path
        existing_file.name = ".".join(file.filename.split('.')[:-1])
        db.commit()
        db.refresh(existing_file) 
        
        with open(newfile_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
        return {"message": "Arquivo atualizado com sucesso."}
    except Exception as e:
        db.rollback()  
        print(f"Erro ao atualizar o arquivo: {e}")
        raise HTTPException(status_code=500, detail=f"Erro ao atualizar o arquivo: {str(e)}")
    
@router.delete('/deleteFile/{file_id}')
def delete_file(file_id: int, db: Session = Depends(get_db)):
    file = db.query(FileTable).filter(FileTable.id == file_id).first()
    
    if not file: 
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")
    
    try:
        os.remove(file.path)
        db.delete(file)
        db.commit()
        return {"message": "Arquivo deletado com sucesso."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao deletar arquivo: {str(e)}")
    