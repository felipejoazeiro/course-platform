from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.access_table import AccessTable
import bcrypt

from models.user_login import Login

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/login')
def login(registration: str, password: str, db: Session = Depends(get_db)):
    
    
    
    access_record = db.query(AccessTable).filter(AccessTable.login == registration).first()
    if not access_record:
        raise HTTPException(status_code=401, detail="Registro não encontrado.")
    
    if access_record.password == password and access_record.password == access_record.username:
        raise HTTPException(status_code=402, detail="Resetar senha")
    
    if access_record.password == password:
        return{"mensagem": "Sucesso"}
    
    if not access_record.password == password:
        raise HTTPException(status_code=400, detail="Senha incorreta")
    
    
        
    return {"mensagem": "Página de login"}

    