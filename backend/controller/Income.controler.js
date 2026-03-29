import ExcelJS from "exceljs"

import AssyncHandler from "../utils/AssyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiRes from "../utils/ApiResponce.js";

import { Income } from "../models/Income.model.js";

const addIncome = AssyncHandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(400, "User not Found");
  }

  const { icon, source, amount, date } = req.body;

  if (!source || !amount || !date) {
    throw new ApiError(400, "all fields are require");
  }

  const newIncome = new Income({
    userId,
    source,
    amount,
    date,
    icon,
  });

  await newIncome.save();
  return res.status(200).json(new ApiRes(200, newIncome, "income Added"));
});

const getIncome = AssyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized User");
  }
  const income = await Income.find({ userId }).sort({ date: -1 });

  return res
    .status(200)
    .json(new ApiRes(200, income, "income fetched Successfully"));
});

const downloadIncomeExcel = AssyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized User");
  }
  const income=await Income.find({userId}).sort({date:-1});
  
  // create workbook and worksheet
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Income")

    // define columns
    worksheet.columns = [
        { header: "Source", key: "source", width: 20 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Date", key: "date", width: 20 },
        { header: "Icon", key: "icon", width: 10 },
    ]

    // add rows
    income.forEach((item) => {
        worksheet.addRow({
            source: item.source,
            amount: item.amount,
            date: new Date(item.date).toLocaleDateString(),
            icon: item.icon || "",
        })
    })

    // style the header row
    worksheet.getRow(1).font = { bold: true }

    // set response headers
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", "attachment; filename=income.xlsx")

    // write to response
    await workbook.xlsx.write(res)
    res.end();
});

const deleteIncome = AssyncHandler(async (req, res) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError(400, "Unauthorized User");
  }

  const deleteIncome = await Income.findByIdAndDelete(req.params.id);

  if (!deleteIncome) {
    throw new ApiError(500, "income not deleted");
  }

  return res
    .status(200)
    .json(new ApiRes(200, deleteIncome, "use income deleted"));
});

export { addIncome, getIncome, deleteIncome, downloadIncomeExcel };
