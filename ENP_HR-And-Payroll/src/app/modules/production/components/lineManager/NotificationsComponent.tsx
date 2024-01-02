import { Button, Modal, Skeleton, Space, Table, Tag, message } from 'antd'
import axios from 'axios'
import Papa from 'papaparse'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { Api_Endpoint, fetchDocument, updateItem } from '../../../../services/ApiCalls'
import { getOverallAchievement, getOverallAchievementForSame, sendEmail } from '../../../../services/CommonService'
import { useAuth } from '../../../auth'
import { ActualMasterPage } from '../../entry/ActualMasterPage'
import { getFieldName, getSupervisorData } from '../ComponentsFactory'
import { AppraisalPrintHeader, PrintComponent } from '../appraisalForms/AppraisalPdfPrintView'
import { AppraisalFormHeader } from '../appraisalForms/FormTemplateComponent'

const NotificationsComponent = ({loading, employeeWhoSubmitted, referenceId, location, tag}: any) => {
  // const NotificationsComponent = ({ loading, filter, filteredByObjectives }: any) => {

  const {data: allEmployees} = useQuery('employees', () => fetchDocument(`employees`), {
    cacheTime: 10000,
  })

  const { data: allAppraisalGrades, isLoading } = useQuery('appraisalGrades', () => fetchDocument(`AppraisalGrades`), { cacheTime: 10000 })
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [approvedStatus, setApprovedStatus] = useState<any>(false)
  const [employeeData, setEmployeeData] = useState<any>({})
  const [objectivesData, setObjectivesData] = useState<any>([])
  const [componentData, setComponentData] = useState<any>()
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [comment, setComment] = useState('')
  const [selectedReference, setSelectedReference] = useState<any>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<any>("all")
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [selectedGrade, setSelectedGrade] = useState<any>(null)
  const {reset, register, handleSubmit} = useForm()
  const {data: parameters} = useQuery('parameters', () => fetchDocument(`parameters`), {
    cacheTime: 10000,
  })
  const [parametersData, setParametersData] = useState<any>([])
  const [isObjectiveDeclined, setIsObjectiveDeclined] = useState(false)
  const [showPritntPreview, setShowPrintPreview] = useState(false)
  const {currentUser} = useAuth()
  const tenantId = localStorage.getItem('tenant')
  const currentLocation = window.location.pathname.split('/')[4]

  const param: any = useParams()
  const {data: allDepartments} = useQuery('departments', () => fetchDocument(`Departments`), {
    cacheTime: 10000,
  })
  const {data: allOrganograms} = useQuery('organograms', () => fetchDocument(`organograms`), {
    cacheTime: 10000,
  })
  const {data: allReviewdates} = useQuery(
    'reviewDates',
    () => fetchDocument(`AppraisalReviewDates`),
    {cacheTime: 10000}
  )
  const {data: allObjectiveDeliverables} = useQuery(
    'appraisalDeliverables',
    () => fetchDocument('AppraisalDeliverable'),
    {cacheTime: 10000}
  )
  const {data: allParameters} = useQuery('parameters', () => fetchDocument(`Parameters`), {
    cacheTime: 10000,
  })
  const {data: allAppraisals} = useQuery('appraisals', () => fetchDocument('appraisals'), {
    cacheTime: 10000,
  })
  const {data: allPaygroups} = useQuery(
    'paygroups',
    () => fetchDocument(`Paygroups/tenant/${tenantId}`),
    {cacheTime: 10000}
  )
  const {data: allPeriods} = useQuery('periods', () => fetchDocument(`periods`), {cacheTime: 10000})


  const {data: allAppraisalobjective} = useQuery(
    'appraisalObjectives',
    () => fetchDocument('AppraisalObjective'),
    {cacheTime: 10000}
  )
  const {data: allApraisalActual} = useQuery(
    'apraisalActuals',
    () => fetchDocument('ApraisalActuals'),
    {cacheTime: 10000}
  )
  const {data: allAppraTranItems, isLoading: itemsLoading} = useQuery(
    'appraisalPerItems',
    () => fetchDocument(`AppraisalPerItems`),
    {cacheTime: 10000}
  )
  const {data: allAppraisalsPerfTrans, isLoading: perLoading} = useQuery(
    'appraisalPerfTransactions',
    () => fetchDocument(`AppraisalPerfTransactions/tenant/${tenantId}`),
    {cacheTime: 10000}
  )

  const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
  const lineManager = getSupervisorData({
    employeeId: employeeData?.id,
    allEmployees,
    allOrganograms,
  })
  
  const reference = allAppraisalsPerfTrans?.data?.find((item: any) => {
    return item?.id === parseInt(selectedReference)
  }
  )

  console.log("reference", reference)

  const newReferenceId = currentLocation === 'appraisal-performance'? reference?.referenceId: referenceId

  const checkActive = allReviewdates?.data?.find((item: any) => {
    return item?.isActive?.trim() === 'active' && item?.referenceId === newReferenceId
  })

  const activeReference = allAppraisalsPerfTrans?.data?.filter((item: any) => {
    return item.status?.trim() === 'active'
  })


  const convertToArray = checkActive?.referenceId.split('-')

  const appraisalId = convertToArray?.[1]

  const activeParameterName = allParameters?.data?.filter(
    (item: any) => item.appraisalId?.toString() === appraisalId
  )
  const sameParameter = allParameters?.data?.filter((item: any) => item?.tag?.trim() === 'same')

  const appraisalTranItem = allAppraisalsPerfTrans?.data?.find((item: any) => {
    return item.id === parseInt(selectedReference)
  })

  const allAppraisalTranItems = allAppraTranItems?.data?.filter((item: any) => {
    return item.appraisalPerfTranId === parseInt(selectedReference)
  })

  // get all employees from appraisalTranItem
  const emplyeesByPaygroup: any = allEmployees?.data?.filter((item: any) => {
    return item.paygroupId === parseInt(appraisalTranItem?.paygroupId)
  })

  const idSet = new Set(allAppraisalTranItems?.map((item: any) => parseInt(item.employeeId)))

  const employeesByDepartment = allEmployees?.data?.filter((item: any) => {
    return item.departmentId === parseInt(selectedDepartment)
  })

  const empData = selectedDepartment === 'all' ? allEmployees?.data : employeesByDepartment

  const employeesFromTransaction = empData?.filter((item: any) => {
    return idSet.has(item.id)
  })

  const getEmployeeStatus = (employeeId: any) => {
    const allSubmittedObjectives = allAppraisalobjective?.data?.filter((item: any) => {
      return (
        parseInt(item?.employeeId) === employeeId?.id &&
        item?.referenceId === checkActive?.referenceId
      )
    })

    if (allSubmittedObjectives?.some((obj: any) => obj?.status?.trim() === 'submitted')) {
      return <Tag color='warning'>Submitted</Tag>
    } else if (allSubmittedObjectives?.some((obj: any) => obj?.status?.trim() === 'rejected')) {
      return <Tag color='error'>Rejected</Tag>
    } else if (allSubmittedObjectives?.some((obj: any) => obj?.status?.trim() === 'approved')) {
      return <Tag color='success'>Approved</Tag>
    } else if (allSubmittedObjectives?.some((obj: any) => obj?.status?.trim() === 'drafted')) {
      return <Tag color='warning'>Drafted</Tag>
    } else {
      return <Tag color='pink'>Not Started</Tag>
    }
  }

  const dataWithFullName = employeesFromTransaction?.map((item: any) => ({
    ...item,
    firstName: item?.firstName + ' ' + item?.surname,
    rating: getEmployeeStatus(item)?.props?.children,
  }))

  console.log("dataWithFullName", dataWithFullName)

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

  const [textareaHeight, setTextareaHeight] = useState('auto')

  const handleCommentChange = (event: any) => {
    event.preventDefault()
    setComment(event.target.value)
    const {name, value} = event.target

    setEmployeeData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }))
    adjustTextareaHeight()
  }

  const adjustTextareaHeight = () => {
    const textarea: any = document.getElementById('resizable-textarea')
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`

    // Limit height to 10 lines
    if (textarea.scrollHeight > 10 * parseFloat(getComputedStyle(textarea).lineHeight)) {
      textarea.style.overflowY = 'scroll'
      textarea.style.height = `${10 * parseFloat(getComputedStyle(textarea).lineHeight)}px`
    } else {
      textarea.style.overflowY = 'hidden'
    }

    setTextareaHeight(`${textarea.style.height}`)
  }

  
  const submitRejection = () => {
    OnSubmit('rejected')
    sendEmail(
      {
        record: employeeData,
        body: `Your Objectives have been rejected. with the following comments: \n ${comment}`,
        subject: `Your Objectives have been rejected`,
      }
    )
    reset()
    setComment('')
  }

  const handlePrintPreviewModalOk = () => {
    setShowPrintPreview(false)
  }

  const showObjectivesView = (record: any) => {
    setIsModalOpen(true)
    const employee = allEmployees?.data?.find((item: any) => item.id === record?.id)
    const objectiveByEMployee = allAppraisalobjective?.data?.filter(
      (item: any) => item.employeeId === record?.id.toString()
    )
    setEmployeeData(employee)
    setObjectivesData(objectiveByEMployee)
  }

  const parametersToChangeStatus = allParameters?.data?.filter((item: any) => {
    return item.appraisalId?.toString() === appraisalId
  })

  const OnSubmit = (statusText: any) => {
    const parameterIds = parametersToChangeStatus?.map((item: any) => {
      return item.id
    })
    const data = {
      parameterIds: parameterIds,
      employeeId: employeeData?.id?.toString(),
      statusText: statusText,
    }

    console.log('data', data)
    axios
      .post(`${Api_Endpoint}/Parameters/UpdateStatus`, data)
      .then((response) => {
        if (statusText === 'approved') {
          message.success(
            `You have ${statusText} ${employeeData?.firstName} ${employeeData?.surname}'s Objectives`
          )
        } else {
          message.error(
            `Failed to approved ${employeeData?.firstName} ${employeeData?.surname}'s Objectives`
          )
        }

        setCommentModalOpen(false)
        queryClient.invalidateQueries('appraisalobjective')
        setIsModalOpen(false)
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  const onObjectivesApproved = () => {
    OnSubmit('approved')
    sendEmail({
      record: employeeData, 
      body:`Your Objectives have been approved`,
      subject: `Your Objectives have been approved`,
    })
  }

  const onObjectivesRejected = () => {
    setCommentModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const acceptAmendment = () => {
    message.success(
      `You have accepted ${employeeData?.firstName} ${employeeData?.surname}'s Self Evaluation`
    )
    setIsModalOpen(false)
  }

  const loadData = () => {
    const parametersResponse = parameters?.data?.filter(
      (item: any) => item?.appraisalId === appraisalId || item?.tag?.trim() === 'same'
    )
    setParametersData(parametersResponse)
    const dataWithFullName = employeeWhoSubmitted?.map((item: any) => ({
      ...item,
      firstName: item?.firstName + ' ' + item?.surname,
    }))
    setComponentData(dataWithFullName)
  }

  useEffect(() => {
    loadData()
  }, [parameters?.data, employeeData, employeeWhoSubmitted])

  

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
      render: (_: any, record: any) => {
        return getEmployeeStatus(record)
      },
    },
    {
      title: 'Overall Achievement',
      dataIndex: 'overallAchievement',
      render: (_: any, record: any) => {
        return (parseFloat(
          getOverallAchievement({
            parameterData: activeParameterName,
            objectiveData: allAppraisalobjective?.data,
            deliverableData: allObjectiveDeliverables?.data,
            actualData: allApraisalActual?.data,
            employeeId: record?.id,
            referenceId: checkActive?.referenceId,
          })
        ) + parseFloat(
          getOverallAchievementForSame({
            parameterData: sameParameter,
            objectiveData: allAppraisalobjective?.data,
            deliverableData: allObjectiveDeliverables?.data,
            actualData: allApraisalActual?.data,
            employeeId: record?.id,
            referenceId: checkActive?.referenceId,
          })
        ))?.toFixed(2)
      },
    },
    {
      title: 'Performance Rating',
      render: (_: any, record: any) => {
        const overallAchievement = parseFloat(
          getOverallAchievement({
            parameterData: activeParameterName,
            objectiveData: allAppraisalobjective?.data,
            deliverableData: allObjectiveDeliverables?.data,
            actualData: allApraisalActual?.data,
            employeeId: record?.id,
            referenceId: referenceId,
          })) + parseFloat(
            getOverallAchievementForSame({
              parameterData: sameParameter,
              objectiveData: allAppraisalobjective?.data,
              deliverableData: allObjectiveDeliverables?.data,
              actualData: allApraisalActual?.data,
              employeeId: record?.id,
              referenceId: referenceId,
            })
          )
        if (overallAchievement >= 90) {
          return <Tag color='success'>Excellent</Tag>
        } else if (overallAchievement >= 80 && overallAchievement < 90) {
          return <Tag color='purple'>Very Good</Tag>
        } else if (overallAchievement >= 70 && overallAchievement < 80) {
          return <Tag color='purple'>Good</Tag>
        } else if (overallAchievement >= 60 && overallAchievement < 70) {
          return <Tag color='warning'>Satisfactory</Tag>
        } else if (overallAchievement >= 50 && overallAchievement < 60) {
          return <Tag color='warning'>Unsatisfactory</Tag>
        } else if (overallAchievement < 50) {
          return <Tag color='error'>Poor</Tag>
        } else {
          return <Tag color='pink'>Very Poor</Tag>
        }
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      render: (_: any, record: any) => (
        <button className='btn btn-light-success btn-sm' onClick={() => showObjectivesView(record)}>
          View Detail
        </button>
      ),
    },
  ]

  const {mutate: updateData} = useMutation(updateItem, {
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
    },
  })

  const newData = componentData?.map((item: any) => ({
    ...item,
    firstName: item?.firstName,
    surname: item?.surname,
    ApprovalStatus: getEmployeeStatus(item)?.props?.children,
    OverallAchievement: getOverallAchievement(item?.id),
    PerformanceRating:
      getOverallAchievement(item?.id) >= 90
        ? 'Excellent'
        : getOverallAchievement(item?.id) >= 80 && getOverallAchievement(item?.id) < 90
        ? 'Very Good'
        : getOverallAchievement(item?.id) >= 70 && getOverallAchievement(item?.id) < 80
        ? 'Good'
        : getOverallAchievement(item?.id) >= 60 && getOverallAchievement(item?.id) < 70
        ? 'Satisfactory'
        : getOverallAchievement(item?.id) >= 50 && getOverallAchievement(item?.id) < 60
        ? 'Unsatisfactory'
        : getOverallAchievement(item?.id) < 50
        ? 'Poor'
        : ' Very Poor',
  }))

  const convertToCSSV = (data: any) => {
    const csv = Papa.unparse(data, {
      delimiter: ',',
      newline: '\n',
      quoteChar: '"',
      escapeChar: '"',
      header: true,
      skipEmptyLines: false,
    })

    return csv
  }

  function exportToCSV(data: any) {
    const csvData = convertToCSSV(data)

    const blob = new Blob([csvData], {type: 'text/csv'})
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'appraisalResults.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const columnsToKeep = [
    'firstName',
    'surname',
    'ApprovalStatus',
    'OverallAchievement',
    'PerformanceRating',
  ]
  const filteredData = newData?.map((item: any) => {
    const filteredItem: any = {}
    columnsToKeep?.forEach((column: any) => {
      filteredItem[column] = item[column]
    })
    return filteredItem
  })

  const handlePrint = () => {
    exportToCSV(filteredData)
  }

  return (
    <>
      <div style={{gap: "15px"}} className={`d-flex ${currentLocation === 'appraisal-performance'? "justify-content-between": "justify-content-end"} align-items-center mb-4`}>
        {
          currentLocation === 'appraisal-performance'?
          <>
          <div className='mb-7'>
              <label htmlFor='exampleFormControlInput1' className=' form-label'>
                Reference{' '}
              </label>
              <select
                value={selectedReference}
                onChange={(e) => setSelectedReference(e.target.value)}
                className='form-select form-select-solid'
                aria-label='Select example'
              >
                <option value='select reference'>Select reference</option>
                {activeReference?.map((item: any) => (
                  <option value={item.id}>
                    {getFieldName(item?.paygroupId, allPaygroups?.data)} -{' '}
                    {getFieldName(item?.appraisalTypeId, allAppraisals?.data)} -{' '}
                    {getFieldName(item?.startPeriod, allPeriods?.data)} -{' '}
                    {getFieldName(item?.endPeriod, allPeriods?.data)}
                  </option>
                ))}
              </select>
            </div>
            <div className=' mb-7'>
              <label htmlFor='exampleFormControlInput1' className=' form-label'>
                Department{' '}
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className='form-select form-select-solid'
                aria-label='Select example'
              >
                <option value='all'>All</option>
                {allDepartments?.data?.map((item: any) => (
                  <option value={item.id}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
          <div className='mb-7'>
              <label htmlFor='exampleFormControlInput1' className=' form-label'>
                Status{' '}
              </label>
              <select
                // value={selectedGrade}
                // onChange={(e) => setSelectedGrade(e.target.value)}
                className='form-select form-select-solid'
                aria-label='Select example'
              >
                <option value='all'>All</option>
                <option value='Submitted'>Submitted</option>
                <option value='Rejected'>Rejected</option>
                <option value='Approved'>Approved</option>
                <option value='Drafted'>Drafted</option>
                <option value='Not Started'>Not Started</option>
              </select>
            </div>
          <div className='mb-7'>
              <label htmlFor='exampleFormControlInput1' className=' form-label'>
                Performance Rating{' '}
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className='form-select form-select-solid'
                aria-label='Select example'
              >
                <option value='all'>All</option>
                {
                  allAppraisalGrades?.data?.map((item:any)=>(
                    <option>{item?.grade}</option>
                  ))
                }
              </select>
            </div>
            </>:null
        }
        <div>
          <button 
            disabled={
              dataWithFullName?.length === 0||
              dataWithFullName === undefined || 
              dataWithFullName === null 
            }
            className='btn btn-light-info btn-sm' onClick={handlePrint}>
              Export
          </button>
        </div>
      </div>
      {loading ? <Skeleton active /> : <Table columns={columns} 
        dataSource={currentLocation === 'appraisal-performance'?dataWithFullName:componentData} />}

      <Modal
        open={isModalOpen}
        width={
          checkActive?.tag?.trim() === 'actual' || checkActive?.tag?.trim() === 'final'
            ? 1400
            : 1200
        }
        onCancel={handleCancel}
        closable={true}
        footer={
          tag === 'actual' || tag === 'final' ? (
            <Space className='mt-7'>
              <button type='button' className='btn btn-danger btn-sm' onClick={closeModal}>
                Cancel
              </button>
              <button type='button' className='btn btn-success  btn-sm' onClick={acceptAmendment}>
                Submit
              </button>
            </Space>
          ) : location === 'View Details' ? null : (
            <Space className='mt-7'>
              <button
                type='button'
                className='btn btn-danger btn-sm'
                onClick={onObjectivesRejected}
              >
                Decline
              </button>
              <button
                type='button'
                className='btn btn-success  btn-sm'
                onClick={onObjectivesApproved}
              >
                Approve
              </button>
            </Space>
          )
        }
      >
        <div className='py-9 px-9'>
          <AppraisalFormHeader
            employeeData={employeeData}
            department={department}
            lineManager={lineManager}
            // print={
            //   <Button
            //     type='link'
            //     className='me-3'
            //     onClick={showPrintPreview}
            //     icon={<PrinterOutlined rev={'print'} className='fs-1' />}
            //   />
            // }
          />

          {
            // checkActive?.tag?.trim() === "actual" ||
            // checkActive?.tag?.trim() === "final" ?

            <ActualMasterPage
              title={ currentLocation === 'appraisal-performance'? "hr": "linemanager"}
              employeeId={employeeData?.id?.toString()}
              referenceId={checkActive?.referenceId}
            />

            // : <AppraisalFormContent component={AppraisalObjectivesComponent} employeeId={employeeData?.id} parametersData={parametersData} />
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
              onClick={submitRejection}
              disabled={comment === '' || comment.length < 15}
            >
              Decline
            </Button>
            ,
          </>
        }
      >
        <form>
          <textarea
            {...register('comment')}
            placeholder='Enter your comment here'
            id='resizable-textarea'
            className='form-control mb-0 mt-7 mb-7 py-4 px-4 border border-gray-400'
            onChange={handleCommentChange}
            style={{height: textareaHeight}}
          />
        </form>
      </Modal>
      <Modal
        title={``}
        open={showPritntPreview}
        width={1000}
        onCancel={handlePrintPreviewModalCancel}
        closable={true}
        okText='Print'
        onOk={handlePrintPreviewModalOk}
      >
        <AppraisalPrintHeader employeeData={employeeData} />
        <PrintComponent employeeData={employeeData} />
      </Modal>
    </>
  )
}

export { NotificationsComponent }

