import * as jwt from "jsonwebtoken";
import axios from "axios";
import * as jwkToPem from "jwk-to-pem";

const token = "";

const region = "eu-west-2";
const userPoolId = "eu-west-2_0jWTqtygp";

interface AWSConfig {
  region: string;
  userPoolId: string;
}

const fetchJWK = async ({ region, userPoolId }: AWSConfig) => {
  if (!region) {
    throw "AWS Region not specificed";
  }

  if (!userPoolId) {
    throw "UserPoolID not specificed";
  }

  const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const res = await axios.get(url);
  return res.data;
};

const decodeJWT = (token: string) => {
  return jwt.decode(token, { complete: true });
};

export const validate = async () => {
  const { keys } = await fetchJWK({
    region: region,
    userPoolId: userPoolId,
  });

  const JWT = decodeJWT(token);
  const matchingJWK = keys.find((key) => key.kid === JWT.header.kid);
  const pem = jwkToPem(matchingJWK);

  jwt.verify(
    token,
    pem,
    {
      // maxAge: "99999999",
      algorithms: ["RS256"],
      audience: "36p2bi3bjad1q6ud85vjg0nqlo",
      issuer: "https://cognito-idp.eu-west-2.amazonaws.com/eu-west-2_0jWTqtygp",
    },
    (err, decodedToken) => {
      if (decodedToken) {
        return decodedToken;
      }
    }
  );
};
