"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validate_1 = require("./validate");
const cognitoMiddleware = (config) => {
    if (!config) {
        throw new Error("Configuration Missing");
    }
    return (req, res, next) => {
        const token = req.headers.token;
        if (!token) {
            return res.status(400).send();
        }
        validate_1.validate(config, token)
            .then((user) => {
            req.user = user;
            next();
        })
            .catch((e) => {
            return res.status(400).send();
        });
    };
};
exports.cognitoMiddleware = cognitoMiddleware;
