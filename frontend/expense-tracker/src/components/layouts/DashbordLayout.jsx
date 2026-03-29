import React, { Children, useContext } from 'react'
import { UserContext } from '../../context/UserContext.jsx'
import Navbar from './Navbar.jsx'
import Sidemenu from './Sidemenu.jsx'

export default function DashbordLayout({ children, activeMenu }) {
    const { user, loading } = useContext(UserContext)

    console.log("loading:", loading, "user:", user)

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <div className='animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600'></div>
            </div>
        )
    }

    return (
        <div className=''>
            <Navbar activeMenu={activeMenu} />
            {user && (
                <div className='flex'>
                    <div className='max-[100px]:hidden'>
                        <Sidemenu activeMenu={activeMenu} />
                    </div>
                    <div className='grow mx-5'>{children}</div>
                </div>
            )}
        </div>
    )
}
