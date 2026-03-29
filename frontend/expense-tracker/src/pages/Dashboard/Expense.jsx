import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import { useUserAuth } from '../../hooks/useUserAuth.jsx'

import { API_PATHS } from '../../utils/apiPaths.js';
import axiosInstance from '../../utils/axiosinstance.js';

import DashbordLayout from '../../components/layouts/DashbordLayout.jsx';

import ExpenseOverview from '../../components/Expense/ExpenseOverview.jsx'
import AddExpenseForm from '../../components/Expense/AddExpenseForm.jsx'
import ExpenseList from '../../components/Expense/ExpenseList.jsx'


import DeleteAlert from '../../components/DeleteAlert.jsx';
import Modal from '../../components/Modal.jsx';

export default function Expense() {
  useUserAuth();

  const [ExpenseData, setExpenseData] = useState();
  const [loading, setloading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  console.log("openDeleteAlert:", openDeleteAlert)

  const [OpenAddExpenseModal, setOpenAddExpenseModal] = useState(false)


  const fetchExpenseData = async () => {
    if (loading) return;
    setloading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSE}`)
      if (response.data) {
        setExpenseData(response.data.data);
      }
    } catch (error) {
      console.log("something went wrong whille fetching expense data ! try again later", error)
    } finally {
      setloading(false)
    }
  };

  //handle add Expense
  const handleAddExpense = async (expense) => {
    const { icon, category, amount, date } = expense;

    if (!category.trim()) {
      toast.error("Source is required.");
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error("Amount should be a valid number graeter then 0.")
      return;
    }

    if (!date) {
      toast.error("Date is required")
      return;
    }

    try {
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE,
        {
          icon,
          category,
          amount,
          date
        }
      )
      setOpenAddExpenseModal(false);
      toast.success("Expense added successfully");
      fetchExpenseData();
    } catch (error) {
      console.error("Error Adding Expense:", error.response?.data?.message || error.message)
    }
  };

  //delete income
  const deleteExpense = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));
      toast.success("Expense datils deleted succussefull");
      fetchExpenseData();

    } catch (error) {
      console.error("Error deleting Expense : ", error.response?.data?.data?.message || error.message)
    } finally {
      setOpenDeleteAlert({
        show: false,
        data: null
      })
    }

  }

  const handleDownloadExpenseDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE, {
        responseType: "blob",

      });

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "expense_detail.xlsx")
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense : ", error)
      toast.error("Failed to download expense detail. Please try again later");
    }
  }

  useEffect(() => {
    fetchExpenseData()

    return () => { };
  }, [])



  return (
    <DashbordLayout activeMenu="Expense">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <ExpenseOverview
              transactions={ExpenseData}
              onExpenseIncome={() => setOpenAddExpenseModal(true)}
            />
          </div>

          <ExpenseList
            transactions={ExpenseData}
            onDelete={(id) => {
              setOpenDeleteAlert({ show: true, data: id })
            }}
            onDownload={handleDownloadExpenseDetails}
          />



        </div>
        <Modal
          isOpen={OpenAddExpenseModal}
          onClose={() => setOpenAddExpenseModal(false)}
          title="Add Expense"
        >
          <AddExpenseForm onAddExpense={handleAddExpense} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Expense"
        >
          <DeleteAlert content="Are you want to delete this income"
            onDelete={() => deleteExpense(openDeleteAlert.data)}
          />
        </Modal>

        
      </div>
    </DashbordLayout>

  )
}
