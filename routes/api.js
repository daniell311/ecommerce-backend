import express from "express";
import AuthController from "../controllers/AuthController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import ProductController from "../controllers/ProductController.js";
import paginationConfig from "../middlewares/PaginationConfig.js";

const router = express.Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/registration', AuthController.registration);
router.post('/auth/refreshtoken', AuthController.refreshToken);

router.get('/product', jwtAuth(), paginationConfig(), ProductController.getAllProduct);
router.get('/product/:productid', jwtAuth(), ProductController.getProductById);
router.post('/product/addproduct', jwtAuth(), ProductController.addProduct);
router.put('/product/:productid/editproduct', jwtAuth(), ProductController.editProduct);
router.delete('/product/:productid', jwtAuth(), ProductController.deleteProduct);

export default router