import { Config } from ".";
import { validate } from "./validate";

const cognitoMiddleware = (config: Config | undefined) => {
  if (!config) {
    throw new Error("Configuration Missing");
  }

  return (req, res, next) => {
    const token = req.headers.token;
    if (!token) {
      return res.status(400).send();
    }

    validate(config, token)
      .then((user) => {
        req.user = user;
        next();
      })
      .catch((e) => {
        return res.status(400).send();
      });
  };
};

export { cognitoMiddleware };
