import { Skeleton, Table, Tag } from "antd"
import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { getEmployeePropertyName, getEmployeeProperty } from "../ComponentsFactory"

const DownLines = ({ filteredByLineManger, loading }: any) => {
    const { data: downlines } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`departments`), { cacheTime: 5000 })
    const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument(`jobTitles`), { cacheTime: 5000 })


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
                return <Tag color={text === "Not Submitted" ? "error" : "purple"}>{text}</Tag>
            }
        },
        {
            title: 'Action',
            fixed: 'right',
            width: 100,
            render: (_: any, record: any) => (
                <a onClick={() => { }} className='btn btn-light-info btn-sm'>
                    Amend
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
            title: 'Department',
            dataIndex: 'department',
        },
        {
            title: 'Job Title',
            dataIndex: 'jobTitle',
        },
        {
            title: 'Email',
            dataIndex: 'email',
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
            render: (_: any, record: any) => (
                <a onClick={() => { }} className='btn btn-light-info btn-sm'>
                    Amend
                </a>
            ),
        },
    ]


    return (
        <>
            {
                loading ? <Skeleton active /> :
                    <Table columns={columns2} dataSource={filteredByLineManger} />
            }
        </>
    )

}



export { DownLines }