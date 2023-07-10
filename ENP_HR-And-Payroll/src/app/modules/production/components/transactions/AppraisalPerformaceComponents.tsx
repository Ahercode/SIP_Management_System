import { Button, Modal, Skeleton, Space, Table, message } from "antd"
import moment from "moment"
import { getTimeLeft } from "../ComponentsFactory"
import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { deleteItem, fetchDocument, postItem, updateItem } from "../../../../services/ApiCalls"
import { register } from "../../../auth/core/_requests"
import { PlusOutlined } from "@ant-design/icons"
import { useForm } from "react-hook-form"

const ReviewDateComponent = ({ referenceId, selectedAppraisalType, handleNotificationSend }: any) => {
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 5000 })
    const [gridData, setGridData] = useState([])
    const [loading, setLoading] = useState(false)
    const [isReviewDateModalOpen, setIsReviewDateModalOpen] = useState(false)
    const { reset, register, handleSubmit } = useForm()
    const queryClient = useQueryClient()
    const [isEmailSent, setIsEmailSent] = useState<any>(false)
    const [description, setDescription] = useState<any>('')



    const showReviewDateModal = () => {
        setIsReviewDateModalOpen(true)
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
            //find objective with matching referenceId from all objectives
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [
        allReviewdates?.data, referenceId
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
            render: (text: any) => <>{!text ? '' : moment(text).format('DD/MM/YYYY')}</>
        },
        {
            title: 'Check Up Date',
            dataIndex: 'checkUpDate',
            render: (text: any) => <>{!text ? '' : moment(text).format('DD/MM/YYYY')}</>
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            render: (text: any) => <>{!text ? '' : moment(text).format('DD/MM/YYYY')}</>
        },
        {
            title: 'Count down',
            dataIndex: 'reviewDate',
            render: (text: any) => getTimeLeft(text),
        },
        {
            title: 'Action',
            render: (text: any, record: any) => (
                <Space>
                    <a className='text-primary me-2' onClick={handleNotificationSend}>
                        Send Notifications
                    </a>
                    <a className='text-danger' onClick={() => handleDeleteReviewDate(record)}>
                        Delete
                    </a>
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
            isEmailSent && message.success('Email notifications sent successfully')
            setIsEmailSent(false)
        },
        onError: (error: any) => {
            console.log('post error: ', error)
        }
    })

    return (
        <>
            <div className='col-9 mb-7'>
                <div className='d-flex justify-content-between'>
                    <span className='form-label'>Schedule Dates</span>
                </div>
                <div
                    style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '5px',
                        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
                    }}
                    className="border border-gray-400"
                >
                    <Space className="justify-content-end align-items-end d-flex mb-2" >
                        <Button
                            onClick={showReviewDateModal}
                            className="btn btn-light-primary me-3 justify-content-center align-items-center d-flex"
                            type="primary" icon={<PlusOutlined style={{ fontSize: '16px' }} rev={''} />} size={'large'} >
                            Add Schedule Date
                        </Button>
                    </Space>
                    {
                        loading ? <Skeleton active /> :
                            <Table columns={reviewDatesColumn} dataSource={gridData} />
                    }
                </div>
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
                            type="text"
                            className="form-control form-control-solid" />
                    </div>
                </form>
            </Modal>
        </>
    )
}


const AppraisalObjective = ({ referenceId }: any) => {

    const [objValue, setObjValue] = useState<any>('');
    const [textareaHeight, setTextareaHeight] = useState('auto');
    const { data: allObjectives } = useQuery('appraisalperfobjectives', () => fetchDocument(`appraisalperfobjectives/tenant/test`), { cacheTime: 5000 })
    const { reset, register, handleSubmit } = useForm()
    const queryClient = useQueryClient()
    const [currentObjective, setCurrentObjective] = useState<any>([])
    const [objectiveData, setObjectiveData] = useState<any>([])

    const handleChange = (event: any) => {
        event.preventDefault()
        setObjValue(event.target.value);
        const { name, value } = event.target;
        setObjectiveData(
            (prevState: any) => ({
                ...prevState,
                [name]: value
            }));
        adjustTextareaHeight();
    };


    const adjustTextareaHeight = () => {
        const textarea: any = document.getElementById('resizable-textarea');
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;

        // Limit height to 10 lines
        if (textarea.scrollHeight > 10 * parseFloat(getComputedStyle(textarea).lineHeight)) {
            textarea.style.overflowY = 'scroll';
            textarea.style.height = `${10 * parseFloat(getComputedStyle(textarea).lineHeight)}px`;
        } else {
            textarea.style.overflowY = 'hidden';
        }

        setTextareaHeight(`${textarea.style.height}`);
    };

    const loadData = async () => {
        try {
            const response = allObjectives?.data?.filter((item: any) => {
                return item.referenceId === referenceId
            })
            setObjectiveData(response[0])

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadData()
    }, [
        allObjectives?.data, referenceId
    ])




    const handleObjectiveSave = handleSubmit(async (values) => {
        if (objValue === '') {
            message.error('Please enter objective description')
            return
        }

        // check if current objective exist allObjectives using referenceId
        const currentObjective = allObjectives?.data.find((item: any) => item.referenceId === referenceId)
        if (currentObjective) {
            const item = {
                data: objectiveData,
                url: 'appraisalperfobjectives'
            }
            console.log('objItem: ', item)
            updateData(item)
            return
        } else {
            const item = {
                data: {
                    description: values.description,
                    tenantId: 'test',
                    referenceId: referenceId,
                },
                url: 'appraisalperfobjectives',
            }
            console.log('objItem: ', item)
            postData(item)
        }
    })

    const { mutate: postData } = useMutation(postItem, {
        onSuccess: () => {
            reset()
            queryClient.invalidateQueries('appraisalperfobjectives')
            loadData()
            message.success('Appraisal objective saved successfully')

        },
        onError: (error: any) => {
            console.log('post error: ', error)
        }
    })


    const { mutate: updateData } = useMutation(updateItem, {
        onSuccess: () => {
            reset()
            loadData()
            queryClient.invalidateQueries('appraisalperfobjectives')
            message.success('Appraisal objective updated successfully')
        },
        onError: (error) => {
            console.log('error: ', error)
        }
    })

    return (
        <>
            <form onSubmit={handleObjectiveSave}>
                <span className='form-label' >Objectives</span>
                <textarea
                    {...register("description")}
                    id="resizable-textarea"
                    className="form-control mb-0 mt-2"
                    defaultValue={objectiveData ? objectiveData?.description : ''}
                    onChange={handleChange}
                    style={{ height: textareaHeight }}
                />
                <a className='justify-content-end align-items-end d-flex btn text-primary' onClick={() => handleObjectiveSave()}>Save Objective</a>
            </form>
        </>
    )
}


export { ReviewDateComponent, AppraisalObjective, getTimeLeft }
