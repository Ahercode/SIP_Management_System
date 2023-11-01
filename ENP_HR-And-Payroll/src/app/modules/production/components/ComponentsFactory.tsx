import { Tag } from "antd";
import { useQuery } from "react-query";
import { fetchDocument } from "../../../services/ApiCalls";
import { start } from "repl";
import { end } from "@popperjs/core";



// getTimeLeft function is used to calculate the time left for review given the review date in ISO format
const getTimeLeft = (record: any) => {
// console.log( "Record from date check",record)
const currentDate = new Date();
const startDate = new Date(record?.reviewDate);
const endDate = new Date(record?.endDate);

    startDate.setHours(0, 0, 0, 0); 
    endDate.setHours(0, 0, 0, 0); 
    const timeDifference = endDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // 

    const monthsLeft = Math.floor(daysLeft / 30);
    if(record?.reviewDate === null || record?.reviewDate === undefined || record?.reviewDate === ""){
        return "---";
    }
    else if (monthsLeft > 0) {
        return `${monthsLeft} ${monthsLeft === 1 ? "month" : "months"}`;
    } 
    else if(daysLeft === 0){
        return "Today";
    }
    else if (daysLeft < 0) {
        return "Expired";
    }
    else {
        return `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`;
    }
}

// getSupervisorData function is used to get the supervisor data given the employee id, all employees and all organograms
const getSupervisorData = ({ employeeId, allEmployees, allOrganograms }: any) => {
    // get employee code from employee table
    const employeeIdFromEmployee = allEmployees?.data?.find((item: any) => {
        return item.id === employeeId || item.employeeId === employeeId
    })

    const supervisorData = allEmployees?.data?.find((item: any) => {
        return item.id === (employeeIdFromEmployee?.lineManagerId)
    })

    return supervisorData
}

// getFieldName function is used to get the field name given the field id and field data
const getFieldName = (fieldId: any, fieldData: any) => {
    const field = fieldData?.find((item: any) => {
        return item.id === parseInt(fieldId)
    })
    return field?.name
}

// to  get property of employee given the employee id, the field name and all employees data
const getEmployeeProperty = ({ employeeId, fieldName, allEmployees }: any) => {
    const employee = allEmployees?.find((item: any) => {
        return item.employeeId === employeeId || item.id === employeeId
    })
    return employee?.[fieldName]
}

const GetEmployeeStatus = ((employeeId:any)=> {
    const { data: allAppraisalobjective} = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const allSubmittedObjectives = allAppraisalobjective?.data?.filter((item: any) => {
         return parseInt(item?.employeeId) === employeeId?.id
    })

    if (allSubmittedObjectives?.some((obj:any) => obj.status === "submitted")) {
         return  <Tag color="warning">Submitted</Tag>;
     } else if (allSubmittedObjectives?.some((obj:any) => obj.status === "rejected")) {
         return  <Tag color="error">Rejected</Tag>;
     }
     else if (allSubmittedObjectives?.some((obj:any) => obj.status === "approved")) {
         return <Tag color="success">Approved</Tag>;
     }
     else if (allSubmittedObjectives?.some((obj:any) => obj.status === "drafted")) {
         return <Tag color="warning">Drafted</Tag>;
     }
     else{
            return <Tag color="pink">Not Started</Tag>;
     }

 
})

// to get the name of an employee property given the employee id, the field name which will return an Id, all employees data and the data of the field which will return a name
const getEmployeePropertyName = ({ employeeId, employeeProperty, allEmployees, OtherData }: any) => {
    const fieldNameId = getEmployeeProperty({ employeeId: employeeId, fieldName: employeeProperty, allEmployees: allEmployees })
    const fieldNameName = getFieldName(parseInt(fieldNameId), OtherData)
    return fieldNameName
}



export { getEmployeeProperty, getEmployeePropertyName, getFieldName, getSupervisorData, getTimeLeft, GetEmployeeStatus};
