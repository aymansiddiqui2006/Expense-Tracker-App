import { Router } from "express";

import {addIncome, getIncome ,deleteIncome , downloadIncomeExcel} from '../controller/Income.controler.js'
import { verifyJwt } from "../middleware/authMiddleware.js";

const router = Router();

router.route('/add').post(verifyJwt,addIncome);
router.route('/get').get(verifyJwt,getIncome);
router.route('/download-excel').get(verifyJwt,downloadIncomeExcel)
router.route('/:id').delete(verifyJwt,deleteIncome)


export default router;