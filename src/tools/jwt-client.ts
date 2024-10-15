import { config } from "../config/config";
import * as jwt from "jsonwebtoken";
import { JWTUser } from "../model/user.model";

export interface Token {
    id: number;
    exp: number;
    iat: number;
    iss: string;
    aud: string;
    user: Omit<JWTUser, "hydrate">;
}

export class JWTClient {
    private issuer: string = config.get("jwt.issuer");
    private expire: string = config.get("jwt.expires_in");
    private algorithm: jwt.Algorithm = "HS256";
    private audience: string = config.get("jwt.audience");
    private secret = config.get("jwt.secret");

    public constructor() {}

    private async generateToken(user: JWTUser): Promise<string> {
        const payload = {
            user,
        };

        const options: jwt.SignOptions = {
            issuer: this.issuer,
            audience: this.audience,
            algorithm: this.algorithm,
        };

        options.expiresIn = this.expire;

        const token = jwt.sign(payload, this.secret, options);
        return token;
    }

    /**
     * Generate an access token
     * @param user The user to generate the token for
     */
    async generateAccessToken(user: JWTUser): Promise<string> {
        return await this.generateToken(user);
    }

    /**
     * Verify an access token
     * @param token The token to verify
     * @returns The decoded token
     * @throws Error if the token is invalid or expired
     */
    verifyAccessToken(token: string): Token {
        const options: jwt.VerifyOptions = {
            issuer: config.get("jwt.issuer"),
            audience: config.get("jwt.audience"),
            algorithms: [this.algorithm],
        };

        return jwt.verify(token, this.secret, options) as Token;
    }
}
