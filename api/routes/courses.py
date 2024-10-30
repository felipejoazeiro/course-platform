from fastapi import APIRouter, HTTPException, Depends

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post('/newCourse')
def newCourse(course: Course, db: Session = Depends(get_db)):
    existingCourse = db.query(CoursesTable).filter(CoursesTable.title == course.title, CoursesTable.department_id == course.department_id).first()
    if existingCourse:
        raise HTTPException(status_code: 400, detail={"message": "Curso já existente"})
    
    db_course = CoursesTable(**course.dict())
    db.add(db_course)
    db.commit
    db.refresh(db_course)
    
    return {"message": "Curso criado com sucesso"}
    