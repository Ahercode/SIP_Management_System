
// getTimeLeft function is used to calculate the time left for review given the review date in ISO format
const getTimeLeft = (reviewDate: any) => {

    const currentDate = new Date();
    const targetDate = new Date(reviewDate);
    targetDate.setHours(0, 0, 0, 0); // Set targetDate to the start of the day

    if (currentDate > targetDate) {
        return "Expired";
    }

    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Calculate days left

    const monthsLeft = Math.floor(daysLeft / 30); // Calculate months left

    if (monthsLeft > 0) {
        return `${monthsLeft} ${monthsLeft === 1 ? "month" : "months"}`;
    } else {
        return `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`;
    }
}

// getSupervisorData function is used to get the supervisor data given the employee id, all employees and all organograms
const getSupervisorData = ({ employeeId, allEmployees, allOrganograms }: any) => {
    // get employee code from employee table
    const employeeIdFromEmployee = allEmployees?.data?.find((item: any) => {
        return item.id === employeeId 
    })

    // get supervisor  id from organogram table
    const supervisorFromEmployeeInOrganogram: any = allOrganograms?.data?.find((item: any) => {
        return item.employeeId === employeeIdFromEmployee?.employeeId
    })

    const employeeIdOfSupervisorFromOrganogram = parseInt(supervisorFromEmployeeInOrganogram?.supervisorId) === 0 ?
        supervisorFromEmployeeInOrganogram :
        allOrganograms?.data.find((item: any) => {
            return item.id === parseInt(supervisorFromEmployeeInOrganogram?.supervisorId)
        })

    const supervisorData = allEmployees?.data?.find((item: any) => {
        return item.employeeId === employeeIdOfSupervisorFromOrganogram?.employeeId
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

// to get the name of an employee property given the employee id, the field name which will return an Id, all employees data and the data of the field which will return a name
const getEmployeePropertyName = ({ employeeId, employeeProperty, allEmployees, OtherData }: any) => {
    const fieldNameId = getEmployeeProperty({ employeeId: employeeId, fieldName: employeeProperty, allEmployees: allEmployees })
    const fieldNameName = getFieldName(parseInt(fieldNameId), OtherData)
    return fieldNameName
}



export { getTimeLeft, getSupervisorData, getFieldName, getEmployeeProperty, getEmployeePropertyName }