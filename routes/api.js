import express from "express";
import AuthController from "../controllers/AuthController.js";
import jwtAuth from "../middlewares/jwtAuth.js";
import ProductController from "../controllers/ProductController.js";
import StoreController from "../controllers/StoreController.js";
import paginationConfig from "../middlewares/PaginationConfig.js";

const router = express.Router();

// Auth
router.post('/auth/login', AuthController.login);
router.post('/auth/registration', AuthController.registration);
router.post('/auth/refreshtoken', AuthController.refreshToken);

// Product
router.get('/product', jwtAuth(), paginationConfig(), ProductController.getAllProduct);
router.get('/product/:productid', jwtAuth(), ProductController.getProductById);
router.post('/product/addproduct', jwtAuth(), ProductController.addProduct);
router.put('/product/:productid/editproduct', jwtAuth(), ProductController.editProduct);
router.delete('/product/:productid', jwtAuth(), ProductController.deleteProduct);

// Store 
router.post('/store/createStore', jwtAuth(), StoreController.createStore);

export default router