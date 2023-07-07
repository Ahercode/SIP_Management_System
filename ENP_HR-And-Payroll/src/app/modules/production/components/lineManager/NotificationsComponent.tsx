import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { Skeleton, Table } from "antd"
import { getEmployeeProperty, getEmployeePropertyName } from "../ComponentsFactory"

const NotificationsComponent = ({ lineManagerId }: any) => {
    const { data: allSubmittedObjectives } = useQuery('employeeObjectives', () => fetchDocument(`employeeObjectives`), { cacheTime: 5000 })
    const { data: downlines } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const [loading, setLoading] = useState(false)
    const [viewEmployeeObjectives, setViewEmployeeObjectives] = useState(false)
    const queryClient = useQueryClient()
    const [gridData, setGridData] = useState<any>([])

    const showObjectivesView = (record: any) => {
        setViewEmployeeObjectives(true)
    }

    const hideObjectivesView = () => {
        setViewEmployeeObjectives(false)
    }

    const loadData = async () => {
        setLoading(true)
        try {
            const filteredByLineManger = downlines?.data?.filter((item: any) => item.supervisorId === lineManagerId)
            setGridData(filteredByLineManger)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadData()
    }, [downlines?.data])



    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'employeeId',
        },
        {
            title: 'Name',
            dataIndex: 'employeeId',
        },
        {
            title: 'Approval Status',
            dataIndex: 'status',
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
                    <Table columns={columns} dataSource={[]} />
            }
        </>
    )

}

export  { NotificationsComponent}


