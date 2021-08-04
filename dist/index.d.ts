import { cognitoMiddleware } from "./cognitoMiddleware";
export { cognitoMiddleware };
export interface Config {
    region: string | undefined;
    userPoolId: string | undefined;
}
