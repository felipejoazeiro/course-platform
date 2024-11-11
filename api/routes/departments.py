from fastapi import APIRouter, HTTPException, Depends, Form
from models.department import Department
from models.departments_table import DepartmentsTable
from sqlalchemy.orm import Session
from database import SessionLocal


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post('/newDepartment')
def newDepartment(name: str = Form(...), db:Session = Depends(get_db)):
    existingDepartment = db.query(DepartmentsTable).filter(DepartmentsTable.name == name).first()
    if existingDepartment:
        raise HTTPException(status_code= 400, detail={"message": "Departamento já existente"})
    
    db_department = DepartmentsTable(name= name)
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    
    return{"message": "Departamento criado com sucesso"}

@router.get('/departments')
def getAllDepartments(db: Session = Depends(get_db)):
    departments = db.query(DepartmentsTable).all()
    return departments