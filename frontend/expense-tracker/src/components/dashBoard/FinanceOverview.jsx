import React from 'react'
import CustumPieChart from '../chart/CustumPieChart.jsx'

const COLORS=["#875CF5" ,"#FA2C37", "#FF6900"]

const FinanceOverview=({totalBalance,totalIncome,totalExpense})=> {
    const balanceData=[
        {name:"Total Balance", amount:totalBalance},
        {name:"Total expense", amount:totalExpense},
        {name:"Total Income", amount:totalIncome}
    ]
  return (
    <div>
        <div></div>
        <h5></h5>
    

    <CustumPieChart
    data={balanceData}
    label="Total Balance"
    totalAmount={`$${totalBalance}`}
    colors={COLORS}
    showTextAnchor
    />
    </div>
  )
}


export default FinanceOverview