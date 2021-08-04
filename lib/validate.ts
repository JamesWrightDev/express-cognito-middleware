import * as jwt from "jsonwebtoken";
import axios from "axios";
import * as jwkToPem from "jwk-to-pem";
import { Config } from ".";

export const validate = async (
  { region, userPoolId }: Config,
  token: string
) => {
  const { keys } = await fetchJWK({
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

  const matchingJWK: jwt.Jwt = keys.find((key) => key.kid === JWT.header.kid);

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

  return jwt.verify(
    token,
    pem,
    {
      algorithms: ["RS256"],
      audience: "36p2bi3bjad1q6ud85vjg0nqlo",
      issuer: constructIssuerUrl(region, userPoolId),
    },
    (err, decodedToken) => {
      if (err) {
        throw err;
      }
      if (decodedToken) {
        return decodedToken;
      }
    }
  );
};

const fetchJWK = async ({ region, userPoolId }: Config) => {
  const url = constructIssuerUrl(region, userPoolId);
  const res = await axios.get(url);
  return res.data;
};

const constructIssuerUrl = (region: string, userPoolId: string) => {
  return `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
};

const decodeJWT = (token: string) => {
  return jwt.decode(token, { complete: true });
};
