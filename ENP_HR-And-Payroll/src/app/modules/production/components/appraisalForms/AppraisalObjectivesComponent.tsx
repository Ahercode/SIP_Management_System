import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Modal, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useParams } from 'react-router-dom'
import { KTCardBody } from '../../../../../_metronic/helpers'
import { deleteItem, fetchAppraisals, fetchDocument, postItem, updateItem } from '../../../../services/ApiCalls'
import { getFieldName } from "../ComponentsFactory"
import { reference } from "@popperjs/core"



const AppraisalObjectivesComponent: React.FC = ({ parameterId, employeeId}: any) => {

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
    const { data: parameterData } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 10000 })
    const { data: componentData, isLoading: loading } = useQuery(`${endPoint}`, () => fetchDocument(`${endPoint}`), { cacheTime: 10000 })
    const { data: allAppraisalDeliverables } = useQuery(`appraisaldeliverable`, () => fetchDocument(`appraisaldeliverable`), { cacheTime: 10000 })
    const { data: allAppraisalObjectives } = useQuery(`appraisalobjective`, () => fetchDocument(`appraisalobjective`), { cacheTime: 10000 })
    const { data: allUnitOfMeasure } = useQuery(`unitOfMeasures`, () => fetchDocument(`UnitOfMeasures`), { cacheTime: 10000 })
    const [objectivesData, setObjectivesData] = useState<any>()

    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })

    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active"
    })

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

    const columns: any = !showDeliverablesEntry ? [
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
            title: 'Weight(%)',
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

        {
            title: 'Action',
            fixed: 'right',
            width: 100,
            render: (_: any, record: any) => (
                <Space size='middle'>
                    <a className='btn btn-light-info btn-sm' onClick={() => deliverablesEntry(record)} >
                        Deliverables
                    </a>
                    {/* {
                         param?.id ==='lineManager'?
                            <>
                                <a onClick={() => showUpdateModal(record)} className='btn btn-light-warning btn-sm'>
                                    Update
                                </a>
                                <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
                                    Delete
                                </a>
                            </> : ""
                    } */}
                </Space>
            ),
        },
    ] :
        [
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
                dataIndex: 'unitOfMeasureId',
                key: 'unitOfMeasureId',
                render: (row: any) => {
                    return getFieldName(row, allUnitOfMeasure?.data)
                  },
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

            // {
            //     title: 'Action',
            //     fixed: 'right',
            //     width: 100,
            //     render: (_: any, record: any) => (
            //         <Space size='middle'>
            //             {
            //                location.pathname !== '/transaction/hr/appraisal-performance' ?
            //                 // param?.id !== 'lineManger' ?
            //                     <>
            //                         <a onClick={() => showUpdateModal(record)} className='btn btn-light-warning btn-sm'>
            //                             Update
            //                         </a>
            //                         <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
            //                             Delete
            //                         </a>
            //                     </> : ""
            //             }
            //         </Space>
            //     ),
            // },
        ]

    const loadData = async () => {
        try {
            const response = componentData?.data
            const dataForActive = response?.filter((item: any) => item?.referenceId === checkActive?.referenceId)    
            setGridData(dataForActive)
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
            section.parameterId === parameterId 
            && section.employeeId === employeeId 
            && section.referenceId === checkActive?.referenceId :
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

    const showUpdateModal = (values: any) => {
        setIsUpdateModalOpen(true)
        setTempData(values);
        setSecondTempData(values);
        showModal()
    }

    const OnSubmit = handleSubmit(async (values) => {
        // input validations
        if (showDeliverablesEntry === 'Objectives') {
            // make sure all values are filled
            if (!values.name || values.weight === '') {
                message.error('Please fill all fields')
                return
            } else if (parseInt(values.weight) <= 0) {
                message.error('Weight cannot be zero or negative')
                return
            } else if (parseInt(values.weight) > 100) {
                message.error('Weight cannot be greater than 100')
                return
            }
        } else {

            // make sure all values are filled
            if (!values.name || !values.subWeight ||
                !values.unitOfMeasure || !values.target) {
                message.error('Please fill all fields')
                return
            } else if (parseInt(values.subWeight) <= 0) {
                message.error('Sub Weight cannot be zero or negative')
                return
            } else if (parseInt(values.target) <= 0) {
                message.error('Target cannot be zero or negative')
                return
            } else if (parseInt(values.weight) > 100) {
                message.error('Weight cannot be greater than 100')
                return
            }
        }

        const itemToPost = !showDeliverablesEntry ? {
            data: {
                name: values.name,
                parameterId: parseInt(param.id),
                description: "description",
                weight: parseInt(values.weight),
                tenantId: tenantId,
                referenceId: '',
                employeeId: ''
            },
            url: endPoint,
        } : {
            data: {
                name: values.name,
                objectiveId: parseInt(param.id),
                description: values.description,
                subWeight: parseInt(values.subWeight),
                unitOfMeasure: values.unitOfMeasure,
                target: parseInt(values.target),
                tenantId: tenantId
            },
            url: endPoint,
        }

        // check if item already exist
        const itemExist = !showDeliverablesEntry ?
            gridData.find((item: any) =>
                item.name === itemToPost.data.name &&
                item.parameterId === itemToPost.data.parameterId &&
                item.description === itemToPost.data.description &&
                item.weight === itemToPost.data.weight
            ) : gridData.find((item: any) =>
                item.name === itemToPost.data.name &&
                item.objectiveId === itemToPost.data.objectiveId &&
                item.description === itemToPost.data.description &&
                item.subWeight === itemToPost.data.subWeight &&
                item.unitOfMeasure === itemToPost.data.unitOfMeasure &&
                item.target === itemToPost.data.target
            )

        if (itemExist) {
            message.error('Item already exist')
            return
        }

        const sums = weightSum(itemToPost.data)

        if (showDeliverablesEntry) {
            if (sums > 0) {
                if (sums + itemToPost.data.subWeight > 100) {
                    return message.error(`Total weight for ${pathName} cannot be greater than 100`);
                } else {
                    postData(itemToPost)
                }
            } else {
                postData(itemToPost)
            }
        } else {
            if (sums > 0) {
                const data = showDeliverablesEntry ? getItemData(objectivesData, allAppraisalObjectives?.data) : getItemData(parameterId, parameterData?.data)
                if (sums + itemToPost.data.weight > data?.weight) {
                    return message.error(`Total weight for ${pathName} cannot be greater than ${data?.weight}`);
                } else {
                    postData(itemToPost)
                }
            } else {
                postData(itemToPost)
            }
        }
    })

    const { mutate: postData } = useMutation(postItem, {
        onSuccess: () => {
            queryClient.invalidateQueries(`${endPoint}`)
            reset()
            setTempData({})
            setSecondTempData({})
            loadData()
            setIsModalOpen(false)
            setSubmitLoading(false)
            message.success('Item added successfully')
        },
        onError: (error: any) => {
            setSubmitLoading(false)
            console.log('post error: ', error)
            message.error('Error adding item')
        }
    })


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

                        <div className="mb-5">
                            <Space>
                                {
                                    showDeliverablesEntry && <>
                                        <Button
                                            onClick={() => goBack()}
                                            className="btn btn-light-primary me-4"
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                display: 'flex',
                                            }}
                                            type="primary" shape="circle" icon={<ArrowLeftOutlined rev={''} />} size={'large'}
                                        />
                                    </>
                                }
                                <span className="fw-bold text-gray-600 d-block fs-2">{!showDeliverablesEntry ? `Objectives` : `${pathName}`}</span>
                            </Space>
                        </div>
                        {
                            param?.id !== 'lineManger' ?
                                <>
                                    {/* <Space className="justify-content-end align-items-end d-flex mb-6" >
                                        <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                                            <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                                            Add
                                        </button>
                                    </Space> */}
                                </> : ""
                        }
                    </div>
                    {
                        loading ? <Skeleton active /> :
                            <Table columns={columns} dataSource={dataByID} />
                    }
                    <Modal
                        title={!showDeliverablesEntry ? isUpdateModalOpen ? `Update Objective` : `Add Objective` : isUpdateModalOpen ? `Update Deliverable` : `Add Deliverable`}
                        open={isModalOpen}
                        onCancel={handleCancel}
                        width={!showDeliverablesEntry ? 500 : 800}
                        closable={true}
                        footer={[
                            <Button key='back' onClick={handleCancel}>
                                Cancel
                            </Button>,
                            <Button
                                key='submit'
                                type='primary'
                                htmlType='submit'
                                onClick={isUpdateModalOpen ? handleUpdate : OnSubmit}
                            >
                                Submit
                            </Button>,
                        ]}
                    >
                        <form
                            onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmit}
                        >
                            <hr></hr>
                            {
                                !showDeliverablesEntry ?
                                    <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                                        <div className='mb-7'>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                                            <input
                                                {...register("name")}
                                                defaultValue={isUpdateModalOpen === true ? tempData.name : null}
                                                onChange={handleChange}
                                                className="form-control form-control-solid" />
                                        </div>

                                        <div className='mb-7'>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">{`Weight(%)`}</label>
                                            <input
                                                {...register("weight")}
                                                type='number' min='0'
                                                defaultValue={isUpdateModalOpen === true ? tempData.weight : 0}
                                                onChange={handleChange}
                                                className="form-control form-control-solid" />
                                        </div>
                                    </div>
                                    :
                                    <>
                                        <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                                            <div className='col-4 mb-7'>
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                                                <input
                                                    {...register("name")}
                                                    defaultValue={isUpdateModalOpen === true ? tempData.name : null}
                                                    onChange={handleChange}
                                                    className="form-control form-control-solid" />
                                            </div>
                                            <div className='col-8 mb-7'>
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Description</label>
                                                <input
                                                    {...register("description")}
                                                    defaultValue={isUpdateModalOpen === true ? tempData.description : null}
                                                    onChange={handleChange}
                                                    className="form-control form-control-solid" />
                                            </div>
                                        </div>
                                        <div style={{ padding: "0px 20px 20px 20px" }} className='row mb-0 '>
                                            <div className='col-4 mb-7'>
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Unit of measure</label>
                                                <input
                                                    {...register("unitOfMeasure")}
                                                    defaultValue={isUpdateModalOpen === true ? tempData.unitOfMeasure : null}
                                                    onChange={handleChange}
                                                    className="form-control form-control-solid" />
                                            </div>
                                            <div className='col-4 mb-7'>
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Target</label>
                                                <input
                                                    {...register("target")} type='number' min='0'
                                                    defaultValue={isUpdateModalOpen === true ? tempData.target : 0}
                                                    onChange={handleChange}
                                                    className="form-control form-control-solid" />
                                            </div>
                                            <div className='col-4 mb-7'>
                                                <label htmlFor="exampleFormControlInput1" className="form-label">Sub Weight</label>
                                                <input
                                                    {...register("subWeight")}
                                                    type='number' min='0'
                                                    defaultValue={isUpdateModalOpen === true ? tempData.subWeight : 0}
                                                    onChange={handleChange}
                                                    className="form-control form-control-solid" />
                                            </div>
                                        </div>
                                    </>
                            }
                        </form>
                    </Modal>
                </div>
            </KTCardBody>
        </div>
    )
}

export { AppraisalObjectivesComponent }
