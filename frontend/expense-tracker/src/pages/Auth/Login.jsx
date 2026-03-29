import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper.js'
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';

import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';



export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setloading] = useState(false);

  const {updateUser}=useContext(UserContext)


  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!validateEmail(email)) {
      setError("Please enter a valid Email address.")
      return
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError(null);
    setloading(true)

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email: email.trim(),
        password: password.trim()
      })
      console.log("FULL RESPONSE:", response.data);
      const token = response.data?.data?.AccessToken;
      const user = response.data?.data?.user;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user)
        navigate("/dashboard");
      }
      else {
        setError("Invalid login response from server.");
      }
    } catch (error) {
      console.log("ERROR FULL:", error);
      if (error.response && error.response.data.message) {
        console.log("BACKEND ERROR:", error.response.data);
        setError(error?.response?.data?.message);
      }
      else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setloading(false)
    }


  }


  return (
    <AuthLayout>
      <div className='lg:w-[70%] w-3/4 md:h-full flex flex-col justify-center'>

        <h3 className='text-xl font-semibold text-black'>Welcome Back</h3>

        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Please enter your details to log in
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            disabled={loading}
          />

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className={loading ? "btn-load " : "btn-primary"}
            disabled={loading}

          >
            {loading ? "loading..." : "login"}
          </button>
          <p>Don't have an account?{" "}
            <Link className='font-medium text-primary underline' to='/signin'>signup</Link>
          </p>

        </form>
      </div>
    </AuthLayout>
  )
}
