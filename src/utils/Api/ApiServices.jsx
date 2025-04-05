import axios from "axios"
import { toast, ToastContainer } from "react-toastify"

const baseurl = "https://api.paqsjims.edu.pk/"



// Interceptors for global Error Handling 

axios.interceptors.response.use(
    
        (success) => {
            return success
        },


        (error) => {
            console.log( 'err : ' ,  error)
            if(error.response.status === 401) {
                toast.error("Unauthorized")
                window.location.href = "/"
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
    
export const DeleteApi = async (endpoint) => {

    try {
        const result = await axios(
            {
                method : "DELETE",
                url : baseurl + endpoint,
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

