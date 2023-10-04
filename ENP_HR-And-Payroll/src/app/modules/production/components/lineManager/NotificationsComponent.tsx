import { PrinterOutlined } from '@ant-design/icons'
import { Button, Modal, Skeleton, Space, Table, Tag, message } from "antd"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useParams } from "react-router-dom"
import { fetchDocument, updateItem } from "../../../../services/ApiCalls"
import { getFieldName, getSupervisorData } from "../ComponentsFactory"
import { AppraisalObjectivesComponent } from "../appraisalForms/AppraisalObjectivesComponent"
import { AppraisalPrintHeader, PrintComponent } from "../appraisalForms/AppraisalPdfPrintView"
import { AppraisalFormContent, AppraisalFormHeader } from "../appraisalForms/FormTemplateComponent"

const NotificationsComponent = ({ loading, filter, employeeWhoSubmitted }: any) => {
// const NotificationsComponent = ({ loading, filter, filteredByObjectives }: any) => {

    const { data: allSubmittedObjectives } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [employeeData, setEmployeeData] = useState<any>({})
    const [objectivesData, setObjectivesData] = useState<any>([])
    const [componentData, setComponentData] = useState<any>()
    const [commentModalOpen, setCommentModalOpen] = useState(false)
    const [comment, setComment] = useState('')
    const { reset, register, handleSubmit } = useForm()
    const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })
    const [parametersData, setParametersData] = useState<any>([])
    const [isObjectiveDeclined, setIsObjectiveDeclined] = useState(false)
    const [showPritntPreview, setShowPrintPreview] = useState(false)


    const param: any = useParams();
    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments`), { cacheTime: 5000 })
    const { data: appraisalobjective } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const { data: appraisaldeliverable } = useQuery('appraisaldeliverable', () => fetchDocument(`appraisaldeliverable`), { cacheTime: 5000 })
    const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`Appraisals`), { cacheTime: 5000 })

    const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
    const lineManager = getSupervisorData({ employeeId: employeeData?.id, allEmployees, allOrganograms })

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


    const handleCommentModalOk = () => {
        const item = {
            data: {
                ...objectivesData,
                status: 'Rejected',
                comment: comment
            },
            url: 'appraisalobjective'
        }
        setIsObjectiveDeclined(true)
        updateData(item)
    }

    const handlePrintPreviewModalOk = () => {
        //todo print of the objectives 
        setShowPrintPreview(false)
    }

    const showObjectivesView = (record: any) => {
        setIsModalOpen(true)
        const employee = allEmployees?.data?.find((item: any) => (item.id) === record?.id)
        const objectiveByEMployee = appraisalobjective?.data?.filter((item: any) => (item.employeeId) === record?.id.toString())
        console.log('employee: ', employee)
        console.log('record: ', record)
        console.log('objectiveByEMployee: ', objectiveByEMployee)
        setEmployeeData(employee)
        setObjectivesData(objectiveByEMployee)
    }

    const onObjectivesApproved = () => {
        const item = {
            data: {
                ...objectivesData,
                status: 'Approved'
            },
            url: 'appraisalobjective'
        }
        updateData(item)
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
    }, [ parameters?.data, employeeData])


    const onObjectivesRejected = () => {
        setCommentModalOpen(true)
    }

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
            // render: (record: any) => {
                
            //     return getEmployeeDetails(record?.id)
            // }
        },
        {
            title: 'Approval Status',
            dataIndex: 'status',
            render: () => {
                return <Tag color="error">Pending</Tag>
            }
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
                width={1000}
                onCancel={handleCancel}
                closable={true}
                footer={
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
                    <AppraisalFormContent component={AppraisalObjectivesComponent} employeeId={employeeData?.id} parametersData={parametersData} />
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


