import { ErrorBoundary } from "@ant-design/pro-components"
import { Divider } from "antd"
import { ComponentType, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { useParams } from "react-router-dom"
import { fetchDocument } from "../../../../services/ApiCalls"
import { getFieldName, getSupervisorData } from "../ComponentsFactory"

interface ComponentWrapperProps {
    contentComponent: ComponentType<any>;
    footerComponent: any
}

interface ContentProps {
    component: React.ComponentType<any>;
    employeeId?: any;
    parametersData: any;
}

const FormTemplate: React.FC<ComponentWrapperProps> = ({ contentComponent: Component, footerComponent, }) => {
    const [parametersData, setParametersData] = useState<any>([])
    const param: any = useParams();
    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments`), { cacheTime: 5000 })
    const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })
    const { data: appraisalobjective } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const { data: appraisaldeliverable } = useQuery('appraisaldeliverable', () => fetchDocument(`appraisaldeliverable`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument("employees"), { cacheTime: 5000 })
    const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    // const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`Appraisals`), { cacheTime: 5000 })


    const employeeData = allEmployees?.data?.find((employee: any) => employee.employeeId === param?.employeeId)
    const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
    const empId = employeeData?.id
    
    // const lineManager = getSupervisorData({ employeeId: empId, allEmployees, allOrganograms })

    const lineManager = getSupervisorData({ employeeId: employeeData?.employeeId, allEmployees, allOrganograms })

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

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '5px',
            boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            margin: '40px'
        }} >
            <AppraisalFormHeader employeeData={employeeData} department={department} lineManager={lineManager} />

            <AppraisalFormContent component={Component} parametersData={parametersData} />

            <div className='d-flex align-items-end justify-content-end align-content-end' >
                {footerComponent}
            </div>
        </div>
    )
}

interface AppraisalFormHeaderProps {
    employeeData: any;
    department: any;
    lineManager: any;
    printComponent?: React.ComponentType<any>;
    print?:any
}

const AppraisalFormHeader: React.FC<AppraisalFormHeaderProps> = ({ employeeData, department, lineManager, printComponent: PrintComponent, print}) => {
    return (
        <div className="d-flex flex-column align-items-start mb-5">
            <div className="d-flex justify-content-between flex-direction-row align-items-center align-self-stretch" >
                <div className=' fs-1 fw-bold mb-2 text-primary'>
                    {!employeeData ? 'Unknown Employee' : `${employeeData?.firstName} ${employeeData?.surname}`}
                </div>
                <div>{print}</div>
                {PrintComponent && <PrintComponent />} 
                {/* <Button type="link" className="me-3" onClick={() => { }} icon={<PrinterOutlined rev={'print'} className="fs-1" />} /> */}
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
                {/* <div className='me-9'>
                    <h5 style={{ color: "GrayText" }}>{`Line Manager`}:
                        <span className="ms-3" style={{ color: "black" }}>{!lineManager ? 'Unknown' : `${lineManager?.firstName} ${lineManager?.surname}`}</span>
                    </h5>
                </div> */}
            </div>
        </div>
    )
}

const AppraisalFormContent: React.FC<ContentProps> = ({ parametersData, component: Component, employeeId }) => {
    return (
        parametersData?.map((item: any) => (
            <div className="align-items-start mt-7" >
                <div className="d-flex flex-direction-row align-items-center justify-content-start align-content-center">
                    <span className=' fs-2 fw-bold '>{item?.name}</span>
                    <div className="bullet bg-danger ms-4"></div>
                    <span className=' fs-2 ms-4 fw-bold'>{`(${item?.weight}%)`}</span>
                </div>

                <ErrorBoundary>
                    <Component parameterId={item?.id} employeeId ={employeeId?.toString()}/>
                </ErrorBoundary>
            </div>
        ))
    )
}


export { AppraisalFormContent, AppraisalFormHeader, FormTemplate, }


