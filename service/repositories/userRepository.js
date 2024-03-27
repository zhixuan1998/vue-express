const { ObjectId } = require('mongodb');
const { User } = require("../aggregate");

module.exports = ({
    collections: {
        users
    }
}) => {
    return {
        async get(userId) {
            try {
                const result = await users.findOne({
                    _id: new ObjectId(userId),
                    // isDeleted: false
                });

                return [null, result ? new User(result) : null];

            } catch (error) {
                return [error];
            }           
        },
        
    }
}
