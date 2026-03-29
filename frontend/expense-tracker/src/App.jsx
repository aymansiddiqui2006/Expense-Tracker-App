import React from 'react'

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import Login from './pages/Auth/Login.jsx'
import Signin from './pages/Auth/Signin.jsx'
import Home from './pages/Dashboard/Home.jsx'
import Income from './pages/Dashboard/Income.jsx'
import Expense from './pages/Dashboard/Expense.jsx'

import UserProvider from './context/UserProvider.jsx'
import { Toaster } from 'react-hot-toast'


const Root = () => {
  //check is the token existed in local storage
  const isAuthenticates = !!localStorage.getItem("token")

  return isAuthenticates ? (
    <Navigate to="/dashboard" replace />
  ) :
    (
      <Navigate to='/login' replace />
    )
}

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token")
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const route = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signin',
    element: <Signin />
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><Home />
    </ProtectedRoute>
  },
  {
    path: '/income',
    element: <ProtectedRoute><Income />
    </ProtectedRoute>
  },
  {
    path: '/expense',
    element: <ProtectedRoute><Expense /></ProtectedRoute>
  }

])

export default function App() {
  return (

    <UserProvider>
      <RouterProvider router={route} />
      <Toaster toastOptions={{ style: { fontSize: '13px' } }} />
    </UserProvider>

  )
}


