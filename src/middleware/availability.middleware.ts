import { Request, Response } from "express";
import { serverInstance } from "../server";

export class AvailabilityMiddleware {
    public static healthcheck(req: Request, res: Response) {
        res.status(200).send("OK");
    }

    public static async createAvailability(req: Request, res: Response) {
        try {
            const { memberId, day, startTime, endTime } = req.body;
            const availability = await serverInstance.getPrismaClient().availability.create({
                data: { memberId, day, startTime, endTime },
            });
            res.status(201).json(availability);
        } catch (error) {
            res.status(500).send("Error creating availability: ${error}");
        }
    }

    public static async deleteAvailability(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await serverInstance.getPrismaClient().availability.delete({
                where: { id: Number(id) },
            });
            res.status(204).send();
        } catch (error) {
            res.status(500).send("Error deleting availability: ${error}");
        }
    }

    public static async getOpeningHours(req: Request, res: Response) {
        try {
            const availabilities = await serverInstance.getPrismaClient().availability.findMany({
                orderBy: [{ day: "asc" }, { startTime: "asc" }],
            });

            if (availabilities.length === 0) {
                return res.status(200).json({ message: "Le bureau de l'association est fermé." });
            }

            const grouped = availabilities.reduce((acc: any, curr) => {
                if (!acc[curr.day]) acc[curr.day] = [];
                acc[curr.day].push({ start: curr.startTime, end: curr.endTime });
                return acc;
            }, {});

            res.status(200).json(grouped);
        } catch (error) {
            res.status(500).send("Error fetching opening hours: ${error}");
        }
    }
}