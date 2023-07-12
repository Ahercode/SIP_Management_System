import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Modal, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../../_metronic/helpers'
import { deleteItem, fetchAppraisals, fetchDocument, postItem, updateItem } from '../../../../services/ApiCalls'



const AppraisalObjectivesComponent: React.FC = ({ parameterId }: any) => {

    const [gridData, setGridData] = useState([])
    const [searchText, setSearchText] = useState('')
    let [filteredData] = useState([])
    const [submitLoading, setSubmitLoading] = useState(false)
    const { register, reset, handleSubmit } = useForm()
    const param: any = useParams();
    const tenantId = localStorage.getItem('tenant')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tempData, setTempData] = useState<any>()
    const [secondTempData, setSecondTempData] = useState<any>()
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const queryClient = useQueryClient()
    const [pathName, setPathName] = useState<any>("")
    const [showDeliverablesEntry, setShowDeliverablesEntry] = useState<any>(false)
    const endPoint = showDeliverablesEntry ? 'appraisaldeliverable' : 'appraisalobjective'
    const { data: parameterData } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })
    const { data: componentData, isLoading: loading } = useQuery(`${endPoint}`, () => fetchDocument(`${endPoint}`), { cacheTime: 5000 })
    const { data: allAppraisalDeliverables, isLoading: delLoading } = useQuery(`appraisaldeliverable`, () => fetchDocument(`appraisaldeliverable`), { cacheTime: 5000 })
    const { data: allAppraisalObjectives } = useQuery(`appraisalobjective`, () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const [objectivesData, setObjectivesData] = useState<any>()

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleCancel = () => {
        reset()
        setIsModalOpen(false)
        setIsUpdateModalOpen(false)
        setTempData({})
    }

    const handleChange = (event: any) => {
        event.preventDefault()
        setTempData({ ...tempData, [event.target.name]: event.target.value });
    }

    const { mutate: deleteData, } = useMutation(deleteItem, {
        onSuccess: () => {
            queryClient.invalidateQueries(`${endPoint}`)
            loadData()
        },
        onError: (error) => {
            console.log('delete error: ', error)
            message.error('Error deleting record')
        }
    })

    const deliverablesEntry = (objectivesData: any) => {
        setObjectivesData(objectivesData)
        setShowDeliverablesEntry(true)
    }

    const goBack = () => {
        setShowDeliverablesEntry(false)
    }

    function handleDelete(element: any) {
        const item = {
            url: endPoint,
            data: element
        }
        deleteData(item)
    }

    const columns: any = [
        {
            // title: 'Name',
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
            // title: 'Weight(%)',
            dataIndex: 'weight',
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
    ]

    const deliverablesColumnsRender = (objectiveId: any) => {
        const devData = allAppraisalDeliverables?.data?.filter((item: any) => item.objectiveId === objectiveId)
        const devCols: any = [
            {
                // title: 'Name',
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
                // title: 'Description',
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
                // title: 'Sub Weight(%)',
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
                // title: 'Unit of Measure',
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
                // title: 'Target',
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
        return delLoading ? <Skeleton active/> : <Table columns={devCols} dataSource={devData} pagination={false} />;
    }

    const { data: allAppraisals } = useQuery('appraisals', () => fetchAppraisals(tenantId), { cacheTime: 5000 })

    const loadData = async () => {
        try {
            const response = componentData?.data
            setGridData(response?.data)
        } catch (error) {
            console.log(error)
        }
    }

    // get data for validation and path name
    const getItemData = (fieldProp: any, data: any) => {
        const item = data?.find((item: any) =>
            item?.id.toString() === fieldProp
        )
        return item
    }

    useEffect(() => {
        (async () => {
            setPathName(objectivesData?.name)
        })();
        loadData()
    }, [param, parameterData?.data, objectivesData, showDeliverablesEntry])


    const dataByID = componentData?.data.filter((section: any) => {
        return !showDeliverablesEntry ?
            section.parameterId === parameterId :
            section.objectiveId === objectivesData?.id
    })


    // to find the sum of the weight of the objectives or deliverables needed for validation
    const weightSum = (itemToPost: any) => {
        return showDeliverablesEntry === 'Objectives' ? allAppraisalDeliverables?.data.filter((item: any) => item.parameterId === itemToPost.parameterId)
            .map((item: any) => item.weight)
            .reduce((a: any, b: any) => a + b, 0) :
            allAppraisalDeliverables?.data.filter((item: any) => item.objectiveId === itemToPost.objectiveId)
                .map((item: any) => item.subWeight)
                .reduce((a: any, b: any) => a + b, 0)
    };

    const { mutate: updateData } = useMutation(updateItem, {
        onSuccess: () => {
            queryClient.invalidateQueries(`${endPoint}`)
            loadData()
            reset()
            setTempData({})
            setSecondTempData({})
            setIsUpdateModalOpen(false)
            setIsModalOpen(false)
            message.success('Item updated successfully')
        },
        onError: (error) => {
            console.log('error: ', error)
            message.error('Error updating item')
        }
    })

    const handleUpdate = async (e: any) => {
        e.preventDefault()
        const data = showDeliverablesEntry ? getItemData(objectivesData, allAppraisalObjectives?.data) : getItemData(parameterId, parameterData?.data)
        // input validation
        if (!showDeliverablesEntry) {
            // make sure all values are filled
            if (!tempData.name || !tempData.weight || tempData.weight === '') {
                return message.error('Please fill all fields')
            } else if (parseInt(tempData.weight) <= 0) {
                return message.error('Weight cannot be zero or negative')
            } else if (parseInt(tempData.weight) > 100) {
                message.error('Weight cannot be greater than 100')
                return
            }
        } else {

            // make sure all values are filled
            if (!tempData.name || !tempData.subWeight ||
                tempData.subWeight === '' || !tempData.unitOfMeasure || !tempData.target ||
                tempData.target === '') {
                return message.error('Please fill all fields')
            } else if (parseInt(tempData.subWeight) <= 0) {
                return message.error('Sub Weight cannot be zero or negative')
            } else if (parseInt(tempData.target) <= 0) {
                return message.error('Target cannot be zero or negative')
            } else if (parseInt(tempData.weight) > 100) {
                message.error('Weight cannot be greater than 100')
                return
            }
        }

        //logic validation
        if (!showDeliverablesEntry) {

            if (tempData.name === secondTempData.name && tempData.description === secondTempData.description) {
                if ((weightSum(tempData) - secondTempData.weight) + parseInt(tempData.weight) > data?.weight) {
                    return message.error(`Total weight for ${pathName} cannot be greater than ${data?.weight}`);
                } else {
                    const item: any = {
                        url: endPoint,
                        data: tempData
                    }
                    updateData(item)
                }
            } else {
                //cheeck if new name already exists
                const itemExists = gridData.find((item: any) =>
                    item.name === tempData.name &&
                    item.code === tempData.description
                )

                if (itemExists) { return message.error('Item already exists') } else {
                    if ((weightSum(tempData) - secondTempData.weight) + parseInt(tempData.weight) > data?.weight) {
                        return message.error(`Total weight for ${pathName} cannot be greater than ${data?.weight}`);
                    } else {
                        const item: any = {
                            url: endPoint,
                            data: tempData
                        }
                        updateData(item)
                    }
                }
            }

        } else {
            // deliverables branch
            if (tempData.name === secondTempData.name && tempData.description === secondTempData.description &&
                tempData.unitOfMeasure === secondTempData.unitOfMeasure && tempData.target === secondTempData.target) {
                if ((weightSum(tempData) - secondTempData.subWeight) + parseInt(tempData.subWeight) > 100) {
                    return message.error(`Total sub-weight for ${pathName} cannot be greater than 100`);
                } else {
                    const item: any = {
                        url: endPoint,
                        data: tempData
                    }
                    updateData(item)
                }

            } else {
                //cheeck if new name already exists
                const itemExists = gridData.find((item: any) =>
                    item.name === tempData.name &&
                    item.description === tempData.description &&
                    item.unitOfMeasure === tempData.unitOfMeasure &&
                    item.target === tempData.target
                )

                if (itemExists) { return message.error('Item already exists') } else {
                    const item: any = {
                        url: endPoint,
                        data: tempData
                    }
                    updateData(item)
                }
            }
        }
    }



    return (
        <div
            style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '1px 1px 10px rgba(0,0,0,0.05)',
            }}
            className="border border-gray-400 mt-4"
        >
            <KTCardBody className='py-4 '>
                <div className='table-responsive'>
                    <div className='d-flex justify-content-between align-items-center align-content-center'>

                        {
                            param?.id !== 'lineManger' ?
                                <>
                                    <Space className="justify-content-end align-items-end d-flex mb-6" >
                                        <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                                            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                                            Add
                                        </button>
                                    </Space>
                                </> : ""
                        }
                    </div>
                    {
                        loading ? <Skeleton active /> :
                            <Table columns={columns} dataSource={dataByID} />
                    }
                </div>
            </KTCardBody>
        </div>
    )
}

export { AppraisalObjectivesComponent }