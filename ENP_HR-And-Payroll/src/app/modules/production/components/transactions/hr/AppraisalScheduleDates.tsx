import { PlusOutlined } from "@ant-design/icons"
import { Button, Modal, Popconfirm, Skeleton, Space, Spin, Table, message } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { set, useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Api_Endpoint, FormsBaseUrl, axioInstance, deleteItem, fetchDocument, postItem } from "../../../../../services/ApiCalls"
import { getTimeLeft } from "../../ComponentsFactory"
import axios from "axios"
import { all } from "@devexpress/analytics-core/analytics-elements-metadata"

const ReviewDateComponent = ({ referenceId, selectedAppraisalType, employeesInDataByID }: any) => {
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })
    const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`Appraisals`), { cacheTime: 10000 })
    const [gridData, setGridData] = useState<any>([])
    const [loading, setLoading] = useState(false)
    const [isReviewDateModalOpen, setIsReviewDateModalOpen] = useState(false)
    const { reset, register, handleSubmit } = useForm()
    const queryClient = useQueryClient()
    const [isEmailSent, setIsEmailSent] = useState<any>(false)
    const [description, setDescription] = useState<any>('')
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
    const [sendLoading, setSendLoading] = useState(false)
    const [scheduleDateData, setScheduleDateData] = useState<any>({})
    const [tempData, setTempData] = useState<any>()
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)


    const handleNotificationCancel = () => {
        setIsNotificationModalOpen(false)
    }

    const showNotificationModal = () => {
        setIsNotificationModalOpen(true)
    }
    const handleChange = (event: any) => {
        event.preventDefault()
        setTempData({ ...tempData, [event.target.name]: event.target.value });
      }

    const showReviewDateModal = (record:any) => {
        setIsReviewDateModalOpen(true)
        // console.log('record: ', record)
        setTempData(record);
    }


    const handleStatus = (record:any) => {
        setIsStatusModalOpen(true)
        // console.log('record: ', record)
        setTempData(record);
    }

    const handleStatusCancel = () => {
        reset()
        setIsStatusModalOpen(false)
        setTempData({})
    }

    const handleReviewDateCancel = () => {
        reset()
        setIsReviewDateModalOpen(false)
    }

    const loadData = async () => {
        // setLoading(true)
        const response = allReviewdates?.data?.filter((refId: any) => {
            return refId?.referenceId === referenceId
        })

        setGridData(response)
        // try {
        //     const response = allReviewdates?.data?.filter((refId: any) => {
        //         return refId?.referenceId === referenceId
        //     })
        //     setGridData(response)
        //     setLoading(false)
        // } catch (error) {
        //     console.log(error)
        //     setLoading(false)
        // }
    }

    const reviewData = allReviewdates?.data?.filter((refId: any) => {
        return refId?.referenceId === referenceId
    })
   

    function handleDeleteReviewDate(element: any) {
        const item = {
            url: 'AppraisalReviewDates',
            data: element
        }
        deleteData(item)
    }

    const { mutate: deleteData } = useMutation(deleteItem, {
        onSuccess: () => {
            queryClient.invalidateQueries('reviewDates')
            message.warning('Record deleted successfully')
            loadData()
        },
        onError: (error) => {
            message.error('Error deleting record')
        }
    })

    // console.log('employeesInDataByID: ', employeesInDataByID?.length)

    const getReviewStatus = ((record: any)=> {

        if(record?.isActive?.trim() === 'active') {
            return "Active"
        }
        else {
            return "Inactive"
        }

 })   

    const reviewDatesColumn:any = [
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Start Date',
            dataIndex: 'reviewDate',
            render: (text: any) => <>{!text ? '---' : moment(text).format('DD/MM/YYYY')}</>
        },
        {
            title: 'Check Up Date',
            dataIndex: 'checkUpDate',
            render: (text: any) => <>{!text ? '---' : moment(text).format('DD/MM/YYYY')}</>
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            render: (text: any) => <>{!text ? '---' : moment(text).format('DD/MM/YYYY')}</>
        },
        {
            title: 'Count down',
            dataIndex: 'reviewDate',
            render: (_:any , record:any) => {
                return <>{getTimeLeft(record)}</>
            },
            // render: (text: any) => getTimeLeft(text),
        },
        // {
        //     title:"Status",
        //     dataIndex:"isActive",
        // },
        {
            title: 'Action',
            render: (record: any) => (
                <Space>
                    {
                        employeesInDataByID?.length > 0 ?
                            <Popconfirm
                                title="Confirm notifcation send"
                                description={<><span className="ml-4">This action will roll out email notifications to all <br />employees in the selected employee group</span></>}
                                onConfirm={()=>handleNotificationSend(record)}
                                placement="leftTop"
                                onCancel={handleNotificationCancel}
                                className="w-100px"
                                okText="Send"
                                cancelText="Cancel"
                                disabled={getReviewStatus(record) === "Inactive"?true:false}
                            >

                            {
                                record?.reviewDate === null || record?.reviewDate === undefined || record?.reviewDate === ""?null:

                                // <a className={'btn btn-light-info btn-sm'}>
                                //     Notify
                                // </a>
                                <>
                                        {/* {console.log('getReviewStatus(record): ', getReviewStatus(record))} */}

                                         <button 
                                             className='btn btn-light-info btn-sm'
                                             disabled={getReviewStatus(record) === "Inactive"?true:false}
                                         >
                                             Notify
                                         </button>
                                </>
                            }
                            </Popconfirm>
                            :""
                    }

                    {
                        record?.reviewDate === null || record?.reviewDate === undefined || record?.reviewDate === ""?
                        <a className='btn btn-light-warning btn-sm' onClick={()=>showReviewDateModal(record)}>
                            Set Details
                        </a>
                        :
                        <>
                            <a className='btn btn-light-warning btn-sm' onClick={()=>handleStatus(record)}>
                                Status - {record?.isActive?.trim() === "active"?"Active":"InActive"}
                            </a>
                            <a className='btn btn-light-danger btn-sm' onClick={() => handleDeleteReviewDate(record)}>
                                Delete
                            </a>
                        </>
                    }
                    
                </Space>
            ),
        }
    ]


    const submitReviewDate = handleSubmit(async (values) => {
        if (!values.reviewDate || !values.endDate || !values.checkUpDate) {
            message.error('All dates are required.')
            return
        }
        if (values.description === '') {
            message.error('Please enter description')
            return
        }

        const selectedDate = new Date(values.reviewDate);
        const endDate = new Date(values.endDate);
        const checkUpDate = new Date(values.checkUpDate);
        const item = {
            data: {
                appraisalId: parseInt(selectedAppraisalType),
                reviewDate: selectedDate.toISOString(),
                endDate: endDate.toISOString(),
                checkUpDate: checkUpDate.toISOString(),
                description: values.description,
                oldDescription: tempData?.description,
                tag: tempData?.tag,
                tenantId: 'omnigroup',
                referenceId: referenceId,
            },
            url: 'AppraisalReviewDates',
        }
        console.log('item: ', item?.data)
        postData(item)
    })

    const checkActive = allReviewdates?.data?.filter((item: any) => {
        return item?.isActive?.trim() === "active"
    })

    const changeStatus = handleSubmit(async (values) => {
        
        console.log('tempData: ', tempData)
         const  data = {
                id: tempData?.id,
                appraisalId: tempData?.appraisalId,
                reviewDate: tempData?.reviewDate,
                endDate: tempData?.endDate,
                checkUpDate: tempData?.checkUpDate,
                description: tempData?.description,
                oldDescription: tempData?.oldDescription,
                tenantId: tempData?.tenantId,
                referenceId: tempData?.referenceId,
                tag: tempData?.tag,
                isActive: values.isActive,
            }
        console.log('data: ', data)
        if(checkActive?.length > 0 && values.isActive === "active" ) {
            message.error('Only one active status allowed')
        }else{
            try {
                axios.put(`${Api_Endpoint}/AppraisalReviewDates/${tempData?.id}`,data).then((res) => {
                    message.success('Status changed successfully')
                    setIsStatusModalOpen(false)
                    queryClient.invalidateQueries('reviewDates')
                    reset()
                }
                ).catch((err) => {
                    message.error('Error changing status')
                    console.log('err: ', err)
                })
            } catch (error) {
                message.error('Internal server error')
            }
        }
    })

    const { mutate: postData } = useMutation(postItem, {
        onSuccess: () => {
            queryClient.invalidateQueries('reviewDates')
            reset()
            setIsReviewDateModalOpen(false)
            loadData()
            setSendLoading(false)
            message.success(' Notifications sent successfully')
            setIsEmailSent(false)
        },
        onError: (error: any) => {
            console.log('post error: ', error)
            setSendLoading(false)
            isEmailSent && message.error('Error sending email notifications')
            handleNotificationCancel()
        }
    })

    const handleNotificationSend = (record: any) => {

        setIsEmailSent(true)
        setSendLoading(true)
        //map throw dataById and return employeeId and name of employee as a new array
        const employeeMailAndName = employeesInDataByID?.map((item: any) => ({
            email: item.email,
            username: `${item.firstName} ${item.surname}`,
            employeeId: item.employeeId
        }))

        const item = {
            data: {
                subject: 'Appraisal Review Date',
                formLink: `${FormsBaseUrl}/parameterEntry`,
                recipients: employeeMailAndName
            },
            url: 'appraisalperftransactions/sendMail',
        }

        // const employeePerformanceData = employeeMailAndName?.map((item: any) => ({
        //     employeeId: item.employeeId,
        //     Status: 'Pending',
        //     referenceId: referenceId,
        //     scheduleDateId: record.id,
        // }))

        // const item2 = {
        //     data: employeePerformanceData,
        //     url: 'EmployeePerfDetails',
        // }
        // console.log('EmployeePerfDetails: ', item2)
     
        console.log('email sent: ', item)
        // setIsEmailSent(true)
        postData(item)
        setIsEmailSent(false)
        
    }
    // find the appraisal type id
    const findAppraisal = allAppraisals?.data?.find((item: any) => {
        if(item.id === parseInt(selectedAppraisalType)) {
            return item?.numReview
        }
    })

    useEffect(() => {
        loadData()
    }, [referenceId])

    reviewData?.push({
        description: `Initial`,
        reviewDate: "",
        endDate: "",
        checkUpDate: "",
        startDate: "",
        tag: "setting"
    })
    for (let i = 0; i < findAppraisal?.numReview; i++) {
        reviewData?.push({
            description: `Review ${i+1}`,
            reviewDate: "",
            endDate: "",
            checkUpDate: "",
            startDate: "",
            tag: "actual"
        });
    }
    reviewData?.push({
        description: `Final`,
        reviewDate: "",
        endDate: "",
        checkUpDate: "",
        startDate: "",
        tag: "final"
    })

    const filteredGridData = reviewData?.filter((review: any) => {
        const hasMatchingOldDescription = reviewData?.some((item :any) => item.oldDescription === review.description);
        return !hasMatchingOldDescription;
    })

    return (
        <>
            <div className='col-12'>
                <div className='d-flex justify-content-between'>
                    <span className='form-label'>Schedule Dates</span>
                </div>
                <Spin spinning={sendLoading}>
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '5px',
                        }}
                        className="border border-gray-400"
                    >
                        {
                            loading ? <Skeleton active /> :
                                <Table columns={reviewDatesColumn} dataSource={filteredGridData} />
                        }
                    </div>
                </Spin>
            </div>
            <Modal
                title='Add schedule date details'
                open={isReviewDateModalOpen}
                onCancel={handleReviewDateCancel}
                closable={true}
                width={700}
                footer={[
                    <Button key='back' onClick={handleReviewDateCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key='submit'
                        type='primary'
                        htmlType='submit'
                        onClick={submitReviewDate}
                    >
                        Done
                    </Button>,
                ]}
            >
                <form onSubmit={submitReviewDate}>
                    <div className='row mt-7'>
                        <div className='col-4 mb-7'>
                            <label htmlFor='exampleFormControlInput1' className='form-label'>Start Date</label>
                            <input
                                {...register("reviewDate")}
                                type='date'
                                min={moment().format('YYYY-MM-DD')}
                                onChange={handleChange}
                                className='form-control form-control-solid'
                            />
                        </div>
                        <div className='col-4 mb-7'>
                            <label htmlFor='exampleFormControlInput1' className='form-label'>Check Up Date</label>
                            <input
                                {...register("checkUpDate")}
                                min={moment().format('YYYY-MM-DD')}
                                type='date'
                                onChange={handleChange}
                                className='form-control form-control-solid'
                            />
                        </div>
                        <div className='col-4 mb-7'>
                            <label htmlFor='exampleFormControlInput1' className='form-label'>End Date</label>
                            <input
                                {...register("endDate")}
                                min={moment().format('YYYY-MM-DD')}
                                type='date'
                                onChange={handleChange}
                                className='form-control form-control-solid'
                            />
                        </div>
                    </div>
                    <div className='mb-7'>
                        <label htmlFor="exampleFormControlInput1" className="form-label">Description</label>
                        <input
                            {...register("description")}
                            onChange={(e) => setDescription(e.target.value)}
                            defaultValue={tempData?.description}
                            type="text"
                            className="form-control form-control-solid" />
                    </div>
                </form>
            </Modal>

            <Modal
                title='Change Status'
                open={isStatusModalOpen}
                onCancel={handleStatusCancel}
                closable={true}
                width={300}
                footer={[
                    <Button key='back' onClick={handleStatusCancel}>
                        Cancel
                    </Button>,
                    <Button
                        key='submit'
                        type='primary'
                        htmlType='submit'
                        onClick={changeStatus}
                    >
                        Done
                    </Button>,
                ]}  
            >
                <hr></hr>
                 <form onSubmit={changeStatus}>
                    <div className=' mb-7'>
                        <label className=" form-label">Status</label>
                        <select 
                        {...register("isActive")} name="isActive"
                        value={tempData?.isActive?.trim()}
                        onChange={handleChange}
                        className="form-select form-select-solid" aria-label="Select example">
                            <option value="select">Select status</option>
                            <option value="active">Start</option>
                            <option value="inactive">End</option>
                        </select>
                    </div>
                 </form>
            </Modal>
        </>
    )
}

export { ReviewDateComponent }


