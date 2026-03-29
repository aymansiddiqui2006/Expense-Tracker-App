import { Router } from "express";

import {addExpense, getExpense ,deleteExpense , downloadExpenseExcel} from '../controller/Expense.controller.js'
import { verifyJwt } from "../middleware/authMiddleware.js";

const router = Router();

router.route('/add').post(verifyJwt,addExpense);
router.route('/get').get(verifyJwt,getExpense);
router.route('/download-excel').get(verifyJwt,downloadExpenseExcel)
router.route('/:id').delete(verifyJwt,deleteExpense)


export default router;