import express from "express";
import AuthController from "../controllers/AuthController.js";

const router = express.Router();

router.post('/auth/registration', AuthController.registration);

export default router