
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
        return item.id === fieldId
    })
    return field?.name
}



export { getTimeLeft, getSupervisorData, getFieldName }