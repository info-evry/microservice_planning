import request from "supertest";
import { serverInstance } from "../server";

describe("Health check", () => {
    it("should returns a 200", async () => {
        const response = await request(serverInstance.getApp()).get("/");
        expect(response.status).toBe(200);
    });
});
