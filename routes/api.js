import express from "express";
import AuthController from "../controllers/AuthController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import ProductController from "../controllers/ProductController.js";

const router = express.Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/registration', AuthController.registration);
router.post('/auth/refreshtoken', AuthController.refreshToken);

router.post('/product/addproduct', jwtAuth(), ProductController.addProduct);
router.put('/product/:productid/editproduct', jwtAuth(), ProductController.editProduct);
export default router