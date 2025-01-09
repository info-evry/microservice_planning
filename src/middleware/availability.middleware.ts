import { Request, Response } from "express";
import { serverInstance } from "../server";
import { ZodError } from "zod";
import { availibilitySchema } from "../schema/create/availibilitySchema";
import { stat } from "fs";
export class AvailabilityMiddleware {
    public static async createAvailability(req: Request, res: Response) {
        try {
            const { memberId, day, startTime, endTime } = availibilitySchema.parse(req.body);

            const user = await serverInstance.getPrismaClient().user.findUnique({
                where: { id: memberId.toString() },
            });

            if (!user) {
                return res.status(404).json({
                    message: `User with id ${memberId} not found`,
                });
            }

            const availability = await serverInstance.getPrismaClient().availability.create({
                data: {
                    memberId: memberId.toString(),
                    day: day as string,
                    startTime: startTime as string,
                    endTime: endTime as string,
                },
            });

            // Envoi de la réponse
            res.status(200).json({ message: "Dispo créer", details: availability });
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).send({
                    message: "Zod Error",
                    detail: error.issues.reduce((acc, curr) => acc + curr.message + "\n", ""),
                    more: error.issues.reduce((acc, curr) => acc + curr.path.join("->") + " ", ""),
                });
            }
            // Erreur générique
            res.status(500).send({
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }

    public static async deleteAvailability(req: Request, res: Response) {
        try {
            const { id } = req.params;
            //check if the availability exists id
            const availability = await serverInstance.getPrismaClient().availability.findUnique({
                where: { id },
            });
            if (!availability) {
                return res.status(404).json({
                    message: `Availability with id non-existent-id not found`,
                });
            }
            await serverInstance.getPrismaClient().availability.delete({
                where: { id },
            });
            res.status(200).json({ message: "Dispo supprimée", id });
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
