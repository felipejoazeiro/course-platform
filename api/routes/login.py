from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import SessionLocal
from models.access_table import AccessTable
import bcrypt
from models.user_login import Login


from models.user_login import Login

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/login')
def login(login: Login, db: Session = Depends(get_db)):
    
    access_record = db.query(AccessTable).filter(AccessTable.username == login.username).first()
    if not access_record:
        raise HTTPException(status_code=400, detail="Login não existe.")
    
    if not bcrypt.checkpw(login.password.encode('utf-8'), access_record.password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Senha incorreta.")
    
    if access_record.first_access:
       raise HTTPException(status_code=202, detail="Resetar senha")  
     
    if bcrypt.checkpw(access_record.password.encode('utf-8'), login.password.encode('utf-8')):
        return{"message": "Sucesso"}
    
        
    return {"message": "Página de login", "user_id": access_record.fk_employee}

    