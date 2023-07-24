import { Button, Divider, Input, Modal, Select, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'
import { FormsBaseUrl, deleteItem, fetchDocument, postItem } from '../../../../../services/ApiCalls'
import { getFieldName, getSupervisorData } from '../../ComponentsFactory'
import { ReviewDateComponent } from './AppraisalScheduleDates'
import "./cusStyle.css"
import { EmployeeGroups } from './EmployeeGroups'
import { AppraisalObjective } from './AppraisalObjective'
import { AppraisalObjectivesComponent } from '../../appraisalForms/AppraisalObjectivesComponent'
import { AppraisalFormHeader, AppraisalFormContent } from '../../appraisalForms/FormTemplateComponent'
import { AppraisalPrintHeader, PrintComponent } from '../../appraisalForms/AppraisalPdfPrintView'
import { PrinterOutlined } from '@ant-design/icons'


const AppraisalPerformance = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { reset, register, handleSubmit } = useForm()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [employeeRecord, setEmployeeRecord] = useState<any>([])
  const [employeeId, setEmployeeId] = useState<any>()
  const [selectedPaygroup, setSelectedPaygroup] = useState<any>(null);
  const [selectedAppraisalType, setSelectedAppraisaltype] = useState<any>(null);
  const [selectedStartPeriod, setSelectedStartPeriod] = useState<any>(null);
  const [selectedEndPeriod, setSelectedEndPeriod] = useState<any>(null);
  const tenantId = localStorage.getItem('tenant')
  const [fieldInit, setFieldInit] = useState([])
  const [isSchedulesDateModalOpen, setIsSchedulesDateModalOpen] = useState(false)
  const [reviewDatesData, setReviewDatesData] = useState<any>([])
  const queryClient = useQueryClient()
  const [appraisalData, setAppraisalData] = useState<any>([])
  const [referenceId, setReferenceId] = useState<any>(`${selectedPaygroup}-${selectedAppraisalType}-${selectedStartPeriod}-${selectedEndPeriod}`)
  const [currentObjective, setCurrentObjective] = useState<any>([])
  const [isEmailSent, setIsEmailSent] = useState<any>(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [notificationsGroupData, setNotificationsGroupData] = useState<any>([])


  const { data: allEmployees } = useQuery('employees', () => fetchDocument('employees'), { cacheTime: 5000 })
  const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument('appraisals'), { cacheTime: 5000 })
  const { data: allPeriods } = useQuery('periods', () => fetchDocument('periods'), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument('jobTitles'), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroups', () => fetchDocument('Paygroups'), { cacheTime: 5000 })
  const { data: allAppraisalTransactions } = useQuery('appraisalTransactions', () => fetchDocument('appraisalTransactions'), { cacheTime: 5000 })
  const { data: allParameters } = useQuery('parameters', () => fetchDocument('parameters'), { cacheTime: 5000 })
  const { data: allObjectives } = useQuery('appraisalperfobjectives', () => fetchDocument(`appraisalperfobjectives`), { cacheTime: 5000 })
  const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 5000 })
  const { data: allAppraisalsPerfTrans } = useQuery('appraisalPerfTransactions', () => fetchDocument(`AppraisalPerfTransactions`), { cacheTime: 5000 })
  const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })

  const [employeeData, setEmployeeData] = useState<any>({})
  const [parametersData, setParametersData] = useState<any>([])
  const [showPritntPreview, setShowPrintPreview] = useState(false)

  const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments`), { cacheTime: 5000 })

  const lineManager = getSupervisorData({ employeeId: employeeData?.id, allEmployees, allOrganograms })
  const department = getFieldName(employeeData?.departmentId, allDepartments?.data)


  const handleCancel = () => {
    reset()
    setEmployeeRecord([])
    setIsModalOpen(false)
    setDetailsModalOpen(false)
    loadData()
    setEmployeeGroupsData(dataByID)
  }

  const showPrintPreview = () => {
    setShowPrintPreview(true)
    handleCancel()
  }

  const handlePrintPreviewModalCancel = () => {
    setShowPrintPreview(false)
  }

  const handlePrintPreviewModalOk = () => {
    //todo print of the objectives 
    setShowPrintPreview(false)
  }

  const handleUpdateCancel = () => {
    setDetailsModalOpen(false)
  }
  const showUpdateModal = (record: any) => {
    setShowPrintPreview(true)
    const employee = allEmployees?.data?.find((item: any) => item?.employeeId === record?.employeeId)
    setEmployeeData(employee)
  }

  const columns: any = [
    {
      title: 'Id',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (text: any) => {
        return <span className='text-primary'>{text}</span>
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
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'employeeId',
      // render: (row: any) => {
      //   return getFirstName(row)
      // },
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
      title: 'Surname',
      dataIndex: 'surname',
      key: "employeeId",
      // render: (row: any) => {
      //   return getSurname(employeeId)
      // },
      sorter: (a: any, b: any) => {
        if (a.surname > b.surname) {
          return 1
        }
        if (b.surname > a.surname) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitleId',
      render: (row: any) => {
        return getFieldName(row, allJobTitles?.data)
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
      dataIndex: 'email',
      // render: (row: any) => {
      //   return <span className='text-primar'>{getEmail(row.employeeId)}</span>
      // },
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
      render: (row: any) => {
        return getSupervisorName(row)
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
      title: 'Score',
      dataIndex: 'employeeId',
      render: (row: any) => {
        return '0'
      },
    },

    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a onClick={() => showUpdateModal(record)} className='btn btn-light-info btn-sm'>
            Details
          </a>
          <a onClick={() => removeEmployeeFromData(record)} className='btn btn-light-danger btn-sm'>
            Remove
          </a>
        </Space>
      ),

    },
  ]

  const removeEmployeeFromData = (item: any) => {
    setNotificationsGroupData((prev: any) => {
      return prev.filter((prevItem: any) => {
        return prevItem !== item
      })
    })
  }

  const clearAll = () => {
    setNotificationsGroupData([])
  }

  const setNotificationsEmployeesData = () => {
    clearAll()
    const data = allEmployees?.data?.filter((item: any) => {
      return item.paygroupId === parseInt(selectedPaygroup)
    })
    setNotificationsGroupData(data)
  }

  const loadData = async () => {
    setLoading(true)
    try {
      setReviewDatesData(allReviewdates?.data)
      setNotificationsEmployeesData()
      const parametersResponse = allParameters?.data?.filter((item: any) => item?.appraisalId === 12)
      setParametersData(parametersResponse)
      //find objective with matching referenceId from all objectives
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    setReferenceId(`${selectedPaygroup}-${selectedAppraisalType}-${selectedStartPeriod}-${selectedEndPeriod}`)

  }, [
    allJobTitles?.data, allObjectives?.data, allReviewdates?.data, selectedAppraisalType,
    selectedPaygroup, selectedStartPeriod, selectedEndPeriod, referenceId, employeeData
  ])

  const dataByID: any = allAppraisalsPerfTrans?.data?.filter((refId: any) => {
    return refId.paygroupId === parseInt(selectedPaygroup)
  })

  // return from employees, all employees that are in dataByID using employeeId
  const employeesInDataByID = allEmployees?.data?.filter((item: any) => {
    return notificationsGroupData?.map((item: any) => {
      return item.employeeId
    })?.includes(item.id)
  })

  // get supervisor name from organogram table
  const getSupervisorName = (employeeId: any) => {
    const supervisorName = getSupervisorData({ employeeId, allEmployees, allOrganograms })
    return supervisorName === undefined ? 'Undefined' : `${supervisorName?.firstName} ${supervisorName?.surname}`
  }

  const parameterByAppraisal = allParameters?.data.filter((section: any) => section.appraisalId === parseInt(selectedAppraisalType))
    .map((item: any) => ({
      ...item,
      score: '',
      comment: '',
    }))

  const [employeeGroupsData, setEmployeeGroupsData] = useState<any>([])
  const showModal = () => {
    setIsModalOpen(true)
    setFieldInit(parameterByAppraisal)
    setEmployeeGroupsData(dataByID)
  }

  const handleSelectedChange = (e: any) => {
    setSelectedAppraisaltype(e.target.value)
    setFieldInit(parameterByAppraisal)
  }

  const handleScoreChange = (e: any, userId: any) => {
    const newUsers: any = fieldInit.map((user: any) => {
      if (user.id === userId) {
        return { ...user, score: parseInt(e.target.value) };
      }
      return user;
    });
    setFieldInit(newUsers);
  };

  const handleCommentChange = (e: any, userId: any) => {
    const newUsers: any = fieldInit.map((user: any) => {
      if (user.id === userId) {
        return { ...user, comment: e.target.value };
      }
      return user;
    });
    setFieldInit(newUsers);
  };

  const handleInputChange = (e: any) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      loadData()
    }
  }

  const globalSearch = () => {
    // @ts-ignore
    filteredData = dataWithVehicleNum.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }

  const submitApplicant = handleSubmit(async (values) => {
    const item = {
      data: {
        paygroupId: parseInt(selectedPaygroup),
        appraisalTypeId: parseInt(selectedAppraisalType),
        employeeId: employeeRecord.id,
        startPeriod: selectedStartPeriod,
        endPeriod: selectedEndPeriod,
        appraTranItems: fieldInit.map((item: any) => ({
          parameterId: item.id,
          score: item.score.toString(),
          comment: item.comment,
        })),
        tenantId: tenantId,
        referenceId: referenceId,
      },
      url: 'AppraisalPerfTransactions',
    }
    console.log('item: ', item)
    handleCancel()
    message.success('Employees added successfully')
    // postData(item)
  })


  return (
    <div>
      <form onSubmit={submitApplicant}>
        <div style={{ padding: "20px 0px 0 0px" }} className='col-12 row mb-0'>
          <div className='col-3 mb-7'>
            <label htmlFor="exampleFormControlInput1" className=" form-label">Employee Groups</label>
            <select value={selectedPaygroup} onChange={(e) => setSelectedPaygroup(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
              <option value="select paygroup">select employee group</option>
              {allPaygroups?.data.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className='col-3 mb-7'>
            <label htmlFor="exampleFormControlInput1" className=" form-label">Appraisal Type</label>
            <select value={selectedAppraisalType} onChange={handleSelectedChange} className="form-select form-select-solid" aria-label="Select example">
              <option value="select appraisal type">select appraisal type</option>
              {allAppraisals?.data.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className='col-3 mb-7'>
            <label htmlFor="exampleFormControlInput1" className=" form-label">Start Period</label>
            <select value={selectedStartPeriod} onChange={(e) => setSelectedStartPeriod(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
              <option value="select start period">select start period</option>
              {allPeriods?.data.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
          <div className='col-3 mb-7'>
            <label htmlFor="exampleFormControlInput1" className=" form-label">End Period</label>
            <select value={selectedEndPeriod} onChange={(e) => setSelectedEndPeriod(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
              <option value="select end period"> Select end period</option>
              {allPeriods?.data.map((item: any) => (
                <option value={item.id}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
      {
        selectedPaygroup === null
          || selectedAppraisalType === null
          || selectedStartPeriod === null
          || selectedEndPeriod === null
          || selectedPaygroup === "select paygroup"
          || selectedAppraisalType === "select appraisal type"
          || selectedStartPeriod === "select start period"
          || selectedEndPeriod === "select end period" ? "" :

          <div className='table-responsive'>
            <div className='col-12 row mb-7 py-4'>
              <div className='col-3 mb-7'>
                <AppraisalObjective referenceId={referenceId} />
              </div>
              < ReviewDateComponent
                referenceId={referenceId}
                selectedAppraisalType={selectedAppraisalType}
                employeesInDataByID={notificationsGroupData}
              />
            </div>

            <div className='d-flex justify-content-between'>
              <Space style={{ marginBottom: 16 }}>
                <Input
                  placeholder='Enter Search Text'
                  onChange={handleInputChange}
                  type='text'
                  allowClear
                  value={searchText}
                />
                <Button type='primary' onClick={globalSearch}>
                  Search
                </Button>
              </Space>
            </div>
            {
              loading ? <Skeleton active /> :
                <Table columns={columns} dataSource={notificationsGroupData} />
            }
            <Modal
              title={`Employees in ${getFieldName(selectedPaygroup, allPaygroups?.data)}`}
              open={isModalOpen}
              onCancel={handleCancel}
              closable={true}
              width="1200px"
              footer={[
                <Button key='back' onClick={handleCancel}>
                  Cancel
                </Button>,
                <Button
                  key='submit'
                  type='primary'
                  htmlType='submit'
                  loading={submitLoading}
                  onClick={submitApplicant}
                >
                  Submit
                </Button>,
              ]}>
              <EmployeeGroups allEmployeeGroups={employeeGroupsData} loading={loading} />
            </Modal>
            <Modal
              open={showPritntPreview}
              onCancel={handlePrintPreviewModalCancel}
              closable={true}
              width={1000}
              cancelText='Close'
              okText="Print"
              onOk={handlePrintPreviewModalOk}
            >
              <div className="py-9 px-9"> 
                <AppraisalPrintHeader
                  employeeData={employeeData}
                />
                <PrintComponent employeeData={employeeData} />
              </div>
            </Modal>
          </div>
      }
    </div >
  )
}

export { AppraisalPerformance }




