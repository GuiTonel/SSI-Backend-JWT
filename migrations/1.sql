CREATE TABLE transfer (
id INTEGER PRIMARY KEY AUTOINCREMENT,
author INTEGER, 
destiny INTEGER, 
price REAL, 
FOREIGN KEY(author) REFERENCES user(id),
FOREIGN KEY(destiny) REFERENCES user(id)
);