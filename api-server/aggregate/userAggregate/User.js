const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

module.exports = class User {
    constructor({
        firstName,
        lastName,
        gender = null,
        dob,
        email,
        phoneCode,
        phoneNumber,
        lastLogin = null,
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
        this.phoneCode = phoneCode;
        this.phoneNumber = phoneNumber;
        this.lastLogin = lastLogin;
        this.isActivated = isActivated;
        this.isEnable = isEnable;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.modifiedAt = modifiedAt;
        this.modifiedBy = modifiedBy;
        this._id = _id;
    }

    getId() {
        return this?._id.toString() ?? null;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    getToken(accessTokenSecret, refreshTokenSecret) {
        const accessTokenExpiredAt = new Date();
        const refreshTokenExpiredAt = new Date()

        accessTokenExpiredAt.setDate(accessTokenExpiredAt.getDate() + 1);
        refreshTokenExpiredAt.setFullYear(accessTokenExpiredAt.getFullYear() + 1);

        const accessTokenPayload = {
            id: this.getId(),
            firstName: this.firstName,
            lastName: this.lastName,
            dob: new Date(this.dob).toISOString(),
            email: this.email,
            expiredAt: accessTokenExpiredAt
        };

        const refreshTokenPayload = {
            id: this.getId()
        }

        const accessToken = jwt.sign(accessTokenPayload, accessTokenSecret, { expiresIn: '1d' });
        const refreshToken = jwt.sign(refreshTokenPayload, refreshTokenSecret, { expiresIn: '1y' });

        return {
            accessToken,
            accessTokenExpiredAt,
            refreshToken,
            refreshTokenExpiredAt
        };
    }

    verifyAuthentication(email, password) {
        
    }
};
