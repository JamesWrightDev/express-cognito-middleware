import { cognitoMiddleware } from "./cognitoMiddleware";
export { cognitoMiddleware };

export interface Config {
  region: string | undefined;
  userPoolId: string | undefined;
}

const config = {
  region: "eu-west-2",
  userPoolId: "eu-west-2_0jWTqtygp",
};
