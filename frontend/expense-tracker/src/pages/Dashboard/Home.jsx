import React, { useEffect, useState } from 'react'
import DashbordLayout from '../../components/layouts/DashbordLayout.jsx'
import { useUserAuth } from '../../hooks/useUserAuth.jsx'
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import { addThousandsSeparator } from '../../utils/helper.js'
import InfoCard from '../../components/Card/InfoCard.jsx';

import RecentTransaction from '../../components/dashBoard/RecentTransaction.jsx'
import FinanceOverview from '../../components/dashBoard/FinanceOverview.jsx'
import ExpenseTransactions from '../../components/dashBoard/ExpenseTransactions.jsx';
import Last30DaysExpenses from '../../components/dashBoard/Last30DaysExpenses.jsx';
import RecentIncomeWithChart from '../../components/dashBoard/RecentIncomeWithChart.jsx'
import RecentIncome from '../../components/dashBoard/RecentIncome.jsx';


import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { IoMdCard } from "react-icons/io"


function Home() {
  useUserAuth()
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const respnse = await axiosInstance.get(
        `${API_PATHS.DASHBOARD.GET_DATA}`
      );

      if (respnse.data) {
        setDashboardData(respnse.data);
      }
    } catch (error) {
      console.log("somthing went wrong", error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboardData();
    return () => { };
  }, [])




  return (
    <DashbordLayout activeMenu="Dashboard">
      <div className='my-5 mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <InfoCard
            icon={<IoMdCard />}
            lable="total Balance"
            value={addThousandsSeparator(dashboardData?.data.totalBalance)}
            color="bg-primary"
          />

          <InfoCard
            icon={<IoMdCard />}
            lable="total Income"
            value={addThousandsSeparator(dashboardData?.data.totalIncome)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<IoMdCard />}
            lable="total Expense"
            value={addThousandsSeparator(dashboardData?.data.totalExpenses)}
            color="bg-red-500"
          />

        </div>


        <div className='grid grid-col-1 md:grid-cols-2 gap-6 mt-6'>

          <RecentTransaction
            transaction={dashboardData?.data.recentTransactions}
            OnSeeMore={() => navigate("/expense")}
          />

          <FinanceOverview
            totalBalance={dashboardData?.data.totalBalance}
            totalIncome={dashboardData?.data.totalIncome}
            totalExpense={dashboardData?.data.totalExpenses}

          />

          <ExpenseTransactions
            transactions={dashboardData?.data.last30DaysExpenses.transactions}
            onSeeMore={() => navigate("/expense")}
          />

          <Last30DaysExpenses
            data={dashboardData?.data.last30DaysExpenses?.transactions}
          />

          <RecentIncomeWithChart data={dashboardData?.data.last60DaysIncome.transactions.slice(0, 4) || []}
            totalIncome={dashboardData?.data.totalIncome || 0}
          />

          <RecentIncome
            transactions={dashboardData?.data.last60DaysIncome.transactions || []}
            onSeeMore={() => navigate("/income")}
          />

        </div>
      </div>

    </DashbordLayout>
  )
}

export default Home