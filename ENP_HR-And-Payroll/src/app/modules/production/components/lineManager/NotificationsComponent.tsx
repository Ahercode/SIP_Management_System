import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { Badge, Modal, Skeleton, Table, Tag } from "antd"
import { getEmployeeProperty, getEmployeePropertyName } from "../ComponentsFactory"
import { AppraisalObjectivesComponent } from "../appraisalForms/AppraisalObjectivesComponent"
import { ObjectivesForm } from "../appraisalForms/ObjectivesForm "

const NotificationsComponent = ({ loading, filteredByLineManger }: any) => {
    const { data: allSubmittedObjectives } = useQuery('employeeObjectives', () => fetchDocument(`employeeObjectives`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const queryClient = useQueryClient()
    const [gridData, setGridData] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [employeeName, setEmployeeName] = useState('')


    const showObjectivesView = (record: any) => {
        setIsModalOpen(true)
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
                <a onClick={() => showObjectivesView(record?.employeeId)} className='btn btn-light-info btn-sm'>
                    View Objectives
                </a>

            ),
        },
    ]

    return (
        <>
            {
                loading ? <Skeleton active /> :
                    <Table columns={columns} dataSource={filteredByLineManger} />
            }

            <Modal
                open={isModalOpen}
                width={1000}
                onCancel={handleCancel}
                closable={true}
                footer={null}
            >
                <ObjectivesForm />
            </Modal>

        </>
    )

}

export { NotificationsComponent }


