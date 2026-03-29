import React from 'react'
import { LuArrowBigRight } from 'react-icons/lu'
import moment from 'moment'

import { TransactionInfoCard } from "../Card/TransactionInfoCard";


export default function RecentTransaction({ transaction, OnSeeMore }) {
    return (
        <div className='card'>
            <div className='flex items-center justify-between'>
                <h5 className='text-lg'>Recent Transactions</h5>
                <button className='card-btn' onClick={OnSeeMore}>See All
                    <LuArrowBigRight className='text-base' />
                </button>
            </div>

            <div className='mt-6'>
                {Array.isArray(transaction) &&
                    transaction.slice(0, 5).map((item) => (
                        <TransactionInfoCard
                            key={item._id}
                            title={item.type === "expense" ? item.category : item.source}
                            icon={item.icon}
                            date={moment(item.date).format("Do MMM YYYY")}
                            amount={item.amount}
                            type={item.type}
                            hideDeleteBtn
                        />
                    ))}
            </div>
        </div>
    )
}
