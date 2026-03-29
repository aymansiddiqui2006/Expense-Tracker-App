import React from 'react'
import Card_2 from '../../assets/image/Card_2.png';
import { LuTrendingUp } from 'react-icons/lu'

function AuthLayout({ children }) {


    const StatsInfoCard = ({ icon, label, value, color }) => {
        return <div className='flex gap-6 bg-white p-4 rounded-xl shadow-md shadow-purple-400/10 border border-gray-200/50 z-10'>
            <div className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl `} >{icon}</div>
            <div>
                <h6 className='text-xs text-gray-500 mb-1'>{label}</h6>
                <span className='text-[20px]'>${value}</span>
            </div>
        </div>
    }



    return (
        <div className='flex'>

            <div className='w-screen h-screen md:w-[60vw] px-12 pb-12'>
                <h1 className='text-lg font-medium text-bold'>Expense Tracker</h1>
                {children}
            </div>

            <div className='hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover overflow-hidden p-8 relative'>

                <div className='w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5 z-0'></div>

                <div className='w-48 h-56 rounded-[40px] border-2 border-fuchsia-600 absolute -top-[10%] -right-10 z-0'></div>

                <div className='w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5 z-0'></div>

                <div className='grid grid-cols-1 relative z-20'>
                    <StatsInfoCard icon={<LuTrendingUp  />}
                        label="Track Your Income & Expense"
                        value="430,000"
                        color="bg-primary" />
                </div>


                <img
                    src={Card_2}
                    alt="logo not available"
                    className='h-96 w-64 lg:w-[90%] absolute bottom-10 left-1/2 -translate-x-1/2 shadow-lg shadow-blue-400/15 rounded z-10'
                />
            </div>

        </div>

    )
}

export default AuthLayout
