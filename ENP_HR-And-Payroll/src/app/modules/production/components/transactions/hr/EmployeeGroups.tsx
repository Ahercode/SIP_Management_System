import { message, Skeleton, Table } from "antd"
import { useState, useEffect } from "react"
import { useQuery, useQueryClient, useMutation } from "react-query"
import { fetchDocument, postItem } from "../../../../../services/ApiCalls"
import { getEmployeeProperty, getEmployeePropertyName, getSupervisorData } from "../../ComponentsFactory"

const EmployeeGroups = ({ allEmployeeGroups, loading, selectedPaygroup, openModal }: any) => {

    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument(`jobTitles`), { cacheTime: 5000 })
    const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: allPaygroups } = useQuery('paygroups', () => fetchDocument('Paygroups'), { cacheTime: 5000 })
    const [gridDataToBeSaved, setGridDataToBeSaved] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(openModal)
    const queryClient = useQueryClient()
    const [submitLoading, setSubmitLoading] = useState(false)

    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'employeeId',
            key: 'employeeId',
            render: (employeeId: any) => {
                return <span className='text-primary'>{getEmployeeProperty({ employeeId: employeeId, fieldName: 'employeeId', allEmployees: allEmployees?.data })}</span>
            },
            sorter: (a: any, b: any) => {
                if (a.employeeId > b.employeeId) {
                    return 1
                }
                if (b.employeeId > a.employeeId) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Name',
            dataIndex: 'employeeId',
            key: 'employeeId',
            render: (employeeId: any) => {
                return <span>
                    {`
                    ${getEmployeeProperty({ employeeId: employeeId, fieldName: 'firstName', allEmployees: allEmployees?.data })} 
                    ${getEmployeeProperty({ employeeId: employeeId, fieldName: 'surname', allEmployees: allEmployees?.data })}
                    `}
                </span>
            },
            sorter: (a: any, b: any) => {
                if (a.employeeId > b.employeeId) {
                    return 1
                }
                if (b.employeeId > a.employeeId) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Job Title',
            dataIndex: 'employeeId',
            render: (employeeId: any) => {
                return <span>{getEmployeePropertyName({ employeeId: employeeId, employeeProperty: 'jobTitleId', allEmployees: allEmployees?.data, otherData: allJobTitles?.data })}</span>
            },
            sorter: (a: any, b: any) => {
                if (a.jobt > b.jobt) {
                    return 1
                }
                if (b.jobt > a.jobt) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Email',
            dataIndex: 'employeeId',
            render: (employeeId: any) => {
                return <span>{getEmployeeProperty({ employeeId: employeeId, fieldName: 'email', allEmployees: allEmployees?.data })}</span>
            },
            sorter: (a: any, b: any) => {
                if (a.jobt > b.jobt) {
                    return 1
                }
                if (b.jobt > a.jobt) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Line Manager',
            dataIndex: 'employeeId',
            render: (employeeId: any) => {
                return getSupervisorName(employeeId)
            },
            sorter: (a: any, b: any) => {
                if (a.jobt > b.jobt) {
                    return 1
                }
                if (b.jobt > a.jobt) {
                    return -1
                }
                return 0
            },
        },

        {
            title: 'Action',
            fixed: 'right',
            width: 100,
            render: (_: any, record: any) => (
                <a onClick={() => removeItemFromGridDataToBeSaved(record)} className='btn btn-light-danger btn-sm'>
                    Remove
                </a>
            ),

        },
    ]

    const getSupervisorName = (employeeId: any) => {
        const supervisorName = getSupervisorData({ employeeId, allEmployees, allOrganograms })
        return supervisorName === undefined ? 'Undefined' : `${supervisorName?.firstName} ${supervisorName?.surname}`
    }

    const loadData = async () => {
        try {
            setGridDataToBeSaved(allEmployeeGroups)
        } catch (error) {
            console.log(error)
        }
    }

    const handleCancel = () => {
        setGridDataToBeSaved(allEmployeeGroups)
        setIsModalOpen(false)
        openModal(false)
    }

    useEffect(() => {
        loadData()
    }, [])


    const removeItemFromGridDataToBeSaved = (item: any) => {
        setGridDataToBeSaved((prev: any) => {
            return prev.filter((prevItem: any) => {
                return prevItem !== item
            })
        })
    }

    const submitEmployeeGroup = () => {
        try {
            const item = {
                data: gridDataToBeSaved,
                url: `appraisalPerfTransactions`,
            }
            // postData(item)
        } catch (error) {
            console.log(error)
        }
    }

    const { mutate: postData } = useMutation(postItem, {
        onSuccess: () => {
            queryClient.invalidateQueries('appraisalPerfTransactions')
            handleCancel()
        },
        onError: (error: any) => {
            message.error('Error occurred while saving group')
            console.log('post error: ', error)
        }
    })


    return (
        <>
            {
                loading ? <Skeleton active /> :
                    <Table columns={columns} dataSource={gridDataToBeSaved} />
            }
        </>
    )

}

export { EmployeeGroups }