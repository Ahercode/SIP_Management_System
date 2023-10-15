import { PlusOutlined } from "@ant-design/icons"
import { Button, Modal, Popconfirm, Skeleton, Space, Spin, Table, message } from "antd"
import moment from "moment"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { FormsBaseUrl, deleteItem, fetchDocument, postItem } from "../../../../../services/ApiCalls"
import { getTimeLeft } from "../../ComponentsFactory"

const ReviewDateComponent = ({ referenceId, selectedAppraisalType, employeesInDataByID }: any) => {
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 5000 })
    const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`Appraisals`), { cacheTime: 5000 })
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
        console.log('record: ', record)
        setTempData(record);
    }

    const handleReviewDateCancel = () => {
        reset()
        setIsReviewDateModalOpen(false)
    }

    const loadData = async () => {
        setLoading(true)
        try {
            const response = allReviewdates?.data?.filter((refId: any) => {
                return refId?.referenceId === referenceId
            })
            setGridData(response)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [
        allReviewdates?.data, referenceId, scheduleDateData
    ])

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

    const reviewDatesColumn = [
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
            render: (text: any) => getTimeLeft(text),
        },
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
                            >

                            {
                                record?.reviewDate === null || record?.reviewDate === undefined || record?.reviewDate === ""?null:

                                <a className={'btn btn-light-info btn-sm'}>
                                    Notify
                                </a>
                            }
                            </Popconfirm>
                            : <a className={'btn btn-light-info btn-sm'}>
                                Notify
                            </a>
                    }

                    {
                        record?.reviewDate === null || record?.reviewDate === undefined || record?.reviewDate === ""?
                        <a className='btn btn-light-warning btn-sm' onClick={()=>showReviewDateModal(record)}>
                            Set Date
                        </a>
                        :<a className='btn btn-light-danger btn-sm' onClick={() => handleDeleteReviewDate(record)}>
                            Delete
                        </a>
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
                description: tempData?.description,
                tenantId: 'test',
                referenceId: referenceId,
            },
            url: 'AppraisalReviewDates',
        }
        postData(item)
    })

    const { mutate: postData } = useMutation(postItem, {
        onSuccess: () => {
            queryClient.invalidateQueries('reviewDates')
            reset()
            setIsReviewDateModalOpen(false)
            loadData()
            setSendLoading(false)
            message.success('Email notifications sent successfully')
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

        const employeePerformanceData = employeeMailAndName?.map((item: any) => ({
            employeeId: item.employeeId,
            Status: 'Pending',
            referenceId: referenceId,
            scheduleDateId: record.id,
        }))

        const item2 = {
            data: employeePerformanceData,
            url: 'EmployeePerfDetails',
        }
        console.log('EmployeePerfDetails: ', item2)
     
        console.log('email sent: ', item)
        setIsEmailSent(true)
        postData(item)
    }
    // find the appraisal type id
    const findAppraisal = allAppraisals?.data?.find((item: any) => {
        if(item.id === parseInt(selectedAppraisalType)) {
            return item?.numReview
        }
    })

    //   add data to gridData
    for (let i = 0; i < findAppraisal?.numReview; i++) {
        gridData.push({
            description: `Review ${i+1}`,
            reviewDate: "",
            endDate: "",
            checkUpDate: "",
            startDate: "",
        });
    }



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
                            // boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
                        }}
                        className="border border-gray-400"
                    >
                        {/* <Space className="justify-content-end align-items-end d-flex mb-2" >
                            <Button
                                onClick={showReviewDateModal}
                                className="btn btn-light-primary me-3 justify-content-center align-items-center d-flex"
                                type="primary" icon={<PlusOutlined style={{ fontSize: '16px' }} rev={''} />} size={'large'} >
                                Add Schedule Date
                            </Button>
                        </Space> */}
                        {
                            loading ? <Skeleton active /> :
                                <Table columns={reviewDatesColumn} dataSource={gridData} />
                        }
                    </div>
                </Spin>
            </div>
            <Modal
                title='Add a schedule date'
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
                                className='form-control form-control-solid'
                            />
                        </div>
                        <div className='col-4 mb-7'>
                            <label htmlFor='exampleFormControlInput1' className='form-label'>Check Up Date</label>
                            <input
                                {...register("checkUpDate")}
                                min={moment().format('YYYY-MM-DD')}
                                type='date'
                                className='form-control form-control-solid'
                            />
                        </div>
                        <div className='col-4 mb-7'>
                            <label htmlFor='exampleFormControlInput1' className='form-label'>End Date</label>
                            <input
                                {...register("endDate")}
                                min={moment().format('YYYY-MM-DD')}
                                type='date'
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

            {/* confirm notification roll out modal */}

            {/* <Modal
                title='Confirm Notifications Send'
                open={isNotificationModalOpen}
                onCancel={handleNotificationCancel}
                closable={true}
                footer={
                    <Space>
                        {
                            sendLoading ? <></> :
                                <>
                                    <Button onClick={handleNotificationCancel}
                                        type='primary'
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        className='btn btn-danger btn-sm w'>
                                        Cancel
                                    </Button>
                                    <Popconfirm

                                        title="Confirm notifcations send"
                                        description={`This action will roll out email notifications to all employees\n in the selected employee group.`}
                                        onConfirm={handleConfirmNotificationSend}
                                        onCancel={handleNotificationCancel}
                                        okText="Send"
                                        cancelText="Cancel"
                                    >
                                        <Button
                                            type='primary'
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}
                                            className='btn btn-success btn-sm w'>
                                            Send Notifications
                                        </Button>
                                    </Popconfirm>
                                </>
                        }
                    </Space>
                }
            >
                <Divider />
                <Spin spinning={sendLoading}>
                    <div className='row'>
                        <div className='col-12'>
                            <p className='fw-bold text-gray-800 d-block fs-3'>{`This action will roll out email notifications to all employees\n in the selected employee group.`}</p>
                        </div>
                    </div>
                </Spin>
            </Modal> */}
        </>
    )
}

export { ReviewDateComponent }

