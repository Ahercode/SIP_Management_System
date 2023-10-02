import { useQuery } from "react-query"
import { fetchEmployees } from "../../../../services/ApiCalls"

const EmployeeProfile = (employee: any) => {

    const tenantId = localStorage.getItem('tenant')
    const {data:allEmployee} = useQuery('employee',()=> fetchEmployees(tenantId), {cacheTime:5000})

    const employeeData = allEmployee?.data?.find((item:any)=>{
        return item.id === employee?.employee?.employeeId   
    })

    return (
      <>
        <div className='d-flex display-direction-row align-items-center align-content-center'>
          <div>
            {
              employeeData?.imageUrl !== null ?
              
                <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`https://enp.sipconsult.net/hrwebapi/uploads/employee/${employeeData?.imageUrl}`}></img> :
                <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`https://enp.sipconsult.net/hrwebapi/uploads/employee/ahercode1.jpg`}></img>
            }
          </div>
          <div className='col px-4 align-items-center align-content-center'>
            {/* <div className='row'> */}
            <div className='text-dark fw-bold fs-4'>{`${employeeData?.firstName} ${employeeData?.surname}`}</div>
            {/* <div className='text-gray-500'>{employeeData?.email}</div> */}
            {/* </div> */}
            <div className='badge badge-light-primary'>
              <span>{employeeData?.employeeId}</span>
            </div>
          </div>
        </div>
      </>
    )
  }
  
  export {EmployeeProfile }