from fastapi import APIRouter, HTTPException, Depends, FastAPI, Form
from sqlalchemy.orm import Session
from database import SessionLocal
from models.course import Course
from models.courses_table import CoursesTable
from models.get_course import GetCourse
from models.employee_table import EmployeeTable
from models.employee_courses import EmployeeCoursesTable
from models.course_complete import CourseComplete
from models.departments_table import DepartmentsTable
from auth import get_current_user


router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@router.post('/newCourse')
def newCourse(title: str=Form(...), description: str=Form(...), department_id: int=Form(...), db: Session = Depends(get_db)):
    existingCourse = db.query(CoursesTable).filter(CoursesTable.title == title, CoursesTable.department_id == department_id).first()
    if existingCourse:
        raise HTTPException(status_code= 400, detail={"message": "Curso já existente"})
    
    db_course = CoursesTable(title=title, description=description, department_id=department_id)
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    
    return {"message": "Curso criado com sucesso"}

@router.get('/courses')
def getAllCourses(department_id: int, db: Session = Depends(get_db), current_user: int = Depends(get_current_user)):
    try:
        courses_query = db.query(CoursesTable).filter(CoursesTable.department_id == department_id).all()
        
        completed_courses_query = db.query(EmployeeCoursesTable).filter(EmployeeCoursesTable.employee_id == current_user).all()
        completed_course_ids = {course.id for course in completed_courses_query}
        
        courses = []
        for course in courses_query:
            courses.append({
                "id": course.id,
                "title": course.title,
                "description": course.description,
                "completed": course.id in completed_course_ids
            })
        return {
            "department_id": department_id,
            "courses": courses
        }
    except Exception as e:
        print(e)  

@router.post('/completeCourse')
def completeCourse(courseComplete: CourseComplete, db: Session = Depends(get_db)):
    db_course_complete = EmployeeCoursesTable(**courseComplete.dict())
    db.add(db_course_complete)
    db.commit()
    db.refresh(db_course_complete)
    
    return{"message": "Curso completado!"}

@router.get('/employee/completed_courses')
def get_completed_courses(db:Session=Depends(get_db)):
    
    employees = db.query(EmployeeTable).all()
    
    employee_list = []
    
    for employee in employees:
        courses = (db.query(CoursesTable.id.label("id"), CoursesTable.title.label("title"), DepartmentsTable.name.label("department_name"), EmployeeCoursesTable.completion_date.label("completion_date")).join(EmployeeCoursesTable, EmployeeCoursesTable.course_id==CoursesTable.id).join(DepartmentsTable, CoursesTable.department_id==DepartmentsTable.id).filter(EmployeeCoursesTable.employee_id == employee.id)).all()
        employee_data = {"id": employee.id, "name": employee.name, "register": employee.registration, "email": employee.email,"courses":[{"id":course.id, "title": course.title, "department_name": course.department_name, "completion_date": course.completion_date} for course in courses]}
        
        employee_list.append(employee_data)


    return {"lista":employee_list}
    