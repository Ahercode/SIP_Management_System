import { Button, Input, Modal, Select, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'
import { FormsBaseUrl, deleteItem, fetchDocument, postItem } from '../../../../../services/ApiCalls'
import { getSupervisorData } from '../../ComponentsFactory'
import { AppraisalObjective, ReviewDateComponent } from '../AppraisalPerformaceComponents'
import "./cusStyle.css"


const AppraisalPerformance = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { reset, register, handleSubmit } = useForm()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tabModalOpen, setTabModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("tab1");
  const [employeeRecord, setEmployeeRecord] = useState<any>([])
  const [employeeId, setEmployeeId] = useState<any>()
  const [jobTitleName, setjobTitleName] = useState<any>(null);
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
  const [currentDate, setCurrentDate] = useState<any>(new Date())
  const [referenceId, setReferenceId] = useState<any>(`${selectedPaygroup}-${selectedAppraisalType}-${selectedStartPeriod}-${selectedEndPeriod}`)
  const [currentObjective, setCurrentObjective] = useState<any>([])
  const [isEmailSent, setIsEmailSent] = useState<any>(false)

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



  const handleCancel = () => {
    reset()
    setEmployeeRecord([])
    setIsModalOpen(false)
    setUpdateModalOpen(false)

  }

  const handleScheduleModalCancel = () => {
    reset()
    setIsSchedulesDateModalOpen(false)
  }

  const showSchedulesModal = () => {
    setIsSchedulesDateModalOpen(true)
  }
  const handleUpdateCancel = () => {
    setUpdateModalOpen(false)
  }
  const showUpdateModal = (record: any) => {
    console.log(record)
    setUpdateModalOpen(true)
    setEmployeeId(record)
  }

  const { mutate: deleteData } = useMutation(deleteItem, {
    onSuccess: () => {
      loadData()
    },
    onError: (error) => {
      message.error('Error deleting record')
    }
  })

  function handleDelete(element: any) {
    const item = {
      url: 'AppraisalPerfTransactions',
      data: element
    }
    deleteData(item)
  }

  const columns: any = [
    {
      title: 'Id',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (text: any) => {
        return <span className='text-primary'>{getEmployeeCode(text)}</span>
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
      key: 'employeeId',
      render: (row: any) => {
        return getFirstName(row.employeeId)
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
      title: 'Surname',
      //   dataIndex: 'surname',
      key: "employeeId",
      render: (row: any) => {
        return getSurname(row?.employeeId)
      },
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
    // {
    //   title: 'DOB',
    //   render: (row: any) => {
    //     return getDOB(row.employeeId)
    //   },
    //   sorter: (a: any, b: any) => {
    //     if (a.dob > b.dob) {
    //       return 1
    //     }
    //     if (b.dob > a.dob) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },
    {
      title: 'Job Title',
      render: (row: any) => {
        return getJobTitle(row.employeeId)
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
      render: (row: any) => {
        return <span className='text-primar'>{getEmail(row.employeeId)}</span>
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
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a onClick={() => showUpdateModal(record.id)} className='btn btn-light-info btn-sm'>
            Details
          </a>
          <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
            Delete
          </a>
        </Space>
      ),

    },
  ]

  const loadData = async () => {
    setLoading(true)
    try {
      const response = allAppraisalsPerfTrans?.data
      setReviewDatesData(allReviewdates?.data)
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
    setReferenceId(`${selectedPaygroup}-${selectedAppraisalType}-${selectedStartPeriod}-${selectedEndPeriod}`)
  }, [
    allJobTitles?.data, allObjectives?.data, allReviewdates?.data, selectedAppraisalType,
    selectedPaygroup, selectedStartPeriod, selectedEndPeriod, referenceId
  ])

  const dataByID: any = allAppraisalsPerfTrans?.data?.filter((refId: any) => {
    return refId.paygroupId === parseInt(selectedPaygroup)
  })

  // return from employees, all employees that are in dataByID using employeeId
  const employeesInDataByID = allEmployees?.data?.filter((item: any) => {
    return dataByID?.map((item: any) => {
      return item.employeeId
    })?.includes(item.id)
  })


  const emplyeesByPaygroup: any = allEmployees?.data?.filter((item: any) => {
    return item.paygroupId === parseInt(selectedPaygroup)
  })

  const emplyeeDetails: any = allAppraisalTransactions?.data?.find((item: any) => {
    return item.id === employeeId
  })

  // console.log(emplyeeDetails)

  const onEmployeeChange = (objectId: any) => {
    const newEmplo = allEmployees?.data?.find((item: any) => {
      return item.id === parseInt(objectId)
    })
    setEmployeeRecord(newEmplo)
  }
  const getFirstName = (employeeId: any) => {
    let firstName = null
    allEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        firstName = item.firstName
      }
    })
    return firstName
  }
  const getSurname = (employeeId: any) => {
    let surname = null
    allEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        surname = item.surname
      }
    })
    return surname
  }

  const getEmail = (employeeId: any) => {
    let email = null
    allEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        email = item.email
      }
    })
    return email
  }


  const getJobTitle = (employeeId: any) => {
    let jobTitleId: any = null
    allEmployees?.data.map((item: any) => {
      if (item.id === employeeId) {
        jobTitleId = item.jobTitleId
      }
    })
    let jobTitleName = null
    allJobTitles?.data.map((item: any) => {
      if (item.id === jobTitleId) {
        jobTitleName = item.name
      }
    })
    return jobTitleName
  }

  const getEmployeeCode = (employeeId: any) => {
    const employeeCode = allEmployees?.data?.find((item: any) => {
      return item.id === employeeId
    })
    return employeeCode?.employeeId
  }

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

  const showModal = () => {
    setIsModalOpen(true)
    setFieldInit(parameterByAppraisal)
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
    postData(item)
  })

  const { mutate: postData } = useMutation(postItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('appraisalPerfTransactions')
      reset()
      loadData()
      isEmailSent && message.success('Email notifications sent successfully')
      setIsModalOpen(false)
      setSubmitLoading(false)
      setIsEmailSent(false)
    },
    onError: (error: any) => {
      console.log('post error: ', error)
    }
  })

  const handleNotificationSend = () => {

    //map throw dataById and return employeeId and name of employee as a new array
    const employeeMailAndName = employeesInDataByID?.map((item: any) => ({
      email: item.email,
      username: `${item.firstName} ${item.surname}`
    }))
    console.log('employeeMailAndName: ', employeeMailAndName)

    const item = {
      data: {
        subject: 'Appraisal Review Date',
        formLink: `${FormsBaseUrl}/appraisalObjectivesForm`,
        recipients: employeeMailAndName
      },
      url: 'appraisalperftransactions/sendMail',
    }
    setIsEmailSent(true)
    console.log('email sent: ', item)
    postData(item)
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <form onSubmit={submitApplicant}>
        <div style={{ padding: "20px 0px 0 0px" }} className='col-12 row mb-0'>
          <div className='col-3 mb-7'>
            <label htmlFor="exampleFormControlInput1" className=" form-label">Paygroup</label>
            <select value={selectedPaygroup} onChange={(e) => setSelectedPaygroup(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
              <option value="select paygroup">select paygroup</option>
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
              <option value="select end period"> select end period</option>
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
          <KTCardBody className='py-4 '>
            <div className='table-responsive'>
              {
                <>
                  <div style={{ padding: "0px 0px 0 0px" }} className='col-12 row mb-0 bg-lightx'>
                    <div className='col-6 mb-7'>
                      <AppraisalObjective referenceId={referenceId} />
                    </div>
                    <div className='col-6 mt-7'>
                      <button type='button' className='col-6 btn btn-light  border' onClick={showSchedulesModal}>
                        <KTSVG path='/media/icons/duotune/general/gen014.svg' className='svg-icon-2 me-3' />
                        View Schedules
                      </button>
                    </div>
                  </div>
                </>
              }
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
                <Space style={{ marginBottom: 16 }}>
                  <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                    Add
                  </button>

                  <button type='button' className='btn btn-light-primary me-3'>
                    <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                    Export
                  </button>
                </Space>
              </div>
              {
                loading ? <Skeleton active /> :
                  <Table columns={columns} dataSource={dataByID} />
              }
              <Modal
                title='Employee Details '
                open={isModalOpen}
                onCancel={handleCancel}
                closable={true}
                width="900px"
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
                ]}
              >
                <form onSubmit={submitApplicant}>
                  <hr></hr>
                  <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label ">Employee ID</label>

                      <br></br>
                      <Select
                        {...register("employeeId")}
                        showSearch
                        placeholder="select a reference"
                        optionFilterProp="children"
                        style={{ width: "300px" }}
                        value={employeeRecord.id}
                        onChange={(e) => {
                          onEmployeeChange(e)
                        }}
                      >
                        <option>select</option>
                        {emplyeesByPaygroup?.map((item: any) => (
                          <option key={item.id} value={item.id}>{item.firstName} - {item.surname}</option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>

                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Job Title</label>
                      <input type="text" name="code" readOnly value={jobTitleName} className="form-control form-control-solid" />
                    </div>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Job Role</label>
                      <input type="text" name="code" readOnly className="form-control form-control-solid" />
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">First Name</label>
                      <input type="text" {...register("firstName")} readOnly defaultValue={employeeRecord?.firstName} className="form-control form-control-solid" />
                    </div>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className=" form-label">Surname</label>
                      <input type="text" {...register("surname")} readOnly defaultValue={employeeRecord?.surname} className="form-control form-control-solid" />
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 10px 20px" }} className='row mb-7 '>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">DOB</label>
                      <input type="text" {...register("dob")} readOnly defaultValue={employeeRecord?.dob?.substring(0, 10)} className="form-control form-control-solid" />
                    </div>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className=" form-label">Gender</label>
                      <input type="text" {...register("gender")} readOnly defaultValue={employeeRecord?.gender} className="form-control form-control-solid" />

                    </div>
                  </div>
                  <hr></hr>
                  {fieldInit?.map((user: any) => (


                    <div style={{ padding: '10px 20px 10px 20px' }} className="col-12" key={user.id}>
                      <label style={{ fontWeight: "bold" }} htmlFor="exampleFormControlInput1" className="form-label">
                        {user.name}
                      </label>
                      <div className='row'>
                        <div className='col-6'>
                          <label htmlFor="exampleFormControlInput1" className="form-label">
                            Score
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={5}
                            placeholder='score from 1 to 5'
                            className="form-control form-control-solid"
                            value={user.score}
                            onChange={(e) => handleScoreChange(e, user.id)}
                          />
                        </div>
                        <div className='col-6'>
                          <label htmlFor="exampleFormControlInput1" className="form-label">
                            Comment
                          </label>
                          <textarea
                            value={user.comment}
                            onChange={(e) => handleCommentChange(e, user.id)}
                            className="form-control form-control-solid"
                            placeholder="comments (optional)"
                            aria-label="With textarea"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: "20px 20px 30px 20px" }} className='col-12 mb-3'>
                    <label style={{ padding: "0px 40px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Supporting Document :</label>

                    <input {...register("documentUrl")} className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' type="file" />
                  </div>

                </form>
              </Modal>
              <Modal
                title={"Details of ID " + employeeId}
                open={updateModalOpen}
                onCancel={handleUpdateCancel}
                closable={true}
                width="900px"
                footer={[
                  <Button key='back' onClick={handleUpdateCancel}>
                    Cancel
                  </Button>,
                  <Button
                    key='submit'
                    type='primary'
                    htmlType='submit'
                    loading={submitLoading}
                    onClick={submitApplicant}
                  >
                    Done
                  </Button>,
                ]}
              >
                <h3>Will be updated soon</h3>
              </Modal>
              <Modal
                title={`Schedule Dates`}
                open={isSchedulesDateModalOpen}
                onCancel={handleScheduleModalCancel}
                closable={true}
                width="900px"
                footer={[
                  <Button key='back' onClick={handleScheduleModalCancel}>
                    Close
                  </Button>,
                ]}
              >
                < ReviewDateComponent
                  referenceId={referenceId}
                  selectedAppraisalType={selectedAppraisalType}
                  handleNotificationSend={() => handleNotificationSend()}
                />
              </Modal>
            </div>
          </KTCardBody>
      }

    </div >
  )
}

export { AppraisalPerformance }


