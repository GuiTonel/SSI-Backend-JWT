CREATE TABLE user (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name text, 
is_admin INTEGER DEFAULT 0, 
email text UNIQUE, 
money real DEFAULT 1000, 
password text, 
CONSTRAINT email_unique UNIQUE (email)
);