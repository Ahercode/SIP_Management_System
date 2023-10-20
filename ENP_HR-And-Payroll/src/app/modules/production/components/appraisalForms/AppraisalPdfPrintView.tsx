import { Divider, Empty, Skeleton, Table } from 'antd'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { fetchAppraisals, fetchDocument } from '../../../../services/ApiCalls'
import { getFieldName, getSupervisorData } from "../ComponentsFactory"



const PrintComponent: React.FC<PrintHeaderProps> = ({employeeData}: any) => {

    console.log('employeeData', employeeData)

    const [gridData, setGridData] = useState([])
    const param: any = useParams();
    const tenantId = localStorage.getItem('tenant')
    const { data: parameterData } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })
    const { data: allAppraisalDeliverables, isLoading: delLoading } = useQuery(`appraisaldeliverable`, () => fetchDocument(`appraisaldeliverable`), { cacheTime: 5000 })
    const { data: allAppraisalObjectives } = useQuery(`appraisalobjective`, () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const [objectivesData, setObjectivesData] = useState<any>()
    const { data: parameters, isLoading: loading } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })


    const delCols: any = [
        {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a: any, b: any) => {
                if (a.name > b.name) {
                    return 1
                }
                if (b.name > a.name) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Description',
            dataIndex: 'description',
            sorter: (a: any, b: any) => {
                if (a.name > b.name) {
                    return 1
                }
                if (b.name > a.name) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Sub Weight(%)',
            dataIndex: 'subWeight',
            sorter: (a: any, b: any) => {
                if (a.status > b.status) {
                    return 1
                }
                if (b.status > a.status) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Unit of Measure',
            dataIndex: 'unitOfMeasure',
            sorter: (a: any, b: any) => {
                if (a.status > b.status) {
                    return 1
                }
                if (b.status > a.status) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Target',
            dataIndex: 'target',
            sorter: (a: any, b: any) => {
                if (a.status > b.status) {
                    return 1
                }
                if (b.status > a.status) {
                    return -1
                }
                return 0
            },
            // render: (text: any) => <span>{text.toLocaleString()}</span>,
        },
    ]

    const { data: allAppraisals } = useQuery('appraisals', () => fetchAppraisals(tenantId), { cacheTime: 5000 })

    const loadData = async () => {
        try {
            const parametersResponse = parameters?.data?.filter((item: any) => item.appraisalId === 12)
            // const response = componentData?.data
            setGridData(parametersResponse)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadData()
    }, [param, parameterData?.data, objectivesData])

    const empObjectives = (parameterId: number) => {
        // console.log('allAppraisalObjectives', allAppraisalObjectives?.data)
        const data: any = allAppraisalObjectives?.data?.filter((item: any) => item.parameterId === parameterId && item.employeeId === employeeData?.employeeId)
        return data
    }

    return (
        <div>
            <div className='table-responsive'>
                {
                    gridData?.map((item: any) => (
                        <div className="align-items-start mt-7" >
                            <div className="d-flex flex-direction-row align-items-center justify-content-start align-content-center badge badge-light py-4 wrap">
                                <span className=' fs-2 fw-bold '>{item?.name}</span>
                                <div className="bullet bullet-dot bg-danger ms-4"></div>
                                <span className=' fs-2 ms-4 fw-bold'>{`(${item?.weight}%)`}</span>
                            </div>
                            {
                                empObjectives(item?.id).length === 0 ?
                                    <Empty
                                        description={<span className='text-gray-600'>No objectives found </span>}
                                        className="mt-4" /> :
                                    empObjectives(item?.id)?.map((objItem: any) => (
                                        <div className="mb-7 px-3 py-4 mt-4">
                                            <div className="d-flex flex-direction-row align-items-center justify-content-start align-content-center mb-2">
                                                <span className=' fs-3 fw-bold'>{objItem?.name}</span>
                                                <div className="bullet bg-danger ms-4"></div>
                                                <span className=' fs-3 ms-4 fw-bold'>{`${objItem?.description}`}</span>
                                            </div>
                                            <div>
                                                {loading ? <Skeleton active /> :
                                                    <Table
                                                        bordered
                                                        columns={delCols}
                                                        dataSource={allAppraisalDeliverables?.data?.filter((del: any) => del.objectiveId === objItem?.id)}
                                                    />}
                                            </div>
                                        </div>
                                    ))
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

interface PrintHeaderProps {
    employeeData: any;
    printComponent?: React.ComponentType<any>;
    print?: any
}
const AppraisalPrintHeader: React.FC<PrintHeaderProps> = ({ employeeData, printComponent: PrintComponent, print }) => {
    const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments`), { cacheTime: 5000 })
    const { data: allCategories } = useQuery('categories', () => fetchDocument(`categories`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })

    const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
    const category = getFieldName(employeeData?.categoryId, allCategories?.data)
    const lineManager = getSupervisorData({ employeeId: employeeData?.id, allEmployees, allOrganograms })

    return (
        <div className="d-flex flex-column flex-root px-5 py-7">
            <div className="d-flex row-auto align-items-center align-content-center ">
                <div>
                    {
                        employeeData?.imageUrl === null || employeeData?.imageUrl ===""?
                        <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`}></img>:
                          <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${employeeData?.imageUrl}`}></img> 
                         
                        // employeeData?.imageUrl !== null ?
                        //     <img style={{ borderRadius: "5%", width: "100px", height: "100px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${employeeData?.imageUrl}`}></img> :
                        //     <img style={{ borderRadius: "5%", width: "100px", height: "100px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`}></img>
                    }
                </div>
                <div className="column-auto align-items-center align-content-center" >
                    <div className='fs-1 fw-bold mb-2 px-4 d-flex row-auto align-items-center align-content-center'>
                        <div className="me-3"> {!employeeData ? 'Unknown Employee' : `${employeeData?.firstName} ${employeeData?.surname}`} </div>
                        <div className='badge badge-light-primary fs-5'>
                            <span>{employeeData?.employeeId}</span>
                        </div>
                    </div>

                    <div className="d-flex row-auto align-items-center align-content-center fs-4 ">
                        <div className=' d-flex px-4 row-auto align-items-center align-content-center text-gray-500'>
                            <i className="bi bi-envelope"></i>
                            <div className='px-3'>{!employeeData?.email ? `Unavailable` : employeeData?.email}</div>
                        </div>
                        <div className=' d-flex row-auto align-items-center align-content-center text-gray-500'>
                            <i className="bi bi-telephone"></i>
                            <div className='px-3'>{!employeeData?.phone ? `Unavailable` : employeeData?.phone}</div>
                        </div>
                    </div>
                </div>
            </div>
            <Divider />
            <div>
                <div className='d-flex row-auto mb-3'>
                    <div className='me-9'>
                        <h5 style={{ color: "GrayText" }}>{`Department:`}
                            <span className="ms-3" style={{ color: "black" }}>{!department ? `Unknown` : `${department}`}</span>
                        </h5>
                    </div>
                    <div className='me-9'>
                        <h5 style={{ color: "GrayText" }}>{`Category:`}
                            <span className="ms-3" style={{ color: "black" }}>{!category ? `Unknown` : `${category}`}</span>
                        </h5>
                    </div>
                    <div className='me-9'>
                        <h5 style={{ color: "GrayText" }}>{`Line Manager:`}
                            <span className="ms-3" style={{ color: "black" }}>{!lineManager ? 'Unknown' : `${lineManager?.firstName} ${lineManager?.surname}`}</span>
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    )
}
export { AppraisalPrintHeader, PrintComponent }
