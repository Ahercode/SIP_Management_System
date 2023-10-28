import axios from "axios"
import { Api_Endpoint } from "./ApiCalls"
import { message } from "antd"


export const getFieldName = (fieldId: any, fieldData: any) => {

    console.log("fieldId", fieldId)
    const field = fieldData?.find((item: any) => {
        return parseInt(item.id) === parseInt(fieldId)
    })
    return field?.name
}

export const sendEmail = (record: any, body:any) => {

    console.log('record: ', record)
    const data =  {
            subject: 'Your Appraisal Status',
            body: body,
            email: record?.email,
            employeeName: record?.firstName + ' ' + record?.surname,
        }
        axios.post(`${Api_Endpoint}/Appraisalperftransactions/IndividualEmail`, data)
        .then(response => {
          console.log(response.data);
        }).catch(error => {
            console.error('Error:', error);
        });
        
    console.log('email sent: ', data)
}