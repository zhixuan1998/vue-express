const jwt = require('jsonwebtoken');
const { ObjectId } = require("mongodb")

module.exports = class User {
    constructor({
        firstName = null,
        lastName = null,
        gender = null,
        dob = null,
        email = null,
        password = null,
        phoneNumber = null,
        lastLogin = new Date(),
        isActivated = false,
        isEnable = true,
        createdAt = new Date(),
        createdBy = new ObjectId("000000000000000000000000"),
        modifiedAt = new Date(),
        modifiedBy = new ObjectId("000000000000000000000000"),
        _id = null,
    }) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.dob = dob;
        this.email = email;
        this.password = password;
        this.phoneNumber = phoneNumber;
        this.lastLogin = lastLogin;
        this.isActivated = isActivated;
        this.isEnable = isEnable;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.modifiedAt =  modifiedAt;
        this.modifiedBy = modifiedBy;
        this._id = _id;
    }

    getId() {
        return this?._id.toString() ?? null;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    getToken() {

    }

    verifyAuthentication(email, password) {
        const payload = {
            userId: this._id,
            createdAt: new Date().toISOString()
        }

        const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET)

        return token;
    }
}