import React from 'react'
import { LuPlus } from 'react-icons/lu'

import { useState } from 'react'
import { useEffect } from 'react';

import { prepareExpensearChartData } from '../../utils/helper.js';
import CustomLineChart from '../../components/chart/CustomLineChart.jsx'

function IcomeOverview({ transactions, onExpenseIncome }) {

    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) return;
        const result = prepareExpensearChartData(transactions);
        setChartData(result);

        return () => { };
    }, [transactions])

    useEffect(() => {
        console.log("expense transactions:", transactions)
        console.log("expense chartData:", chartData)
    }, [transactions, chartData])

    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <div className=''>
                    <h5 className='text-lg'>Expense Overview</h5>
                    <p className='text-xs text-gray-400 mt-0.5'>
                        Track your spending time and analyze your expense trends
                    </p>
                </div>
                <button className='add-btn' onClick={onExpenseIncome}>
                    <LuPlus className='text-lg' />
                    Add Expense
                </button>
            </div>

            <div className='mt-10'>
                <CustomLineChart data={chartData || []} />
            </div>
        </div>
    )
}

export default IcomeOverview