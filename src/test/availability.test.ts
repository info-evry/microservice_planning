import request from "supertest";
import { serverInstance } from "../server";
const VALID_MEMBER = "658371d5-e3cb-4fa6-b4c6-23bb318a8e74"; //SHOULD BE REPLACE BY A VALID MEMBER ID
const VALID_ID_TO_DELETE = "cm5psobcr0001b3dsafq47u22";
describe("Availability Middleware", () => {
    it("should return 201 for valid availability creation", async () => {
        const response = await request(serverInstance.getApp()).post("/availability").send({
            memberId: VALID_MEMBER,
            day: "Monday",
            startTime: "10:00",
            endTime: "12:00",
        });
        expect(response.status).toBe(200);
        expect(response.body.message).toContain("Dispo créer");
    });

    it("should return 404 if user does not exist", async () => {
        const response = await request(serverInstance.getApp()).post("/availability").send({
            memberId: "non-existent-user-id",
            day: "Monday",
            startTime: "10:00",
            endTime: "12:00",
        });
        expect(response.status).toBe(404);
        expect(response.body.message).toContain("User with id non-existent-user-id not found");
    });

    it("should return 400 for invalid input with Zod Error", async () => {
        const response = await request(serverInstance.getApp()).post("/availability").send({
            memberId: VALID_MEMBER,
            day: "InvalidDay",
            startTime: "10:00",
            endTime: "12:00",
        });
        expect(response.status).toBe(400);
        expect(response.body.message).toContain("Zod Error");
    });

    it("should return 200 when availability is successfully deleted", async () => {
        const response = await request(serverInstance.getApp()).delete(
            "/availability/" + VALID_ID_TO_DELETE,
        );
        expect(response.status).toBe(200);
        expect(response.body.message).toContain("Dispo supprimée");
    });

    it("should return 404 if availability to delete does not exist", async () => {
        const response = await request(serverInstance.getApp()).delete(
            "/availability/" + "this is not a valid id",
        );
        expect(response.status).toBe(404);
        expect(response.body.message).toContain("Availability with id non-existent-id not found");
    });

    it("should return 200 and opening hours grouped by day", async () => {
        const response = await request(serverInstance.getApp()).get("/opening-hours");
        expect(response.status).toBe(200);
        // Vérifie que la réponse contient les horaires groupés
        console.log(response.body);
        expect(response.body).toHaveProperty("Monday");
    });

    it("should return 200 with a closed message if no availabilities exist", async () => {
        const response = await request(serverInstance.getApp()).get("/opening-hours");
        expect(response.status).toBe(200);
        expect(response.body.message).toContain("Le bureau de l'association est fermé.");
    });
});
