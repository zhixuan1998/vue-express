const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

module.exports = class RefreshToken {
    constructor({
        userId,
        token,
        expiredAt,
        isDeleted = false,
        createdAt = new Date(),
        createdBy = new ObjectId("000000000000000000000000"),
        modifiedAt = new Date(),
        modifiedBy = new ObjectId("000000000000000000000000")
    }) {
        this.userId = userId;
        this.token = token;
        this.expiredAt = expiredAt;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.modifiedAt = modifiedAt;
        this.modifiedBy = modifiedBy;
    }

    getUserId() {
        return this.userId?.toString() ?? null;
    }

    getPayload(refreshTokenSecret) {
        try {
            const payload = jwt.verify(this.token, refreshTokenSecret);

            return [null, payload];

        } catch (err) {
            return [err];
        }
    }
};
