import { Modal, Skeleton, Table, Tag } from "antd"
import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { ObjectivesForm } from "../appraisalForms/ObjectivesForm "
import { set } from "react-hook-form"

const NotificationsComponent = ({ loading, filteredBySubmitted }: any) => {
    const { data: allSubmittedObjectives } = useQuery('employeeObjectives', () => fetchDocument(`employeeObjectives`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const queryClient = useQueryClient()
    const [gridData, setGridData] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [employeeName, setEmployeeName] = useState('')
    const [employeeData, setEmployeeData] = useState<any>({})
    const [prevData, setPrevData] = useState<any>([])
    const [componentData, setComponentData] = useState<any>(filteredBySubmitted)


    const showObjectivesView = (record: any) => {
        setIsModalOpen(true)
        setEmployeeData(record)
    }

    const onObjectivesApproved = () => {
        setPrevData(employeeData)

        setComponentData((prev: any[]) => {
            return prev?.map((item: any) => {
                if (item.employeeId === employeeData?.employeeId) {
                    item.status = 'Approved'
                }
                return item
            })
        })
    }

    useEffect(() => {
    }, [componentData])


    const onObjectivesRejected = () => {
        setComponentData((prev: any[]) => {
            return prev?.map((item: any) => {
                if (item.employeeId === employeeData?.employeeId) {
                    item.status = 'Rejected'
                }
                return item
            })
        })
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
            title: 'Approval Status',
            dataIndex: 'status',
            render: () => {
                return <Tag color="error">Pending</Tag>
            }
        },
        {
            title: 'Action',
            fixed: 'right',
            render: (_: any, record: any) => (
                <a onClick={() => showObjectivesView(record)} className='btn btn-light-info btn-sm'>
                    View Objectives
                </a>

            ),
        },
    ]

    const columns2: any = [
        {
            title: 'Id',
            dataIndex: 'employeeId',
        },
        {
            title: 'Name',
            dataIndex: 'employeeName',
        },

        {
            title: 'Job Title',
            dataIndex: 'jobTitle',
        },

        {
            title: 'Approval Status',
            dataIndex: 'status',
            render: () => {
                return <Tag color="error">Pending</Tag>
            }
        },
        {
            title: 'Action',
            fixed: 'right',
            render: (_: any, record: any) => (
                <a onClick={() => showObjectivesView(record)} className='btn btn-light-info btn-sm'>
                    View Objectives
                </a>

            ),
        },
    ]


    return (
        <>
            {
                loading ? <Skeleton active /> :
                    <Table columns={columns2} dataSource={componentData} />
            }

            <Modal
                open={isModalOpen}
                width={1000}
                onCancel={handleCancel}
                closable={true}
                footer={null}
            >
                <ObjectivesForm
                    onObjectiveApproved={onObjectivesApproved}
                    onObjectiveRejected={onObjectivesRejected}
                />
            </Modal>

        </>
    )

}

const DummyObjectives = [
    {
        id: 1,
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        objective: 'To increase sales by 20%',
        status: 'Not submitted',
        jobTitle: 'Sales Manager',
        department: 'Sales',
        email: 'sample1@gmail.com'
    },
    {
        id: 2,
        employeeId: 'EB62',
        employeeName: 'Jane Sam',
        objective: 'To increase sales by 20%',
        status: 'Awaiting approval',
        jobTitle: 'Sales Manager',
        department: 'Sales',
        email: 'sample2@gmail.com'
    },
    {
        id: 3,
        employeeId: 'EMP003',
        employeeName: 'Dave Smith',
        objective: 'To increase sales by 20%',
        status: 'Not submitted',
        jobTitle: 'Sales Manager',
        department: 'Sales',
        email: 'sample3@gmail.com'
    },
    {
        id: 4,
        employeeId: 'EB63',
        employeeName: 'Dean Sean',
        objective: 'To increase sales by 20%',
        status: 'Awaiting approval',
        jobTitle: 'Sales Manager',
        department: 'Sales',
        email: 'sample4@gmail.com'

    },
    {
        id: 5,
        employeeId: 'EMP005',
        employeeName: 'Paul Hughes',
        objective: 'To increase sales by 20%',
        status: 'Awaiting approval',
        jobTitle: 'Sales Manager',
        department: 'Sales',
        email: 'sample5@gmail.com'
    },
]

export { NotificationsComponent, DummyObjectives }


