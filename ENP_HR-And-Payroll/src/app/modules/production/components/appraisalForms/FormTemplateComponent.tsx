import { Collapse, CollapseProps, Divider, Space, Table } from "antd"
import { ComponentType, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { useForm } from "react-hook-form"
import { AppraisalObjectivesComponent } from "./AppraisalObjectivesComponent"
import { ErrorBoundary } from "@ant-design/pro-components"
import { useParams } from "react-router-dom"
import { getFieldName, getSupervisorData } from "../ComponentsFactory"

interface ComponentWrapperProps {
    component: ComponentType<any>;
}

const FormTemplate: React.FC<ComponentWrapperProps> = ({ component: Component}) => {
    const [parametersData, setParametersData] = useState<any>([])
    const param: any = useParams();
    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments`), { cacheTime: 5000 })
    const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })
    const { data: appraisalobjective } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const { data: appraisaldeliverable } = useQuery('appraisaldeliverable', () => fetchDocument(`appraisaldeliverable`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`Appraisals`), { cacheTime: 5000 })


    const employeeData = allEmployees?.data?.find((employee: any) => employee.employeeId === param?.id)
    const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
    const empId = employeeData?.id

    const lineManager = getSupervisorData({ employeeId: empId, allEmployees, allOrganograms })

    const loadData = async () => {
        try {
            const parametersResponse = parameters?.data?.filter((item: any) => item.appraisalId === 12)
            setParametersData(parametersResponse)
        } catch (error) {
            console.log('loadError: ', error)
        }
    }

    useEffect(() => {
        loadData()
    }, [parameters?.data, appraisalobjective?.data, appraisaldeliverable?.data])

    const style = param?.id !== 'lineManger' ? {
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
        margin: '40px'
    } : {
        backgroundColor: 'transparent',
        padding: '0px',
        borderRadius: '0px',
        margin: '20px'
    }

    return (
        <div style={style} >
            <div className="d-flex flex-column align-items-start mb-5">
                <div className=' fs-1 fw-bold mb-2 text-primary'>
                    {!employeeData ? 'Unknown Employee' : `${employeeData?.firstName} ${employeeData?.surname}`}
                </div>
                <Divider className="mb-3 mt-0" />
                <div className='d-flex row-auto mb-3'>
                    <div className='me-9'>
                        <h5 style={{ color: "GrayText" }}>Id:
                            <span className="ms-3" style={{ color: "black" }}>{!employeeData ? `Unknown` : `${employeeData?.employeeId}`}</span>
                        </h5>
                    </div>
                    <div className='me-9'>
                        <h5 style={{ color: "GrayText" }}>Department:
                            <span className="ms-3" style={{ color: "black" }}>{!department ? `Unknown` : `${department}`}</span>
                        </h5>
                    </div>
                    <div className='me-9'>
                        <h5 style={{ color: "GrayText" }}>{`Line Manager`}:
                            <span className="ms-3" style={{ color: "black" }}>{!lineManager ? 'Unknown' : `${lineManager?.firstName} ${lineManager?.surname}`}</span>
                        </h5>
                    </div>
                </div>
            </div>
            {
                parametersData?.map((item: any) => (
                    <div className="align-items-start mt-7" >
                        <span className=' fs-2 fw-bold mb-5 mt-7'>{item?.name}</span>
                        <ErrorBoundary>
                            <Component parameterId={item.id} />
                        </ErrorBoundary>
                    </div>
                ))
            }
            <div className='d-flex align-items-end justify-content-end align-content-end' >
                {
                    param?.id !== 'lineManger' ?
                        <>
                            <button type='button' className='btn btn-primary me-3 mt-7' onClick={() => { }}>
                                Submit
                            </button>
                        </> :
                        <>
                            <button type='button' className='btn btn-danger me-3 mt-7' onClick={() => { }}>
                                Decline
                            </button>
                            <button type='button' className='btn btn-success  mt-7' onClick={() => { }}>
                                Approve
                            </button>
                        </>
                }
            </div>

        </div>
    )
}



export { FormTemplate }


