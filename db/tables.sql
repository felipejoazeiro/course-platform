create table employee(
	id smallserial primary key not null,
	name varchar(50) not null,
	registration varchar(50) not null,
	email varchar(50) not null
);

create table access(
	id smallserial primary key not null,
	username varchar(50) not null unique,
	password varchar(50) not null,
	fk_employee int not null
);