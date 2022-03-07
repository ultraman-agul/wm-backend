import express from "express";
import Location from "../controller/v1/location.js";

const router = express.Router();
router.get("/location", Location.location);

export default router;
