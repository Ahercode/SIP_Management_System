import axios from 'axios';

// const tenantId = localStorage.getItem('tenant')

// export const Api_Endpoint = "http://208.117.44.15/omniAppraisalApi/api";
// export const Api_Endpoint = "https://app.sipconsult.net/omniAppraisalApi/api";
export const Api_Endpoint = "http://109.169.12.107/omniAppraisalApi/api";
export const ImageBaseUrl = "http://109.169.12.107"
// export const ImageBaseUrl = "https://app.sipconsult.net"
// export const Api_Endpoint = "https://localhost:5001/api";
export const UsersEndpoint = "https://app.sipconsult.net/userapi/api";
export const FormsBaseUrl = "https://app.sipconsult.net/apms";
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

export const fetchUserRoles = () => {
    return axios.get(`${UsersEndpoint}/UserRoles`)
}
// export const fetchUserApplications = () => {
//     return axios.get(`${UsersEndpoint}/UserApplications`)
// }

export const fetchRoles = () => {
    return axios.get(`${UsersEndpoint}/Roles`)
}
export const fetchUsers = () => {
    return axios.get(`${UsersEndpoint}/Users`)
}

// export const fetchCompanies = () => {
//     return axios.get(`${UsersEndpoint}/Companies`)
// }

export const fetchDivisions = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Divisions/tenant/${tId}`)
}


export const updateDivison = (data: any) => {
    return axios.put(`${Api_Endpoint}/Divisions/${data.id}`, data)
}

export const fetchDepartments = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Departments/tenant/${tId}`)
}
export const updateDepartment = (data: any) => {
    return axios.put(`${Api_Endpoint}/Departments/${data.id}`, data)
}
export const fetchUnits = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Units/tenant/${tId}`)
}
export const fetchParameters = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Parameters/tenant/${tId}`)
}
export const updateUnit = (data: any) => {
    return axios.put(`${Api_Endpoint}/Units/${data.id}`, data)
}
export const fetchGrades = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Grades/tenant/${tId}`)
}
export const updateGrade = (data: any) => {
    return axios.put(`${Api_Endpoint}/Grades/${data.id}`, data)
}
export const fetchGradePerks = (tId:any) => {
    return axios.get(`${Api_Endpoint}/GradePerks/tenant/${tId}`)
}
export const updateGradePerks = (data: any) => {
    return axios.put(`${Api_Endpoint}/GradePerks/${data.id}`, data)
}
export const fetchPerks = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Perks/tenant/${tId}`)
}
export const updatePerk = (data: any) => {
    return axios.put(`${Api_Endpoint}/Perks/${data.id}`, data)
}
export const fetchCategories = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Categories/tenant/${tId}`)
}
export const updateCategory = (data: any) => {
    return axios.put(`${Api_Endpoint}/Categories/${data.id}`, data)
}
export const fetchNotches = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Notches/tenant/${tId}`)
}
export const updateNotch = (data: any) => {
    return axios.put(`${Api_Endpoint}/Notches/${data.id}`, data)
}
export const fetchPaygroups = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Paygroups/tenant/${tId}`)
}
export const updatePaygroup = (data: any) => {
    return axios.put(`${Api_Endpoint}/Paygroups/${data.id}`, data)
}
export const fetchEmployees = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Employees/tenant/${tId}`)
}
export const updateEmployee = (data: any) => {
    return axios.put(`${Api_Endpoint}/Employees/${data.id}`, data)
}
export const updateBenefit = (data: any) => {
    return axios.put(`${Api_Endpoint}/Benefits/${data.id}`, data)
}
export const fetchBenefits = (tId: any) => {
    return axios.get(`${Api_Endpoint}/Benefits/tenant/${tId}`)
}
export const fetchBanks = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Banks/tenant/${tId}`)
}
export const fetchNationalities = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Nationalities/tenant/${tId}`)
}

export const updateNationality = (data: any) => {
    return axios.put(`${Api_Endpoint}/Nationalities/${data.id}`, data)
}
export const fetchSkills = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Skills/tenant/${tId}`)
}
export const updateSkill = (data: any) => {
    return axios.put(`${Api_Endpoint}/Skills/${data.id}`, data)
}

export const fetchExperiences = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Experiences/tenant/${tId}`)
}
export const fetchQualifications = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Qualifications/tenant/${tId}`)
}
export const updateQualification = (data: any) => {
    return axios.put(`${Api_Endpoint}/Qualifications/${data.id}`, data)
}
export const fetchJobTitles = (tId:any) => {
    return axios.get(`${Api_Endpoint}/JobTitles/tenant/${tId}`)
}
export const updateJobTitle = (data: any) => {
    return axios.put(`${Api_Endpoint}/JobTitles/${data.id}`, data)
}


export const fetchGradeLeaves = (tId:any) => {
    return axios.get(`${Api_Endpoint}/GradeLeaves/tenant/${tId}`)
}
export const updateGradeLeave = (data: any) => {
    return axios.put(`${Api_Endpoint}/GradeLeaves/${data.id}`, data)
}

export const fetchCurrencies = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Currencies/tenant/${tId}`)
}

export const fetchLeaveTypes = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Leaves/tenant/${tId}`)
}
//update leave type
export const updateLeaveType = (data: any) => {
    return axios.put(`${Api_Endpoint}/Leaves/${data.id}`, data)
}
export const fetchAppraisals = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Appraisals/tenant/${tId}`)
}
//update appraisal
export const updateAppraisal = (data: any) => {
    return axios.put(`${Api_Endpoint}/Appraisals/${data.id}`, data)
}
export const fetchPeriods = (tId:any) => {
    return axios.get(`${Api_Endpoint}/Periods/tenant/${tId}`)
}







