import React, { useRef, useState } from 'react'
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

export default function ProfilePhotoSelector({ image, setImage }) {

    const inputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            setImage(file);

            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    return (
        <div className='flex justify-center mb-6'>
            <input
                type="file"
                accept='image/*'
                ref={inputRef}
                onChange={handleImageChange}
                className='hidden'
            />

            {!image ? (
                <div className='w-24 h-24 flex flex-col items-center justify-center bg-purple-100 rounded-full relative'>
                    
                    <LuUser className='text-4xl text-purple-400' />

                    <button
                        type='button'
                        className='absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full text-white'
                        onClick={onChooseFile}
                    >
                        <LuUpload />
                    </button>
                </div>
            ) : (
                <div className='relative'>
                    <img
                        src={previewUrl}
                        alt="profile"
                        className='w-24 h-24 rounded-full object-cover'
                    />

                    <button
                        type='button'
                        className='absolute bottom-0 right-0 bg-red-400 p-2 rounded-full text-white'
                        onClick={handleRemoveImage}
                    >
                        <LuTrash />
                    </button>
                </div>
            )}
        </div>
    );
}