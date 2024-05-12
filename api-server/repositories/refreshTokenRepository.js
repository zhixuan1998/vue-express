import { ObjectId } from "mongodb";
import { RefreshToken } from "../aggregate/index.js";

export default function ({ collections: { refreshTokens } }) {
    return {
        async createRefreshToken(refreshToken) {
            const refreshTokenData = {
                userId: new ObjectId(refreshToken.userId),
                expiredAt: new Date(refreshToken.expiredAt),
                token: refreshToken.token,
                isDeleted: refreshToken.isDeleted,
                createdAt: refreshToken.createdAt,
                createdBy: refreshToken.createdBy,
                modifiedAt: refreshToken.modifiedAt,
                modifiedBy: refreshToken.modifiedBy
            };

            try {
                const result = await refreshTokens.insertOne(refreshTokenData);

                return [null, true];
            } catch (error) {
                return [error];
            }
        },

        async getRefreshToken(refreshToken) {
            try {
                const result = await refreshTokens.findOne({
                    token: refreshToken,
                    isDeleted: false
                });

                return [null, result ? new RefreshToken(result) : null];
            } catch (error) {
                return [error];
            }
        },

        async deleteRefreshToken({ userId, token }) {
            try {
                let query = {
                    token,
                    isDeleted: false
                };

                if (userId) {
                    query.userId = new ObjectId(userId);
                }

                const result = await refreshTokens.findOneAndUpdate(query, {
                    $set: {
                        isDeleted: true,
                        modifiedAt: new Date(),
                        modifiedBy: new ObjectId("000000000000000000000000")
                    }
                });

                return [null, result ? new RefreshToken(result) : null];
            } catch (error) {
                return [error];
            }
        }
    };
}
