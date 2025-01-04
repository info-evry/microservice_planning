import { Application } from "express";
import { AvailabilityMiddleware } from "../middleware/availability.middleware";

export default function (app: Application) {
    app.get("/", AvailabilityMiddleware.healthcheck);
    app.post("/availabilities/create", AvailabilityMiddleware.createAvailability);
    app.delete("/availabilities/:id/delete", AvailabilityMiddleware.deleteAvailability);
    app.get("/opening-hours", AvailabilityMiddleware.getOpeningHours);
}
