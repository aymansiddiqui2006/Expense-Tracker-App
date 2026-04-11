import AssyncHandler from "../utils/AssyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiRes from "../utils/ApiResponce.js"
import { Types } from "mongoose"
import { Income } from "../models/Income.model.js"
import { Expense } from "../models/expense.model.js"


const getDashboardData = AssyncHandler(async (req, res) => {
    const userId = req.user?._id  // ✅ no await, use _id not id

    if (!userId) {
        throw new ApiError(401, "User unauthorized")
    }

    const UserObjectId = new Types.ObjectId(userId)

    // total income and expense
    const totalIncome = await Income.aggregate([
        { $match: { userId: UserObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    const totalExpense = await Expense.aggregate([
        { $match: { userId: UserObjectId } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
    ])

    // last 60 days income
    const last60DaysIncomeTransactions = await Income.find({
        userId,
        date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 })

    const incomeLast60Days = last60DaysIncomeTransactions.reduce(
        (sum, txn) => sum + txn.amount, 0
    )

    // last 30 days expense ✅ was using wrong variable name
    const last30DaysExpenseTransactions = await Expense.find({
        userId,
        date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 })

    const expensesLast30Days = last30DaysExpenseTransactions.reduce(
        (sum, txn) => sum + txn.amount, 0
    )

    // recent transactions — last 5 income + last 5 expense ✅ was only fetching income
    const lastTransactions = [
        ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
            (txn) => ({ ...txn.toObject(), type: "income" }) // ✅ was "expense" for income
        ),
        ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
            (txn) => ({ ...txn.toObject(), type: "expense" })
        ),
    ].sort((a, b) => b.date - a.date)

    return res.status(200).json(new ApiRes(200, {
        totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
        totalIncome: totalIncome[0]?.total || 0,
        totalExpenses: totalExpense[0]?.total || 0,
        last30DaysExpenses: {
            total: expensesLast30Days,
            transactions: last30DaysExpenseTransactions,
        },
        last60DaysIncome: {
            total: incomeLast60Days,
            transactions: last60DaysIncomeTransactions,
        },
        recentTransactions: lastTransactions,
    }, "Dashboard data fetched successfully"))
})

export {
    getDashboardData
}