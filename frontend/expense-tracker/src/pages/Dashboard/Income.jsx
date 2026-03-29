import React, { useState } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth.jsx';

import axiosInstance from '../../utils/axiosinstance.js'
import { API_PATHS } from '../../utils/apiPaths.js';
import DashbordLayout from '../../components/layouts/DashbordLayout.jsx'

import IcomeOverview from '../../components/Income/IcomeOverview.jsx'
import AddIncomceForm from '../../components/Income/AddIncomceForm.jsx'
import IncomeList from '../../components/Income/IncomeList.jsx'


import { useEffect } from 'react';
import Modal from '../../components/Modal.jsx';
import DeleteAlert from '../../components/DeleteAlert.jsx'
import toast from 'react-hot-toast';




export default function Income() {
  useUserAuth()
  const [incomeData, setIncomeData] = useState();
  const [loading, setloading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null
  })
  console.log("openDeleteAlert:", openDeleteAlert)

  const [OpenAddIncomeModal, setOpenAddIncomeModal] = useState(false)

  //get all income details
  const fetchIncomeData = async () => {
    if (loading) return;
    setloading(true);

    try {
      const response = await axiosInstance.get(`${API_PATHS.INCOME.GET_ALL_INCOME}`)
      if (response.data) {
        setIncomeData(response.data.data);
      }
    } catch (error) {
      console.log("something went wrong whille fetching income data ! try again later", error)
    } finally {
      setloading(false)
    }
  };

  //handle add income
  const handleAddIncome = async (income) => {
    const { icon, source, amount, date } = income;

    if (!source.trim()) {
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
      const response = await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME,
        {
          icon,
          source,
          amount,
          date
        }
      )
      setOpenAddIncomeModal(false);
      toast.success("Income added successfully");
      fetchIncomeData();
    } catch (error) {
      console.error("Error Adding income:", error.response?.data?.message || error.message)
    }
  };

  //delete income
  const deleteIncome = async (id) => {
    try {
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      toast.success("Income datils deleted succussefull");
      fetchIncomeData();

    } catch (error) {
      console.error("Error deleting income : ", error.response?.data?.data?.message || error.message)
    } finally {
      setOpenDeleteAlert({
        show: false,
        data: null
      })
    }

  }

  //handle download income
  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME, {
        responseType: "blob",

      });

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "income_detail.xlsx")
      document.body.appendChild(link) 
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Income details downloaded successfully")
    } catch (error) {
      console.error("Error downloading income : ", error)
      toast.error("Failed to download income detail. Please try again later");
    }
  }


  useEffect(() => {
    fetchIncomeData()

    return () => { };
  }, [])


  return (
    <DashbordLayout activeMenu="Income">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 gap-6'>
          <div className=''>
            <IcomeOverview
              transactions={incomeData}
              onAddIncome={() => setOpenAddIncomeModal(true)}
            />
          </div>

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => {
              console.log("delete clicked:", id)
              setOpenDeleteAlert({ show: true, data: id })
            }}
            onDownload={handleDownloadIncomeDetails}
          />



        </div>
        <Modal
          isOpen={OpenAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomceForm onAddIncome={handleAddIncome} />
        </Modal>

        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert content="Are you want to delete this income"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashbordLayout>
  )
}
