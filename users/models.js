class User {
    constructor({name, email, id = null, is_admin = false}) {
        this.name = name;
        this.email = email;
        this.id = id;
        this.isAdmin = is_admin;
    }

    toJson() {
        return {
            "name": this.name,
            "email": this.email,
            "id": this.id,
        }
    }
}

module.exports = User