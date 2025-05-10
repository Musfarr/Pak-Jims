import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import Swal from "sweetalert2"

const baseurl = "https://api.paqsjims.edu.pk/"



// Interceptors for global Error Handling 

axios.interceptors.response.use(
    
        (success) => {
            return success
        },


        (error) => {
            console.log( 'err : ' ,  error)
            if(error.response) {
                if(error.response.status === 401) {
                    // Clear token and redirect to login page
                    localStorage.clear();
                    window.location.href = "/";
                } else if(error.response.status === 422) {
                    const errors = error.response.data.errors;

                        for (const field in errors) {
                            if (Array.isArray(errors[field])) {
                                errors[field].forEach(msg => {
                                    toast.error(msg);
                                });
                            }
                        }

                }
            }
            
            return Promise.reject(error)
        }
    
)




export const GetApi = async (endpoint, params) => {

    try {
        const result = await axios(
            {
                method : "GET",
                url : baseurl + endpoint,
                params : params || {},
                headers:{
                    authorization : `Bearer ${localStorage.getItem("token")}`
                }
            }
        )

        return result.data
    } catch (error) {
        throw error
    }
}



export const PostApi = async (endpoint, payload) => {

    try {
        const result = await axios(
            {
                method : "POST",
                url : baseurl + endpoint,
                data : payload || {},
                headers:{
                    authorization : `Bearer ${localStorage.getItem("token")}`
                }
            }
        )

        return result.data
    } catch (error) {
        throw error
    }
 }


 export const PutApi = async (endpoint, payload) => {

    try {
        const result = await axios(
            {
                method : "PUT",
                url : baseurl + endpoint,
                data : payload || {},
                headers:{
                    authorization : `Bearer ${localStorage.getItem("token")}`
                }
            }
        )

        return result.data
    } catch (error) {
        throw error
    }
 }
    
export const DeleteApi = async (endpoint , payload) => {

    try {
        const result = await axios(
            {
                method : "DELETE",
                url : baseurl + endpoint,
                data : payload || {},
                headers:{
                    authorization : `Bearer ${localStorage.getItem("token")}`
                }
            }
        )

        return result.data
    } catch (error) {
        throw error
    }
}
