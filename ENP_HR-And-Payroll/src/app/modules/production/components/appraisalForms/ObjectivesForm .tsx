import { Collapse, CollapseProps, Divider, Space, Table } from "antd"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { useForm } from "react-hook-form"
import { AppraisalObjectivesComponent } from "./AppraisalObjectivesComponent"
import { ErrorBoundary } from "@ant-design/pro-components"
import { useParams } from "react-router-dom"
import { getFieldName, getSupervisorData } from "../ComponentsFactory"
import { FormTemplate } from "./FormTemplateComponent"

const ObjectivesForm: React.FC  = () => {
    // const [parametersData, setParametersData] = useState<any>([])
    // const param: any = useParams();
    // const tenantId = localStorage.getItem('tenant')
    // const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments/tenant/test`), { cacheTime: 5000 })
    // const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters/tenant/test`), { cacheTime: 5000 })
    // const { data: appraisalobjective } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective/tenant/test`), { cacheTime: 5000 })
    // const { data: appraisaldeliverable } = useQuery('appraisaldeliverable', () => fetchDocument(`appraisaldeliverable/tenant/test`), { cacheTime: 5000 })
    // const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 5000 })
    // const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms/tenant/test`), { cacheTime: 5000 })
    // const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`Appraisals/tenant/test`), { cacheTime: 5000 })
    // const [employee, setEmployee] = useState<any>({})
    // const [lineManager, setLineManager] = useState<any>({})
    // const [department, setDepartment] = useState<any>({})

    // const employeeData = () => {
    //     return allEmployees?.data?.find((employee: any) => employee.employeeId === param?.employeeId)
    // }


    // const loadData = async () => {
    //     try {
    //         const parametersResponse = parameters?.data?.filter((item: any) => item.appraisalId === 12)
    //         setEmployee(employeeData())
    //         setParametersData(parametersResponse)
    //         const employeeId = param.employeeId
    //         const supervisorData = getSupervisorData({ employeeId, allEmployees, allOrganograms })
    //         setLineManager(supervisorData)
    //     } catch (error) {
    //         console.log('loadError: ', error)
    //     }
    // }

    // useEffect(() => {
    //     loadData()
    //     setDepartment(getFieldName(employee?.deparmentId, allDepartments))
    // }, [parameters?.data, appraisalobjective?.data, appraisaldeliverable?.data])

    // return (
    //     <div style={{
    //         backgroundColor: 'white',
    //         padding: '40px',
    //         borderRadius: '5px',
    //         boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
    //         margin: '40px'
    //     }}>
    //         <div className="d-flex flex-column align-items-start mb-5">
    //             <div className=' fs-1 fw-bold mb-2 text-primary'>
    //                 {!employee ? 'Unknown Employee' : `${employee?.firstName} ${employee?.surname}`}
    //             </div>
    //             <Divider className="mb-3 mt-0" />
    //             <div className='d-flex row-auto mb-3'>
    //                 <div className='col-4 me-5'>
    //                     <h5 style={{ color: "GrayText" }}>EmployeeId:
    //                         <span style={{ color: "black" }}>{!employee ? `Unknown` : `${employee?.employeeId}`}</span>
    //                     </h5>
    //                 </div>
    //                 <div className='col-4 me-5'>
    //                     <h5 style={{ color: "GrayText" }}>Department:
    //                         <span style={{ color: "black" }}>{!department ? `Unknown` : `${department}`}</span>
    //                     </h5>
    //                 </div>
    //                 <div className='col-4 me-5'>
    //                     <h5 style={{ color: "GrayText" }}>{`Line Manager`}:
    //                         <span style={{ color: "black" }}>{!lineManager ? 'Unknown' : `${lineManager?.firstName} ${lineManager?.surname}`}</span>
    //                     </h5>
    //                 </div>
    //             </div>
    //         </div>
    //         {
    //             parametersData?.map((item: any) => (
    //                 <div className="align-items-start mt-7" >
    //                     <span className=' fs-2 fw-bold mb-5 mt-7'>{item?.name}</span>
    //                     <ErrorBoundary>
    //                         <AppraisalObjectivesComponent parameterId={item.id} />
    //                     </ErrorBoundary>
    //                 </div>
    //             ))
    //         }
    //         <div className='d-flex align-items-end justify-content-end align-content-end' >
    //             <button type='button' className='btn btn-primary me-3 mt-7' onClick={() => { }}>
    //                 Submit
    //             </button>
    //         </div>

    //     </div>
    // )

    return (
        <div>
            <FormTemplate component={AppraisalObjectivesComponent} />
        </div>
    )
}

export { ObjectivesForm }


