import { Button, Input, Modal, Select, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Api_Endpoint, deleteItem, deleteMultipleItem, fetchDocument } from '../../../../../services/ApiCalls'
import { getFieldName, getSupervisorData } from '../../ComponentsFactory'
import { AppraisalPrintHeader, PrintComponent } from '../../appraisalForms/AppraisalPdfPrintView'
import { AppraisalObjective } from './AppraisalObjective'
import { ReviewDateComponent } from './AppraisalScheduleDates'
import { EmployeeGroups } from './EmployeeGroups'
import type { TableRowSelection } from 'antd/es/table/interface';
import { KTSVG } from '../../../../../../_metronic/helpers'
import axios from 'axios'
// import "./cusStyle.css"


const AppraisalPerformance = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { reset, register, handleSubmit } = useForm()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEmpAddModal, setIsEmpAddModal] = useState(false)
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
  const [jobTitleName, setJobTitleName] = useState<any>(null);
  const [departmentName, setDepartmentName] = useState<any>(null);


  const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`appraisals/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allPeriods } = useQuery('periods', () => fetchDocument(`periods`), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument(`jobTitles/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroups', () => fetchDocument(`Paygroups/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allParameters } = useQuery('parameters', () => fetchDocument(`parameters/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allObjectives } = useQuery('appraisalperfobjectives', () => fetchDocument(`appraisalperfobjectives/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allAppraisalsPerfTrans } = useQuery('appraisalPerfTransactions', () => fetchDocument(`AppraisalPerfTransactions/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms/tenant/${tenantId}`), { cacheTime: 5000 })

  const [employeeData, setEmployeeData] = useState<any>({})
  const [parametersData, setParametersData] = useState<any>([])
  const [showPritntPreview, setShowPrintPreview] = useState(false)
  const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments`), { cacheTime: 5000 })

  const lineManager = getSupervisorData({ employeeId: employeeData?.id, allEmployees, allOrganograms })
  const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (selectedRowKeys:any, selectedRows:any) => {
    setSelectedRowKeys(selectedRowKeys);
      console.log(`Selected Row Keys: ${selectedRowKeys}`, 'Selected Rows:', selectedRows);
  };
  const rowSelection:TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  const handleCancel = () => {
    reset()
    setEmployeeRecord([])
    setIsModalOpen(false)
    setDetailsModalOpen(false)
    loadData()
    setEmployeeGroupsData(dataByID)
  }
  const handleEmpCancel = () => {
    reset()
    setIsEmpAddModal(false)
    setEmployeeRecord([])
    loadData()
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

  const getLinemanager = (id:any) => {
    const emp = allEmployees?.data?.find((item: any) => {
        return item.id === id
    })
    return emp?.firstName + " " + emp?.surname
  }

  const dataByID: any = allAppraisalsPerfTrans?.data?.filter((refId: any) => {
    // let Ids:any = []
    // if (refId.referenceId === referenceId) {
    //   return Ids.push(refId.employeeId)
    // }
    return refId.referenceId === referenceId
  })

  const { mutate: deleteData, isLoading: deleteLoading } = useMutation(deleteMultipleItem, {
    onSuccess: (data: any) => {
      queryClient.setQueryData([data?.url, data], data);
      message.success('Records deleted successfully')
      loadData()
      queryClient.invalidateQueries('appraisalPerfTransactions')
    },
    onError: (error) => {
      message.error('Error deleting record')
    }
  })

  function handleDelete() {
    selectedRowKeys.map((del: any) => {
      console.log('del: ', del)
    const recordId =  dataByID.filter((item: any) => {
      return item.employeeId === del
    }, [])
    const id = recordId[0]?.id
    console.log('deleteId: ', id)
    const item = {
      url: 'AppraisalPerfTransactions',
      data: id
    }
      setLoading(true)
      deleteData(item)
    }
   )
   setSelectedRowKeys([])
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
      key: 'firstName',
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
      key: "surname",
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
      key:"jobTitleId",
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
      key:"email",
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
      // dataIndex:"lineManagerId",
      key: 'lineManagerId',
      render: (row: any) => {
        return getLinemanager(row?.lineManagerId)
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
      dataIndex: 'score',
      key:"score",
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
          {/* <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
            Remove
          </a> */}
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

  const emplyeesByPaygroup: any = allEmployees?.data?.filter((item: any) => {
    return item.paygroupId === parseInt(selectedPaygroup)
  })
  const onEmployeeChange = (objectId: any) => {
    const newEmplo = allEmployees?.data?.find((item: any) => {
      return item.id === parseInt(objectId)
    })
    setEmployeeRecord(newEmplo)
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
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }



 

  // this will return all employeesid in dataByID
  const idSet = new Set(dataByID?.map((item: any) => item.employeeId))

  const employeesFromTransaction = allEmployees?.data?.filter((item: any) => {
    return idSet.has(item.id)
  })

  // console.log('dataByID: ', dataByID)
  // console.log('employeesFromTransaction: ', employeesFromTransaction)

  // return from employees, all employees that are in dataByID using employeeId
  const employeesInDataByID = allEmployees?.data?.filter((item: any) => {
    return notificationsGroupData?.map((item: any) => {
      return item.employeeId
    })?.includes(item.id)
  })


// check if employeeId already exist in dataByID

// const checkIfEmployeeExist = (employeeId: any) => {

//   const result = dataByID?.filter((item: any) => {
//     return item.employeeId === employeeId
//   })

//   if (result?.length > 0) {
//     return message.error('Employee already exist')
//   } else {
//     return message.success('You can add employee to the list')
//   }
// }

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
  const showEmpAddModal = () => {
    setIsEmpAddModal(true)
  }

  const handleSelectedChange = (e: any) => {
    setSelectedAppraisaltype(e.target.value)
    setFieldInit(parameterByAppraisal)
  }

  // const handleScoreChange = (e: any, userId: any) => {
  //   const newUsers: any = fieldInit.map((user: any) => {
  //     if (user.id === userId) {
  //       return { ...user, score: parseInt(e.target.value) };
  //     }
  //     return user;
  //   });
  //   setFieldInit(newUsers);
  // };

  const GetJobTitle = (employeeId: any) => {
    const paygroupId = allEmployees?.data?.find((item: any) => {
      return item.id === employeeId
    })
    const jobTitleName = allJobTitles?.data?.find((item: any) => {
      return item.id === paygroupId?.jobTitleId
    })
    return setJobTitleName( jobTitleName?.name)
  }

  const GetDepartment = (employeeId: any) => {
    const departmentId = allEmployees?.data?.find((item: any) => {
      return item.id === employeeId
    })
    const jobTitleName = allDepartments?.data?.find((item: any) => {
      return item.id === departmentId?.departmentId
    })
    return setDepartmentName( jobTitleName?.name)
  }

  // const handleCommentChange = (e: any, userId: any) => {
  //   const newUsers: any = fieldInit.map((user: any) => {
  //     if (user.id === userId) {
  //       return { ...user, comment: e.target.value };
  //     }
  //     return user;
  //   });
  //   setFieldInit(newUsers);
  // };

  const handleInputChange = (e: any) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      loadData()
    }
  }

  const DataWithKey = notificationsGroupData?.map((item:any) =>{
    return {...item, key: item?.id}
  })

  const globalSearch = () => {
    // @ts-ignore
    filteredData = dataWithVehicleNum.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }

    useEffect(() => {
    loadData()
    GetDepartment(employeeRecord?.id)
    GetJobTitle(employeeRecord?.id)
    setReferenceId(`${selectedPaygroup}-${selectedAppraisalType}-${selectedStartPeriod}-${selectedEndPeriod}`)

  }, [
    allJobTitles?.data, allObjectives?.data, allReviewdates?.data, selectedAppraisalType,
    selectedPaygroup, selectedStartPeriod, selectedEndPeriod, referenceId, employeeData, employeeRecord?.id
  ])

  const submitApplicant = handleSubmit(async (values) => {
  
     const  data = {
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
      }

    console.log('data: ', data)
    const result = dataByID?.filter((item: any) => {
        return item.employeeId === employeeRecord.id
      })

    if (result?.length > 0) {
      message.error('Employee already exist in this group')
    } else {
    try {
    // checkIfEmployeeExist(employeeRecord.id)
      axios.post(`${Api_Endpoint}/AppraisalPerfTransactions`, data)
      .then((res) => {
        message.success('Employees added successfully')
        loadData()
        queryClient.invalidateQueries('appraisalPerfTransactions')
        setIsEmpAddModal(false)
        handleEmpCancel()
        console.log(res)
      })
      .catch((err) => {
        console.log(err)
      })
    } catch (error) {
    message.error('Failed to add employee!')
    }}
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
            <div className='col-12 mb-7'>
                <AppraisalObjective referenceId={referenceId} />
              </div>
            <div className='col-12 row mb-7'>
              < ReviewDateComponent
                referenceId={referenceId}
                selectedAppraisalType={selectedAppraisalType}
                employeesInDataByID={DataWithKey}
              />
            </div>
            <br></br>

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
                
                {
                  selectedRowKeys?.length>0?
                  <button style={{ marginBottom: 16 }} type='button' className='btn btn-danger btn-sm' onClick={handleDelete}>
                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                    Remove
                  </button>:
                  <button style={{ marginBottom: 16 }} type='button'  className='btn btn-primary me-3' onClick={showEmpAddModal}>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
                }
                
              </Space>
            </div>
            {
              loading ? <Skeleton active /> :
                <Table 
                  columns={columns}
                  rowKey={record => record.id}
                  rowSelection={rowSelection}
                  dataSource={employeesFromTransaction} 
                  // dataSource={notificationsGroupData} 
                />
            }
             <Modal
                title='Employee Details '
                open={isEmpAddModal}
                onCancel={handleEmpCancel}
                closable={true}
                width="900px"
                footer={[
                  <Button key='back' onClick={handleEmpCancel}>
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
                      <input type="text"  readOnly defaultValue={jobTitleName} className="form-control form-control-solid" />
                    </div>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className=" form-label">Department</label>
                      <input type="text"  readOnly defaultValue={departmentName} className="form-control form-control-solid" />
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">First Name</label>
                      <input type="text" readOnly defaultValue={employeeRecord?.firstName} className="form-control form-control-solid" />
                    </div>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className=" form-label">Surname</label>
                      <input type="text"  readOnly defaultValue={employeeRecord?.surname} className="form-control form-control-solid" />
                    </div>
                  </div>
                  <div style={{ padding: "20px 20px 10px 20px" }} className='row mb-7 '>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">DOB</label>
                      <input type="text" readOnly defaultValue={employeeRecord?.dob?.substring(0, 10)} className="form-control form-control-solid" />
                    </div>
                    <div className='col-6 mb-3'>
                      <label htmlFor="exampleFormControlInput1" className=" form-label">Gender</label>
                      <input type="text" readOnly defaultValue={employeeRecord?.gender} className="form-control form-control-solid" />

                    </div>
                  </div>
                  <hr></hr>
                </form>
              </Modal>
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




