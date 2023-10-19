import { Button, Input, Modal, Select, Skeleton, Space, Table, message } from 'antd'
import type { TableRowSelection } from 'antd/es/table/interface'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { KTSVG } from '../../../../../../_metronic/helpers'
import { Api_Endpoint, deleteMultipleItem, fetchDocument } from '../../../../../services/ApiCalls'
import { getFieldName } from '../../ComponentsFactory'
import { AppraisalPrintHeader, PrintComponent } from '../../appraisalForms/AppraisalPdfPrintView'
import { AppraisalObjective } from './AppraisalObjective'
import { ReviewDateComponent } from './AppraisalScheduleDates'

const AppraisalPerformance = () => {
  // const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  // let [filteredData] = useState([])
  const { reset, register, handleSubmit } = useForm()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefModalOpen, setIsRefModalOpen] = useState(false)
  const [isEmpAddModal, setIsEmpAddModal] = useState(false)
  const [employeeRecord, setEmployeeRecord] = useState<any>([])
  const [selectedPaygroup, setSelectedPaygroup] = useState<any>(null);
  const [selectedReference, setSelectedReference] = useState<any>(null);
  const [selectedAppraisalType, setSelectedAppraisaltype] = useState<any>(null);
  const [selectedStartPeriod, setSelectedStartPeriod] = useState<any>(null);
  const [selectedEndPeriod, setSelectedEndPeriod] = useState<any>(null);
  const [reference, setReference] = useState<any>(null);
  const tenantId = localStorage.getItem('tenant')
  const [fieldInit, setFieldInit] = useState([])
  const queryClient = useQueryClient()
  // const [appraisalData, setAppraisalData] = useState<any>([])
  const [referenceId, setReferenceId] = useState<any>(`${selectedPaygroup}-${selectedAppraisalType}-${selectedStartPeriod}-${selectedEndPeriod}`)
  // const [currentObjective, setCurrentObjective] = useState<any>([])
  // const [isEmailSent, setIsEmailSent] = useState<any>(false)
  // const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [notificationsGroupData, setNotificationsGroupData] = useState<any>([])
  const [jobTitleName, setJobTitleName] = useState<any>(null);
  const [departmentName, setDepartmentName] = useState<any>(null);

  const [employeeGroupsData, setEmployeeGroupsData] = useState<any>([])


  const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`appraisals/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allPeriods } = useQuery('periods', () => fetchDocument(`periods`), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument(`jobTitles/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroups', () => fetchDocument(`Paygroups/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allParameters } = useQuery('parameters', () => fetchDocument(`parameters/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allObjectives } = useQuery('appraisalperfobjectives', () => fetchDocument(`appraisalperfobjectives/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allAppraTranItems } = useQuery('appraisalPerItems', () => fetchDocument(`AppraisalPerItems`), { cacheTime: 5000 })
  const { data: allAppraisalsPerfTrans } = useQuery('appraisalPerfTransactions', () => fetchDocument(`AppraisalPerfTransactions/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms/tenant/${tenantId}`), { cacheTime: 5000 })

  const [employeeData, setEmployeeData] = useState<any>({})
  // const [parametersData, setParametersData] = useState<any>([])
  const [showPritntPreview, setShowPrintPreview] = useState(false)
  const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments`), { cacheTime: 5000 })

  // const lineManager = getSupervisorData({ employeeId: employeeData?.id, allEmployees, allOrganograms })
  // const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
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
    loadData()
    setEmployeeGroupsData(dataByID)
  }
  const handleEmpCancel = () => {
    reset()
    setIsEmpAddModal(false)
    setEmployeeRecord([])
    loadData()
  }
  const handleRefCancel = () => {
    setEmployeeRecord([])
    setSelectedPaygroup("select paygroup")
    setSelectedAppraisaltype("select appraisal type")
    setSelectedStartPeriod("select start period")
    setSelectedEndPeriod("select end period")
    setIsRefModalOpen(false)
  
  }
  const showPrintPreview = () => {
    setShowPrintPreview(true)
    handleCancel()
  }

  const handlePrintPreviewModalCancel = () => {
    setShowPrintPreview(false)
  }

  const handlePrintPreviewModalOk = () => {
    setShowPrintPreview(false)
  }

  const showRefModal = () => {
    setIsRefModalOpen(true)
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
    return refId.referenceId === referenceId
  })

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

  const empSelectedPaygroup: any = allEmployees?.data?.filter((item: any) => {
    return item.paygroupId === parseInt(selectedPaygroup)
  })

  const idSet = new Set(allAppraisalTranItems?.map((item: any) => parseInt(item.employeeId)))

  const employeesFromTransaction = allEmployees?.data?.filter((item: any) => {
    return idSet.has(item.id)
  })

  const { mutate: deleteData, isLoading: deleteLoading } = useMutation(deleteMultipleItem, {
    onSuccess: (data: any) => {
      loadData()
      queryClient.invalidateQueries('appraisalPerItems')
    },
    onError: (error) => {
      message.error('Error deleting record')
    }
  })

  function handleDelete() {
    selectedRowKeys.map((del: any) => {
      console.log('del: ', del)
    const recordId =  allAppraisalTranItems.filter((item: any) => {
      return parseInt(item.employeeId) === del && item.appraisalPerfTranId === parseInt(selectedReference)
    }, [])
    const id = recordId[0]?.id
    console.log('deleteId: ', id)
    const item = {
      url: 'AppraisalPerItems',
      data: id
    }
      setLoading(true)
      deleteData(item)
    }
   )
   setSelectedRowKeys([])
   message.success('Records deleted successfully')
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
        {
          isRefModalOpen?""
          //  <a onClick={() => removeEmp(record)} className='btn btn-light-danger btn-sm'>
          //   Remove
          // </a> :
          :
          <a onClick={() => showUpdateModal(record)} className='btn btn-light-info btn-sm'>
          Details
        </a>

        }
        </Space>
      ),

    },
  ]

  if (isRefModalOpen) {
    columns.splice(3, 1)
    if (columns.length === 7) {
      columns.splice(5, 2)
    }
  }

  // get employee id from empSelectedPaygroup
  const employeeIds = empSelectedPaygroup?.map((item: any) => {
    return item.id
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
      setNotificationsEmployeesData()
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const parameterByAppraisal = allParameters?.data.filter((section: any) => section.appraisalId === parseInt(selectedAppraisalType))
    .map((item: any) => ({
      ...item,
      score: '',
      comment: '',
    }))

  const showEmpAddModal = () => {
    setIsEmpAddModal(true)
  }

  const handleSelectedChange = (e: any) => {
    setSelectedAppraisaltype(e.target.value)
    setFieldInit(parameterByAppraisal)
  }

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
    // setGridData(filteredData)
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
        startPeriod: selectedStartPeriod,
        endPeriod: selectedEndPeriod,
        appraTranItems: employeeIds.map((item: any) => ({
          parameterId: item.id,
          score: item.score?.toString(),
          employeeId: item?.toString()
        })),
        tenantId: tenantId,
        referenceId: referenceId,
      }
      const tranItemData = {
        employeeId: employeeRecord?.id?.toString(),
        appraisalPerfTranId: parseInt(selectedReference),
      }
    const result = allAppraisalTranItems?.filter((item: any) => {
      return parseInt(item.employeeId) === employeeRecord.id && item.appraisalPerfTranId === parseInt(selectedReference)
    })

      let url = ""
      let dataToPost = null
      let refreshKey:any = null

    if(isEmpAddModal){
      url = "AppraisalPerItems/newItem"
      dataToPost = tranItemData
      refreshKey = 'appraisalPerItems'
    }
    else{
      url = "AppraisalPerfTransactions"
      dataToPost = data
      refreshKey = 'appraisalPerfTransactions'
    }

    if (result?.length > 0) {
      message.error('Employee already exist in this group')
    } else {

      console.log('dataToPost: ', dataToPost)
    try {
      axios.post(
        `${Api_Endpoint}/${url}`, 
        dataToPost)
      .then((res) => {
        message.success('Employees added successfully')
        loadData()
        queryClient.invalidateQueries(`${refreshKey}`)
        setIsEmpAddModal(false)
        setIsRefModalOpen(false)
        queryClient.invalidateQueries(`appraisalPerItems`)
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

      <div className='row'>
        <div className='col-3 mb-7'>
          <label htmlFor="exampleFormControlInput1" className=" form-label">Reference </label>
          <select value={selectedReference} onChange={(e) => setSelectedReference(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
            <option value="select reference">select reference</option>
            {allAppraisalsPerfTrans?.data?.map((item: any)=>(
              <option value={item.id}>
              {getFieldName(item?.paygroupId, allPaygroups?.data)} - {getFieldName(item?.appraisalTypeId, allAppraisals?.data)} - {getFieldName(item?.startPeriod, allPeriods?.data)} - {getFieldName(item?.endPeriod, allPeriods?.data)}
              </option>
            ))}
          </select>
        </div>
        {
          selectedReference === null || selectedReference === "select reference" ? 
          <div className='col-3 mt-9'>
          <a onClick={showRefModal} className='btn btn-info btn-sm'>Add New Entry</a>
        </div> :""
        }
        
      </div>
      {
        selectedReference === null || selectedReference === "select reference" ? "":
        <>
            <div style={{ padding: "20px 0px 0 0px" }} className='col-12 row mb-0'>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Employee Groups</label>
                <input readOnly value={getFieldName(appraisalTranItem?.paygroupId, allPaygroups?.data)} className="form-control form-control-solid"/>
              </div>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Appraisal Type</label>
                <input readOnly value={getFieldName(appraisalTranItem?.appraisalTypeId, allAppraisals?.data)} className="form-control form-control-solid"/>
              </div>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Start Period</label>
                <input readOnly value={getFieldName(appraisalTranItem?.startPeriod, allPeriods?.data)} className="form-control form-control-solid"/>
              </div>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">End Period</label>
                <input readOnly value={getFieldName(appraisalTranItem?.endPeriod, allPeriods?.data)} className="form-control form-control-solid"/>
              </div>
            </div>
        </>
      }
      <Modal
        title={`Add Reference`}
        open={isRefModalOpen}
        onCancel={handleRefCancel}
        closable={true}
        width="1100px"
        footer={[
          <Button key='back' 
          onClick={handleRefCancel}
          >
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            htmlType='submit'
            onClick={submitApplicant}
          >
            Submit
          </Button>,
          ]}>
          <form 
          onSubmit={submitApplicant}
          >
            <div style={{ padding: "20px 0px 0 0px" }} className='col-12 row mb-0'>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Employee Groups</label>
                <select 
                  value={selectedPaygroup} 
                  onChange={(e) => setSelectedPaygroup(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
                  <option value="select paygroup">select employee group</option>
                  {allPaygroups?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Appraisal Type</label>
                <select 
                  value={selectedAppraisalType} 
                  onChange={handleSelectedChange} className="form-select form-select-solid" aria-label="Select example">
                  <option value="select appraisal type">select appraisal type</option>
                  {allAppraisals?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Start Period</label>
                <select 
                  value={selectedStartPeriod} 
                  onChange={(e) => setSelectedStartPeriod(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
                  <option value="select start period">select start period</option>
                  {allPeriods?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">End Period</label>
                <select 
                  value={selectedEndPeriod} 
                  onChange={(e) => setSelectedEndPeriod(e.target.value)} className="form-select form-select-solid" aria-label="Select example">
                  <option value="select end period"> Select end period </option>
                  {allPeriods?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <Table 
              columns={columns}
              dataSource={empSelectedPaygroup}
            />
          </form>
        </Modal>
      {
        selectedReference === null
          || selectedReference === "select reference"
          ? "" :

          <div className='table-responsive'>
            <div className='col-12 mb-7'>
                <AppraisalObjective referenceId={appraisalTranItem?.referenceId} />
              </div>
            <div className='col-12 row mb-7'>
              < ReviewDateComponent
                referenceId={appraisalTranItem?.referenceId}
                selectedAppraisalType={appraisalTranItem?.appraisalTypeId}
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
                    // loading={submitLoading}
                    onClick={submitApplicant}
                  >
                    Submit
                  </Button>,
                ]}
              >
                <form 
                onSubmit={submitApplicant}
                >
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




