import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/layouts/AuthLayout'
import Input from '../../components/inputs/Input';
import { validateEmail } from '../../utils/helper.js'
import ProfilePhotoSelector from '../../components/inputs/ProfilePhotoSelector.jsx'
import axiosInstance from '../../utils/axiosinstance.js';
import { API_PATHS } from '../../utils/apiPaths.js';
import toast from 'react-hot-toast'

import { UserContext } from '../../context/UserContext';
import { useContext } from 'react';

import { uploadImage } from '../../utils/uploadImage.js';



export default function Signin() {

  const [profilePic, setProfilePic] = useState(null)
  const [fullname, setfullname] = useState("")
  const [password, setpassword] = useState("")
  const [email, setemail] = useState("")
  const [loading, setloading] = useState(false);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate()

  const [error, seterror] = useState(null)

  const HandleSubmit = async (e) => {
    e.preventDefault()

    let profileImageUrl = "";

    if (!validateEmail(email)) {
      seterror("Please enter a valid Email address.")
      return
    }

    if (!password) {
      seterror("Please enter the password");
      return;
    }

    if (!fullname) {
      seterror("Please enter the Fullname");
      return;
    }



    seterror(null)
    setloading(true)

    try {

      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.data.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullname,
        email,
        password,
        profileImageUrl
      })

      const token = response.data?.data?.AccessToken;
      const user = response.data?.data?.user;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
        return;
      }


      // Optional: redirect to login
      toast.success("Signup successful!");
      navigate("/login");
      return;

    } catch (error) {
      console.log("FULL ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      toast.error(message);
      seterror(message);
    }
    finally {
      setloading(false)
    }
  }




  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold text-black'>Create an Account</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>Join us today by entering your details below</p>

        <form onSubmit={HandleSubmit} className="flex flex-col gap-4">

          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='text-gray-600 text-lg'>Profile photo upload is currently disabled</div>
          <div className='text-gray-600 text-sm'>This feature will be available soon</div>
          <div className="grid grid-cols-2 gap-6 w-full ">

            {/* Full Name */}
            <div className="flex flex-col">
              <Input
                type="text"
                placeholder="Enter Fullname"
                value={fullname}
                onChange={(e) => setfullname(e.target.value)}
                label="Full Name"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                label="Password"
              />
            </div>


            {/* Email (full row) */}
            <div className="col-span-2">
              <Input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                label="Email"
              />
            </div>


          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button type="submit" className={loading ? "btn-load" : "btn-primary"}>
            {loading ? "Creating account..." : "Sign up"}
          </button>

          <p>
            Already have an account?{" "}
            <Link className='font-medium text-primary underline' to='/login'>
              Login
            </Link>
          </p>

        </form>

      </div >

    </AuthLayout >
  )
}
