import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axiosinstance";

export const uploadImage=async(imageFile)=>{
    const formData=new FormData();

    formData.append('image',imageFile);

    try {
        const response=await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE,formData,{
            headers:{
                'Content-type':'multipart/form-data',
            }
        })
        return response.data;
    } catch (error) {
        console.error("error uploading the image ",error);
        throw error;
    }
}