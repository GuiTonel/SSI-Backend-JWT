const md5 = require("md5")
const User = require("./models.js")
const db = require("../database.js")


async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM user WHERE email = ?;", email, (err, raw) => {
        if (err) {
            console.log(err);
            return reject(err);
        } else {
            if (!raw) {
                return resolve(false);
            }
            const user = new User(raw);
            return resolve(user);
        }
    })
})
}

async function getUserById(id) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM user WHERE id = ?;", id, (err, raw) => {
        if (err) {
            console.log(err);
            return reject(err);
        } else {
            if (!raw) {
                return resolve(false);
            }
            const user = new User(raw);
            return resolve(user);
        }
    })
})
}

async function updateUserValue(id, value) {
    return new Promise((resolve, reject) => {
        db.run("UPDATE user SET money = money - ? WHERE id = ?;", [value, id], (err, _) => {
        if (err) {
            console.log(err);
            return reject(err);
        } else {
            return resolve(true);
        }
    })
})
}

async function getUserByEmailAndPassword(email, password) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM user WHERE email = ? AND password = ?;", [email, password], (err, raw) => {
        if (err) {
            console.log(err);
            return reject(err);
        } else {
            if (!raw) {
                return resolve(false);
            }
            const user = new User(raw);
            return resolve(user);
        }
    })
})
}

async function registerUser(name, email, password) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO user (name, email, password) VALUES (?, ?, ?) ", [name, email, md5(password)], function (err, _) {
            if (err) {
                console.log(err);
                return reject(err);
            } else {
                return resolve(this.lastID);
            }
        });

    })
}

async function registerTransfer(author, destiny, value) {
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO transfer (author, destiny, price) VALUES (?, ?, ?);", [author, destiny, value], function (err, _) {
            if (err) {
                console.log(err);
                return reject(err);
            } else {
                return resolve(this.lastID);
            }
        });

    })
}


async function listTransfers(user) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT transfer.id, author, author_user.name as author_name, destiny_user.name as destiny_name, destiny, price FROM transfer 
        JOIN user as destiny_user ON destiny_user.id = transfer.destiny 
        JOIN user as author_user ON author_user.id = transfer.author 
        WHERE author = ? OR destiny = ?;`, [user, user], function (err, raws) {
            if (err) {
                console.log(err);
                return reject(err);
            } else {
                return resolve(raws);
            }
        });
    })
}

async function listUsers() {
    return new Promise((resolve, reject) => {
        db.all(`SELECT name, email, money, is_admin FROM user;`, function (err, raws) {
            if (err) {
                console.log(err);
                return reject(err);
            } else {
                return resolve(raws);
            }
        });
    })
}

module.exports = {
    getUserByEmail,
    registerUser,
    getUserById,
    getUserByEmailAndPassword,
    updateUserValue,
    registerTransfer,
    listTransfers,
    listUsers
}