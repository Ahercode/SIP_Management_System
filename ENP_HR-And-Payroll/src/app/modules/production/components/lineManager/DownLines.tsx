import { Button, Modal, Skeleton, Table, Tag } from "antd"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { GetEmployeeStatus, getEmployeeProperty, getEmployeePropertyName,  getFieldName, getSupervisorData } from "../ComponentsFactory"
import { AppraisalObjectivesComponent } from "../appraisalForms/AppraisalObjectivesComponent"
import { AppraisalFormContent, AppraisalFormHeader } from "../appraisalForms/FormTemplateComponent"
import { ErrorBoundary } from "@ant-design/pro-components"

const DownLines = ({ filteredByLineManger, loading}: any) => {
    // const { data: downlines } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`departments`), { cacheTime: 5000 })
    const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument(`jobTitles`), { cacheTime: 5000 })
    const { data: allAppraisalobjective} = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })

    const [isModalOpen, setIsModalOpen] = useState(false)

    // const [submittedStatus, setSubmittedStatus] = useState<any>([])
    // const [draftedStatus, setDraftedStatus] = useState<any>([])
    // const[approvedStatus, setApprovedStatus] = useState<any>([])
    // const [rejectedStatus, setRejectedStatus] = useState<any>([])
    const [employeeData, setEmployeeData] = useState<any>({})
    const [objectivesData, setObjectivesData] = useState<any>([])

    const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })

    const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
    const lineManager = getSupervisorData({ employeeId: employeeData?.id, allEmployees, allOrganograms })

    const parametersData = parameters?.data?.filter((item: any) => item?.appraisalId === 12)


    const showObjectivesView = (record: any) => {
        setIsModalOpen(true)
        const employee = allEmployees?.data?.find((item: any) => item.employeeId === record?.employeeId)

        const objectiveByEMployee = allAppraisalobjective?.data?.filter((item: any) => (item.employeeId) === record?.id.toString())

     
        setObjectivesData(objectiveByEMployee)
        setEmployeeData(employee)
   
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const getEmployeeStatus = ((employeeId:any)=> {
        const allSubmittedObjectives = allAppraisalobjective?.data?.filter((item: any) => {
             return parseInt(item?.employeeId) === employeeId?.id
        })

        if (allSubmittedObjectives.some((obj:any) => obj.status === "submitted")) {
             return  <Tag color="warning">Submitted</Tag>;
         } else if (allSubmittedObjectives.some((obj:any) => obj.status === "rejected")) {
             return  <Tag color="error">Rejected</Tag>;
         }
         else if (allSubmittedObjectives.some((obj:any) => obj.status === "approved")) {
             return <Tag color="success">Approved</Tag>;
         }
         else if (allSubmittedObjectives.some((obj:any) => obj.status === "drafted")) {
             return <Tag color="warning">Drafted</Tag>;
         }
         else{
            return <Tag color="pink">Not Started</Tag>;
        }
 })



    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'employeeId',
        },
        {
            title: 'Name',
            dataIndex: 'employeeId',
            render: (record: any) => {
                const employee = allEmployees?.data?.find((item: any) => item.employeeId === record)
                return employee?.firstName + ' ' + employee?.surname
            }
        },
        {
            title: 'Department',
            dataIndex: 'employeeId',
            render: (record: any) => {
                return getEmployeePropertyName({ employeeId: `${record}`, employeeProperty: 'departmentId', allEmployees: allEmployees?.data, OtherData: allDepartments?.data })
            }
        },
        {
            title: 'Job Title',
            dataIndex: 'employeeId',
            render: (record: any) => {
                return getEmployeePropertyName({ employeeId: `${record}`, employeeProperty: 'jobTitleId', allEmployees: allEmployees?.data, OtherData: allJobTitles?.data })
            }
        },
        {
            title: 'Email',
            dataIndex: 'employeeId',
            render: (record: any) => {
                return getEmployeeProperty({ employeeId: `${record}`, fieldName: 'email', allEmployees: allEmployees?.data })
            }
        },
        {
            title: 'Approval Status',
            dataIndex: 'status',
            render: (_:any, record: any) => {
                return getEmployeeStatus(record)
            }
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 100,
            render: (record: any) => (
                <button disabled={record.status === "drafted"} onClick={() => showObjectivesView(record)} className={record.status === "drafted" ? 'btn btn-bg-secondary btn-sm' : 'btn btn-light-info btn-sm'}>
                    Amend
                </button>
            ),
        },
    ]

    // add a key to dataByID
    const allDownlines = filteredByLineManger?.map((item: any) => {
        return {
            ...item,
            key: item?.employeeId,
            
        }
    })


    useEffect(() => {

    }, [objectivesData])

    return (
        <>
            {
                loading ? <Skeleton active /> :
                    <Table
                        columns={columns}
                        dataSource={filteredByLineManger}
                        expandable={{
                            rowExpandable: (record) => record?.id,
                            expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.comment}
                            </p>,
                        }}
                    />
            }

            <Modal
                open={isModalOpen}
                width={1000}
                onCancel={handleCancel}
                onOk={handleCancel}
                closable={true}
                footer={<>
                <Button onClick={()=>handleCancel()}>Ok</Button>
                </>}
                >
                <div className="py-9 px-9">
                    <AppraisalFormHeader employeeData={employeeData} department={department} lineManager={lineManager} />
                    <ErrorBoundary>
                        <AppraisalFormContent component={AppraisalObjectivesComponent} employeeId={employeeData?.id} parametersData={parametersData} />
                    </ErrorBoundary>
                </div>
            </Modal>
        </>
    )
}



export { DownLines }
