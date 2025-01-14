import { Application } from "express";
import { AvailabilityMiddleware } from "../middleware/availability.middleware";

export default function (app: Application) {
    app.post("/availability", AvailabilityMiddleware.createAvailability);
    // app.get("/", AvailabilityMiddleware.getAvailabilities);
    app.delete("/availability/:id", AvailabilityMiddleware.deleteAvailability);
    app.get("/opening-hours", AvailabilityMiddleware.getOpeningHours);
}
