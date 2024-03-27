module.exports = class Account {
    constructor({
        userId,
        accType,
        email,
        password = null,
        isDeleted = false,
        createdAt = new Date(),
        createdBy = new ObjectId("000000000000000000000000"),
        modifiedAt = new Date(),
        modifiedBy = new ObjectId("000000000000000000000000"),
        _id = null,
    }) {
        this.userId = userId;
        this.accType = accType;
        this.email = email;
        this.password = password;
        this.isDeleted = isDeleted;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.modifiedAt = modifiedAt;
        this.modifiedBy = modifiedBy;
        this._id = _id;
    }
}