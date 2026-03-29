import { Router } from "express";
import { verifyJwt } from "../middleware/authMiddleware.js";
import {getDashboardData} from "../controller/DashBoard.controller.js"

const router=Router();

router.route('/').get(verifyJwt,getDashboardData)

export default router;