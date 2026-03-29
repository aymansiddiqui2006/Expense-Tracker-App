import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import { TransactionInfoCard } from '../Card/TransactionInfoCard'
import moment from 'moment'

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className='card'>
      <div className='flex items-center justify-between'>
        <h5 className='text-lg'>Expense</h5>
        <button className='card-btn' onClick={onSeeMore}>
          See All <LuArrowRight className='text-base' />
        </button>
      </div>

      <div className='mt-6'>
        {transactions?.slice(0, 5)?.map((expenses) => (
          <TransactionInfoCard
            key={expenses._id}
            icon={expenses.icon}
            title={expenses.category}
            date={moment(expenses.data).format("Do MMM YYYY")}
            amount={expenses.amount}
            type="expenses"
            hideDeleteBtn 
            />
        ))}
      </div>
    </div>
  )
}

export default ExpenseTransactions