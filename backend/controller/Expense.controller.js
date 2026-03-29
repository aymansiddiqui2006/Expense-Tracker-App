import ExcelJS from "exceljs"
import AssyncHandler from "../utils/AssyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiRes from "../utils/ApiResponce.js"
import { Expense } from "../models/Expense.model.js"

const addExpense = AssyncHandler(async (req, res) => {
    const userId = req.user?._id
    if (!userId) throw new ApiError(401, "User not found")

    const { icon, category, amount, date } = req.body  // ✅ category not source

    if (!category || !amount || !date) {
        throw new ApiError(400, "All fields are required")
    }

    const newExpense = new Expense({ userId, icon, category, amount, date }) // ✅ Expense not Income

    await newExpense.save()
    return res.status(201).json(new ApiRes(201, newExpense, "Expense added"))
})

const getExpense = AssyncHandler(async (req, res) => {
    const userId = req.user?._id
    if (!userId) throw new ApiError(401, "Unauthorized user")

    const expenses = await Expense.find({ userId }).sort({ date: -1 }) // ✅ Expense not Income

    return res.status(200).json(new ApiRes(200, expenses, "Expenses fetched successfully"))
})

const downloadExpenseExcel = AssyncHandler(async (req, res) => {
    const userId = req.user?._id
    if (!userId) throw new ApiError(401, "Unauthorized user")

    const expenses = await Expense.find({ userId }).sort({ date: -1 }) // ✅ Expense not Income

    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet("Expenses") // ✅ Expenses not Income

    worksheet.columns = [
        { header: "Category", key: "category", width: 20 }, // ✅ category not source
        { header: "Amount", key: "amount", width: 15 },
        { header: "Date", key: "date", width: 20 },
        { header: "Icon", key: "icon", width: 10 },
    ]

    expenses.forEach((item) => {
        worksheet.addRow({
            category: item.category, // ✅ category not source
            amount: item.amount,
            date: new Date(item.date).toLocaleDateString(),
            icon: item.icon || "",
        })
    })

    worksheet.getRow(1).font = { bold: true }

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader("Content-Disposition", "attachment; filename=expenses.xlsx")

    await workbook.xlsx.write(res)
    res.end()
})

const deleteExpense = AssyncHandler(async (req, res) => {
    const userId = req.user?._id
    if (!userId) throw new ApiError(401, "Unauthorized user")

    const deletedExpense = await Expense.findByIdAndDelete(req.params.id) // ✅ Expense not Income

    if (!deletedExpense) throw new ApiError(404, "Expense not found")

    return res.status(200).json(new ApiRes(200, deletedExpense, "Expense deleted"))
})

export { addExpense, getExpense, deleteExpense, downloadExpenseExcel }