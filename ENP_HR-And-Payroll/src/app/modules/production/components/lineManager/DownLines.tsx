import { Button, Modal, Skeleton, Table, Tag } from "antd"
import { useState } from "react"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { getEmployeeProperty, getEmployeePropertyName, getFieldName, getSupervisorData } from "../ComponentsFactory"
import { AppraisalObjectivesComponent } from "../appraisalForms/AppraisalObjectivesComponent"
import { AppraisalFormContent, AppraisalFormHeader } from "../appraisalForms/FormTemplateComponent"

const DownLines = ({ filteredByLineManger, loading }: any) => {
    // const { data: downlines } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`departments`), { cacheTime: 5000 })
    const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument(`jobTitles`), { cacheTime: 5000 })
    const { data: appraisalobjective} = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })

    const [isModalOpen, setIsModalOpen] = useState(false)

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

        // const employee = allEmployees?.data?.find((item: any) => (item.id) === record?.id)
        const objectiveByEMployee = appraisalobjective?.data?.filter((item: any) => (item.employeeId) === record?.id.toString())
        console.log('employee: ', employee)
        console.log('record: ', record)
        console.log('objectiveByEMployee: ', objectiveByEMployee)
        // setEmployeeData(employee)
        setObjectivesData(objectiveByEMployee)
        setEmployeeData(employee)
        // setObjectivesData(record)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }


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
            render: (text: any) => {
                return <Tag color={text === "Not submitted" ? "error" : "purple"}>{text}</Tag>
            }
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 100,
            render: (record: any) => (
                <button disabled={record.status === "Not submitted"} onClick={() => showObjectivesView(record)} className={record.status === "Not submitted" ? 'btn btn-bg-secondary btn-sm' : 'btn btn-light-info btn-sm'}>
                    Amend
                </button>
            ),
        },
    ]

    return (
        <>
            {
                loading ? <Skeleton active /> :
                    <Table
                        columns={columns}
                        dataSource={filteredByLineManger}
                        expandable={{
                            rowExpandable: (record) => record.status === 'Rejected',
                            expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.comment}</p>,
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
                <Button onClick={()=>handleCancel()}>Done</Button>
                </>}
                >
                <div className="py-9 px-9">
                    <AppraisalFormHeader employeeData={employeeData} department={department} lineManager={lineManager} />

                    <AppraisalFormContent component={AppraisalObjectivesComponent} employeeId={employeeData?.id} parametersData={parametersData} />
                </div>
            </Modal>
        </>
    )
}



export { DownLines }
