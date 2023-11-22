import { PrinterOutlined } from '@ant-design/icons'
import { Button, Modal, Skeleton, Space, Table, Tag, message } from "antd"
import { useEffect, useState } from "react"
import { set, useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams } from "react-router-dom"
import { Api_Endpoint, fetchDocument, updateItem } from "../../../../services/ApiCalls"
import { getFieldName, getSupervisorData } from "../ComponentsFactory"
import { AppraisalObjectivesComponent } from "../appraisalForms/AppraisalObjectivesComponent"
import { AppraisalPrintHeader, PrintComponent } from "../appraisalForms/AppraisalPdfPrintView"
import { AppraisalFormContent, AppraisalFormHeader } from "../appraisalForms/FormTemplateComponent"
import axios from 'axios'
import { useAuth } from '../../../auth'
import { sendEmail } from '../../../../services/CommonService'
import { ActualMasterPage } from '../../entry/ActualMasterPage'

const NotificationsComponent = ({ loading, employeeWhoSubmitted, location, tag }: any) => {
// const NotificationsComponent = ({ loading, filter, filteredByObjectives }: any) => {

    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const[approvedStatus, setApprovedStatus] = useState<any>(false)
    const [employeeData, setEmployeeData] = useState<any>({})
    const [objectivesData, setObjectivesData] = useState<any>([])
    const [componentData, setComponentData] = useState<any>()
    const [commentModalOpen, setCommentModalOpen] = useState(false)
    const [comment, setComment] = useState('')
    const { reset, register, handleSubmit } = useForm()
    const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 10000 })
    const [parametersData, setParametersData] = useState<any>([])
    const [isObjectiveDeclined, setIsObjectiveDeclined] = useState(false)
    const [showPritntPreview, setShowPrintPreview] = useState(false)
    const { currentUser } = useAuth()

    const param: any = useParams();
    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments`), { cacheTime: 10000 })
    const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 10000 })
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })
    const { data: allObjectiveDeliverables } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 10000 })
    const { data: allParameters } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 10000 })
    const { data: allAppraisalobjective} = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 10000 })
    const { data: allApraisalActual } = useQuery('apraisalActuals', () => fetchDocument('ApraisalActuals'), { cacheTime: 10000 })

    const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
    const lineManager = getSupervisorData({ employeeId: employeeData?.id, allEmployees, allOrganograms })


    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active"
    })
    const convertToArray = checkActive?.referenceId.split("-")
    
    const appraisalId = convertToArray?.[1]

    const activeParameterName = allParameters?.data?.filter((section: any) => 
         section.appraisalId?.toString() === appraisalId)

    const handleCommentModalCancel = () => {
        setCommentModalOpen(false)
        reset()
        setComment('')
    }

    const handlePrintPreviewModalCancel = () => {
        setShowPrintPreview(false)
    }

    const showPrintPreview = () => {
        setShowPrintPreview(true)
        handleCancel()
    }

    const [textareaHeight, setTextareaHeight] = useState('auto');

    const handleCommentChange = (event: any) => {
        event.preventDefault()
        setComment(event.target.value);
        const { name, value } = event.target;

        setEmployeeData(
            (prevState: any) => ({
                ...prevState,
                [name]: value
            }));
        adjustTextareaHeight();
    }

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

    const getOverallAchievement = (employeeId:any) => {
        const overAllWeight = activeParameterName?.map((param: any) => {
            const objectivesInParameter = allAppraisalobjective?.data.filter((obj:any) =>
            param?.id ===obj?.parameterId && 
            obj?.employeeId === employeeId?.toString() && 
            obj?.referenceId === checkActive?.referenceId)
    
            const objectiveWeights = objectivesInParameter?.map((objective:any) => {
                const deliverablesInObjective = allObjectiveDeliverables?.data.filter(
                    (deliverable:any) => deliverable?.objectiveId === objective?.id
                );
    
                const deliverableWeight = deliverablesInObjective?.map((deliverable:any) => {
                    const actual = allApraisalActual?.data?.find((actual:any) => actual?.deliverableId === deliverable?.id)
    
                    const actualValue = actual?.actual === null || actual?.actual === undefined ? 0 : 
                            Math.round((actual?.actual/deliverable?.target)*100)
                        return actualValue * (deliverable?.subWeight/100)
    
                }).reduce((a: any, b: any) => a + b, 0).toFixed(2)
                    const finalWeight = deliverableWeight > 120 ? 120 : deliverableWeight;
                return  finalWeight * (objective?.weight/100)
            })?.reduce((a: any, b: any) => a + b, 0).toFixed(2)
            return parseFloat(objectiveWeights)
        })
        const totalAchievement = overAllWeight?.reduce((a: any, b: any) => a + b, 0).toFixed(2);
        return totalAchievement
    }

    const handleCommentModalOk = () => {
        OnSubmit("rejected")
        sendEmail(employeeData, `Your Objectives have been rejected.`)
        reset()
        setComment('')
    }

    const handlePrintPreviewModalOk = () => {
        setShowPrintPreview(false)
    }

    const showObjectivesView = (record: any) => {
        setIsModalOpen(true)
        const employee = allEmployees?.data?.find((item: any) => (item.id) === record?.id)
        const objectiveByEMployee = allAppraisalobjective?.data?.filter((item: any) => (item.employeeId) === record?.id.toString())
        setEmployeeData(employee)
        setObjectivesData(objectiveByEMployee)
    }

    const getOnlyparameters = parameters?.data?.filter((item: any) => {
        return item.appraisalId === 12
      }
    ) 


    const OnSubmit =(statusText:any)  => {
            const parameterIds = getOnlyparameters?.map((item: any) => {
              return item.id
            })
            const data ={
              parameterIds: parameterIds,
              employeeId : employeeData?.id?.toString(),
              statusText: statusText
            }
      
            console.log("data",data)
            axios.post(`${Api_Endpoint}/Parameters/UpdateStatus`, data)
            .then(response => {
                if(statusText === "approved"){
                    message.success(`You have ${statusText} ${employeeData?.firstName} ${employeeData?.surname}'s Objectives`)
                }
                else{
                    message.error(`You have ${statusText} ${employeeData?.firstName} ${employeeData?.surname}'s Objectives`)
                }

              setCommentModalOpen(false)
              queryClient.invalidateQueries('appraisalobjective')
              setIsModalOpen(false)
            //   setEmployeeData({})
            //   setObjectivesData([])
              console.log(response.data);
            })
            .catch(error => {
              console.error('Error:', error);
            });
          
      }

        const onObjectivesApproved = () => {
            OnSubmit("approved")
            sendEmail(employeeData, `Your Objectives have been approved`)
        }

        const onObjectivesRejected = () => {
            setCommentModalOpen(true)
        }

        const closeModal = () => {
            setIsModalOpen(false)
        }

        const acceptAmendment = () => {
            // OnSubmit("approved")
            message.success(`You have accepted ${employeeData?.firstName} ${employeeData?.surname}'s Amendment`)
            setIsModalOpen(false)
        }

    const loadData = () => {
        const parametersResponse = parameters?.data?.filter((item: any) => item?.appraisalId === 12)
        setParametersData(parametersResponse)
        const dataWithFullName = employeeWhoSubmitted?.map((item: any) => ({
            ...item,
            firstName: item?.firstName+ ' ' + item?.surname,
        
        }  ) )
        setComponentData(dataWithFullName)
    }

    useEffect(() => {
        loadData()
    }, [ parameters?.data, employeeData, employeeWhoSubmitted])

    const getEmployeeStatus = ((employeeId:any)=> {
           const allSubmittedObjectives = allAppraisalobjective?.data?.filter((item: any) => {
                return parseInt(item?.employeeId) === employeeId?.id && 
                item?.referenceId === checkActive?.referenceId
           })

           if (allSubmittedObjectives?.some((obj:any) => obj.status === "submitted")) {
                return  <Tag color="warning">Submitted</Tag>;
            } else if (allSubmittedObjectives?.some((obj:any) => obj.status === "rejected")) {
                return  <Tag color="error">Rejected</Tag>;
            }
            else if (allSubmittedObjectives?.some((obj:any) => obj.status === "approved")) {
                return <Tag color="success">Approved</Tag>;
            }
            else if (allSubmittedObjectives?.some((obj:any) => obj.status === "drafted")) {
                return <Tag color="warning">Drafted</Tag>;
            }
            // else if (allSubmittedObjectives?.some((obj:any) => obj.status === "amend")) {
            //     return <Tag color="warning">Submitted for Amendment</Tag>;
            // }
            else{
                return <Tag color="pink">Not Started</Tag>;
            }
    })    

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
            dataIndex: 'firstName',
        },
        {
            title: 'Approval Status',
            dataIndex: 'status',
            key:"id",
            render: (_:any, record:any) => {
                return getEmployeeStatus(record)
                // return <Tag color="error">Pending</Tag>
            }
        },
        {
            title: 'Overall Achievement',
            dataIndex: 'overallAchievement',
            render: (_:any, record:any) => {
                return getOverallAchievement(record?.id)
            }
        },
        {
            title:"Performance Rating",
            render: (_:any, record:any) => {
                const overallAchievement = getOverallAchievement(record?.id)
                if(overallAchievement >= 90){
                    return <Tag color="success">Excellent</Tag>
                }
                else if(overallAchievement >= 80 && overallAchievement < 90){
                    return <Tag color="purple">Very Good</Tag>
                }
                else if(overallAchievement >= 70 && overallAchievement < 80){
                    return <Tag color="purple">Good</Tag>
                }
                else if(overallAchievement >= 60 && overallAchievement < 70){
                    return <Tag color="warning">Satisfactory</Tag>
                }
                else if(overallAchievement >= 50 && overallAchievement < 60){
                    return <Tag color="warning">Unsatisfactory</Tag>
                }
                else if(overallAchievement < 50){
                    return <Tag color="error">Poor</Tag>
                }
                else{
                    return <Tag color="pink">Very Poor</Tag>
                }
            }
            // const performanceRating = overallAchievement < 50 ? 
            // <span className='badge fs-4 badge-light-danger fw-bolder'>Poor</span> :
            // overallAchievement >= 50 && overallAchievement < 60 ? 
            // <span className='badge fs-4 badge-light-warning fw-bolder'>Unsatisfactory</span> :
            // overallAchievement >= 60 && overallAchievement < 70? 
            // <span className='badge fs-4 badge-light-warning fw-bolder'>Satisfactory</span>:
            // overallAchievement >= 70 && overallAchievement < 80 ? 
            // <span className='badge fs-4 badge-light-info fw-bolder'>Good</span>:
            // overallAchievement >= 80 && overallAchievement < 90 ?
            // <span className='badge fs-4 badge-light-info fw-bolder'>Very Good</span>:
            // overallAchievement >= 90 ?
            // <span className='badge fs-4 badge-light-success fw-bolder'>Excellent</span>: 
            //  "N/A"
        },
        {
            title: 'Action',
            fixed: 'right',
            render: (_: any, record: any) => (

            //    console.log( getEmployeeStatus(record).props.children)
               <button 
                    className='btn btn-light-success btn-sm'
                    // disabled={getEmployeeStatus(record).props.children === "Amend" || 
                    // getEmployeeStatus(record).props.children === "Submitted for Amendment"} 
                    onClick={() => showObjectivesView(record)}
                >
                    View Detail
               </button>
                // <a onClick={() => showObjectivesView(record)} className='btn btn-light-info btn-sm'>
                //     View Objectives
                // </a>

            ),
        },
    ]

    // if(location==="View Details"){
    //     columns.splice(3, 1)
    // }

    const { mutate: updateData } = useMutation(updateItem, {
        onSuccess: () => {
            queryClient.invalidateQueries('appraisalobjective')
            message.success(`Changes saved successfully`)
            reset()
            loadData()
            setEmployeeData({})
            setObjectivesData([])
            setCommentModalOpen(false)
            setIsModalOpen(false)
            setComment('')
            setIsObjectiveDeclined(false)
        },
        onError: (error) => {
            console.log('error: ', error)
            message.error(`Failed to save changes`)
        }
    })

    // const title = "final"

    return (
        <>
            {
            loading ? <Skeleton active /> :
                <Table
                    columns={columns}
                    dataSource={componentData}
                />
            }

            <Modal
                open={isModalOpen}
                width={
                    checkActive?.tag?.trim() === "actual" ||
                        checkActive?.tag?.trim() === "final" ? 1200:
                    1000}
                onCancel={handleCancel}
                closable={true}
                footer={
                    // title === "View Details" ? 
                    // null:
                    // <Space className="mt-7">
                    //     <button type='button' className='btn btn-danger btn-sm' onClick={onObjectivesRejected}>
                    //         Decline
                    //     </button>
                    //     <button type='button' className='btn btn-success  btn-sm' onClick={onObjectivesApproved}>
                    //         Approve
                    //     </button>
                    // </Space>
                    tag === "final"?
                    <Space className="mt-7">
                        <button type='button' className='btn btn-danger btn-sm' onClick={closeModal}>
                            Cancel
                        </button>
                        <button type='button' className='btn btn-success  btn-sm' onClick={acceptAmendment}>
                            Accept
                        </button>
                    </Space>:
                    location==="View Details"? null:
                    
                    <Space className="mt-7">
                        <button type='button' className='btn btn-danger btn-sm' onClick={onObjectivesRejected}>
                            Decline
                        </button>
                        <button type='button' className='btn btn-success  btn-sm' onClick={onObjectivesApproved}>
                            Approve
                        </button>
                    </Space>
                }>
                <div className="py-9 px-9">
                    <AppraisalFormHeader
                        employeeData={employeeData}
                        department={department}
                        lineManager={lineManager}
                        print={
                            <Button type="link" className="me-3" onClick={showPrintPreview} icon={<PrinterOutlined rev={'print'} className="fs-1" />} />
                        }
                    />

                    {
                        checkActive?.tag?.trim() === "actual" ||
                        checkActive?.tag?.trim() === "final" ? 

                        <ActualMasterPage title="hr" employeeId={employeeData?.id} />:

                        <AppraisalFormContent component={AppraisalObjectivesComponent} employeeId={employeeData?.id} parametersData={parametersData} />
                    }
                </div>
            </Modal>
            {/* comment modal */}
            <Modal
                title={`Add a comment for declining`}
                open={commentModalOpen}
                width={800}
                onCancel={handleCommentModalCancel}
                closable={true}
                footer={
                    <>
                        <Button
                            key='submit'
                            type='primary'
                            htmlType='submit'
                            onClick={handleCommentModalOk}
                            disabled={comment === '' || comment.length < 15}
                        >
                            Save & Decline
                        </Button>,
                    </>
                }>
                <form>
                    <textarea
                        {...register("comment")}
                        placeholder="Enter your comment here"
                        id="resizable-textarea"
                        className="form-control mb-0 mt-7 mb-7 py-4 px-4 border border-gray-400"
                        onChange={handleCommentChange}
                        style={{ height: textareaHeight }}
                    />
                </form>

            </Modal>
            <Modal
                title={``}
                open={showPritntPreview}
                width={1000}
                onCancel={handlePrintPreviewModalCancel}
                closable={true}
                okText="Print"
                onOk={handlePrintPreviewModalOk}
            >
                <AppraisalPrintHeader
                    employeeData={employeeData}
                />
                <PrintComponent employeeData={employeeData} />
            </Modal>
        </>
    )

}

export { NotificationsComponent }


