create table employee(
	id smallserial primary key not null,
	name varchar(50) not null,
	registration varchar(50) not null,
	email varchar(50) not null
	admin boolean not null DEFAULT FALSE
);

create table access(
	id smallserial primary key not null,
	username varchar(50) not null unique,
	password varchar(50) not null,
	fk_employee int not null,
	first_access bool not null
);

create table verification_codes(
	id smallserial primary key not null,
	user_id smallserial not null,
	code int not null,
	created_at DATETIME not null
);

create table departments(
	id smallserial primary key not null,
	name VARCHAR(100) not null
);

create table courses(
	id smallserial primary key not null,
	title VARCHAR(50) not null,
	description TEXT,
	department_id smallserial,
	FOREIGN KEY (department_id) REFERENCES departments(id)
);

create table employee_courses(
	id smallserial primary key not null,
	employee_id smallserial not null,
	course_id smallserial not null,
	completion_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (employee_id) REFERENCES employee(id),
	FOREIGN KEY (course_id) REFERENCES courses(id),
	UNIQUE (employee_id, course_id)
);

create table files (
	id SERIAL PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	tipo VARCHAR(50) NOT NULL,
	caminho VARCHAR(255) NOT NULL,
	data_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);