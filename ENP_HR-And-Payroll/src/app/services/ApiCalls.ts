import axios from 'axios';

// const tenantId = localStorage.getItem('tenant')

// export const Api_Endpoint = "http://208.117.44.15/omniAppraisalApi/api";
// export const Api_Endpoint = "https://app.sipconsult.net/omniAppraisalApi/api";
export const Api_Endpoint = "http://109.169.12.107/omniAppraisalApi/api";
export const ImageBaseUrl = "http://109.169.12.107"
// export const Api_Endpoint = "https://localhost:5001/api";
export const UsersEndpoint = "https://app.sipconsult.net/userapi/api";
export const FormsBaseUrl = "http://109.169.12.107/apms";
// export const FormsBaseUrl = "https://app.sipconsult.net/apms";
// export const UsersEndpoint = "http://208.117.44.15/userapi/api";


export let axioInstance = axios.create({
    headers: {
        Authorization: `${localStorage.getItem("token")}`
    }
}
)

// ------------ApiEndpoint---------------------

//dynamic fetch function
export function fetchDocument(url: string) {
    return axios.get(`${Api_Endpoint}/${url}/`)
}

//dynamic update function
export function updateItem(item: any) {
    return axios.put(`${Api_Endpoint}/${item.url}/${item.data.id}`, item.data)
}

//dynamic delete function
export function deleteItem(item: any) {
    return axios.delete(`${Api_Endpoint}/${item.url}/${item.data.id}`)
}


export function deleteMultipleItem(item: any) {
    return axios.delete(`${Api_Endpoint}/${item.url}/${item.data}`)
}

//dynamic post function
export function postItem(item: any) {
    return axios.post(`${Api_Endpoint}/${item.url}`, item.data)
}

export const updateEmployee = (data: any) => {
    return axios.put(`${Api_Endpoint}/Employees/${data.id}`, data)
}










