import { Skeleton, Table } from "antd"
import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { getEmployeePropertyName, getEmployeeProperty } from "../ComponentsFactory"

const DownLines = ({ lineManagerId }: any) => {
    const { data: downlines } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`departments`), { cacheTime: 5000 })
    const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument(`jobTitles`), { cacheTime: 5000 })

    const [loading, setLoading] = useState(false)
    const [gridData, setGridData] = useState<any>([])


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
    }, [])


    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'employeeId',
        },
        {
            title: 'Name',
            dataIndex: 'employeeId',
            render: (record: any) => {
                const employee = allEmployees?.data?.find((item: any) => item.id === record)
                return employee?.firstName + ' ' + employee?.surname
            }
        },
        {
            title: 'Department',
            dataIndex: 'employeeId',
            render: (record: any) => {
                return getEmployeePropertyName({ employeeId: record, employeeProperty: 'departmentId', allEmployees: gridData, OtherData: allDepartments?.data })
            }
        },
        {
            title: 'Job Title',
            dataIndex: 'employeeId',
            render: (record: any) => {
                return getEmployeePropertyName({ employeeId: record, employeeProperty: 'jobTitleId', allEmployees: gridData, OtherData: allJobTitles?.data })
            }
        },
        {
            title: 'Email',
            dataIndex: 'employeeId',
            render: (record: any) => {
                return getEmployeeProperty({ employeeId: record, fieldName: 'email', allEmployees: gridData })
            }
        },
    ]


    return (
        <>
            {
                loading ? <Skeleton active /> :
                    <Table columns={columns} dataSource={gridData} />
            }
        </>
    )

}

export {  DownLines }