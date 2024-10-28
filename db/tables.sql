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

create table verification_codes(
	id smallserial primary key not null,
	user_id smallserial not null,
	code int not null,
	created_at DATETIME not null
);