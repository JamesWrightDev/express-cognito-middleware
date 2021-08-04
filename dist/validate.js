"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const axios_1 = require("axios");
const jwkToPem = require("jwk-to-pem");
exports.validate = ({ region, userPoolId }, token) => __awaiter(void 0, void 0, void 0, function* () {
    const { keys } = yield fetchJWK({
        region: region,
        userPoolId: userPoolId,
    });
    if (!region) {
        throw "AWS Region not specificed";
    }
    if (!userPoolId) {
        throw "UserPoolID not specificed";
    }
    const JWT = decodeJWT(token);
    if (!JWT) {
        throw "Invalid JWT supplied";
    }
    const matchingJWK = keys.find((key) => key.kid === JWT.header.kid);
    if (!matchingJWK) {
        throw "Unable to generate Certificate";
    }
    const pem = jwkToPem(matchingJWK);
    const JWTConfig = {
        // maxAge: "99999999",
        algorithms: ["RS256"],
        audience: "36p2bi3bjad1q6ud85vjg0nqlo",
        issuer: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_0jWTqtygp",
    };
    return jwt.verify(token, pem, {
        algorithms: ["RS256"],
        audience: "36p2bi3bjad1q6ud85vjg0nqlo",
        issuer: constructIssuerUrl(region, userPoolId),
    }, (err, decodedToken) => {
        if (err) {
            throw err;
        }
        if (decodedToken) {
            return decodedToken;
        }
    });
});
const fetchJWK = ({ region, userPoolId }) => __awaiter(void 0, void 0, void 0, function* () {
    const url = constructIssuerUrl(region, userPoolId);
    const res = yield axios_1.default.get(url);
    return res.data;
});
const constructIssuerUrl = (region, userPoolId) => {
    return `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
};
const decodeJWT = (token) => {
    return jwt.decode(token, { complete: true });
};
