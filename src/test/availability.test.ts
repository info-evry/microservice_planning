import request from "supertest";
import { serverInstance } from "../server";

describe("Availability API", () => {
    describe("Health check", () => {
        it("should return a 200", async () => {
            const response = await request(serverInstance.getApp()).get("/");
            expect(response.status).toBe(200);
        });
    });

    describe("Opening Hours", () => {
        it("should correctly display the specified opening hours", async () => {
            jest.spyOn(serverInstance.getPrismaClient().availability, "findMany").mockResolvedValue([
                { id: 1, memberId: "user1", day: "Monday", startTime: "10:00", endTime: "10:15", createdAt: new Date(), updatedAt: new Date() },
                { id: 2, memberId: "user1", day: "Monday", startTime: "11:45", endTime: "13:00", createdAt: new Date(), updatedAt: new Date() },
                { id: 3, memberId: "user1", day: "Monday", startTime: "14:30", endTime: "14:45", createdAt: new Date(), updatedAt: new Date() },
            ]);

            const response = await request(serverInstance.getApp()).get("/opening-hours");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                Monday: [
                    { start: "10:00", end: "10:15" },
                    { start: "11:45", end: "13:00" },
                    { start: "14:30", end: "14:45" },
                ],
            });
        });

        it("should return a message when no availabilities are found", async () => {
            jest.spyOn(serverInstance.getPrismaClient().availability, "findMany").mockResolvedValue([]);

            const response = await request(serverInstance.getApp()).get("/opening-hours");

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "The shop is closed." });
        });
    });

    describe("Create Availability", () => {
        it("should allow creating an availability", async () => {
            jest.spyOn(serverInstance.getPrismaClient().availability, "create").mockResolvedValue({
                id: 1,
                memberId: "user1",
                day: "Monday",
                startTime: "10:00",
                endTime: "10:15",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await request(serverInstance.getApp())
                .post("/availabilities/create")
                .send({
                    memberId: "user1",
                    day: "Monday",
                    startTime: "10:00",
                    endTime: "10:15",
                });

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                id: 1,
                memberId: "user1",
                day: "Monday",
                startTime: "10:00",
                endTime: "10:15",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            });
        });

        it("should return an error for conflicting availabilities", async () => {
            jest.spyOn(serverInstance.getPrismaClient().availability, "create").mockRejectedValue(
                new Error("Conflicting availability")
            );

            const response = await request(serverInstance.getApp())
                .post("/availabilities/create")
                .send({
                    memberId: "user1",
                    day: "Monday",
                    startTime: "10:00",
                    endTime: "10:15",
                });

            expect(response.status).toBe(500);
            expect(response.text).toContain("Error creating availability");
        });
    });

    describe("Delete Availability", () => {
        it("should delete an availability", async () => {
            jest.spyOn(serverInstance.getPrismaClient().availability, "delete").mockResolvedValue({
                id: 1,
                memberId: "user1",
                day: "Monday",
                startTime: "10:00",
                endTime: "10:15",
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const response = await request(serverInstance.getApp()).delete("/availabilities/1/delete");

            expect(response.status).toBe(204);
        });

        it("should return an error when trying to delete a non-existing availability", async () => {
            jest.spyOn(serverInstance.getPrismaClient().availability, "delete").mockRejectedValue(
                new Error("Availability not found")
            );

            const response = await request(serverInstance.getApp()).delete("/availabilities/999/delete");

            expect(response.status).toBe(500);
            expect(response.text).toContain("Error deleting availability");
        });
    });

    describe("Real-time Opening Hours Update", () => {
        it("should update opening hours after creating a new availability", async () => {
            jest.spyOn(serverInstance.getPrismaClient().availability, "findMany")
                .mockResolvedValueOnce([
                    { id: 1, memberId: "user1", day: "Monday", startTime: "10:00", endTime: "10:15", createdAt: new Date(), updatedAt: new Date() },
                    { id: 2, memberId: "user1", day: "Monday", startTime: "11:45", endTime: "13:00", createdAt: new Date(), updatedAt: new Date() },
                ]) // avant creation
                .mockResolvedValueOnce([
                    { id: 1, memberId: "user1", day: "Monday", startTime: "10:00", endTime: "10:15", createdAt: new Date(), updatedAt: new Date() },
                    { id: 2, memberId: "user1", day: "Monday", startTime: "11:45", endTime: "13:00", createdAt: new Date(), updatedAt: new Date() },
                    { id: 3, memberId: "user1", day: "Monday", startTime: "14:30", endTime: "14:45", createdAt: new Date(), updatedAt: new Date() },
                ]); // Apres creation

            const initialResponse = await request(serverInstance.getApp()).get("/opening-hours");
            expect(initialResponse.body).toEqual({
                Monday: [
                    { start: "10:00", end: "10:15" },
                    { start: "11:45", end: "13:00" },
                ],
            });

            await request(serverInstance.getApp()).post("/availabilities/create").send({
                memberId: "user1",
                day: "Monday",
                startTime: "14:30",
                endTime: "14:45",
            });

            const updatedResponse = await request(serverInstance.getApp()).get("/opening-hours");
            expect(updatedResponse.body).toEqual({
                Monday: [
                    { start: "10:00", end: "10:15" },
                    { start: "11:45", end: "13:00" },
                    { start: "14:30", end: "14:45" },
                ],
            });
        });
    });
});
