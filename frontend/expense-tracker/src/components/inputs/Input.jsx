import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

export default function Input({ value, onChange, placeholder, label, type }) {
    
    const [showPassword, setShowPassword] = useState(false)

    const toggleShowPassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
            <label className='text-[13px] text-slate-800'>{label}</label>

            <div className='relative'>
                <input
                    type={type === "password" ? (showPassword ? 'text' : 'password') : type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e)}
                    className='bg-gray-200/55 h-10 w-full pr-10 pl-1 rounded border-2 border-gray-400/45'
                />

                {type === "password" && (
                    <span
                        className='absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-primary'
                        onClick={toggleShowPassword}
                    >
                        {showPassword ? <FaRegEyeSlash size={20} /> : <FaRegEye size={20} />}
                    </span>
                )}
            </div>
        </>
    )
}