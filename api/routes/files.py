import os
from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from models.file_table import FileTable
from sqlalchemy.orm import Session
from database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok = True)

@router.post('/uploadFile')
async def upload_file(courseId: int = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):  
    
    if not file:
        raise HTTPException(status_code=400, detail="No selected file")

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    try:
        # Salva o arquivo
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        # Aqui, você deve ter lógica para adicionar o arquivo no banco de dados
        new_file = FileTable(name=file.filename, path=file_path, fk_course=courseId, type= 'PDF')  # Ajuste conforme sua model
        db.add(new_file)
        db.commit()
        db.refresh(new_file)
    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)  # Limpa o arquivo se houver um erro
        raise HTTPException(status_code=500, detail={"message": "Erro ao salvar o arquivo", "error": str(e)})

    return {"message": "Arquivo salvo com sucesso."}
    
    