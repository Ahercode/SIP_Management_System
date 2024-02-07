import axios from 'axios';

export const Api_Endpoint = "https://enp.sipconsult.net/userapi/api";
export const Api_Endpoint2 = "https://enp.sipconsult.net/hrwebapi/api";
interface IData {
    id: string;
    [key: string]: any;
}

// create generic type for item make the data generic
type Item<T extends IData> ={
    url: string,
    data: T
}

//dynamic fetch function
export function fetchData(url: string) {
    return axios.get(`${Api_Endpoint}/${url}`)
}

//dynamic update function
export function updateData<T extends IData>(item: Item<T>) {
    return axios.put(`${Api_Endpoint}/${item.url}/${item.data.id}`, item.data)
}

//dynamic delete function
export function deleteData<T extends IData>(item: Item<T>) {
    return axios.delete(`${Api_Endpoint}/${item.url}/${item.data.id}`)
}

export function postData<T extends IData>(item: Item<T>) {
    return axios.post(`${Api_Endpoint}/${item.url}`, item.data)
}


