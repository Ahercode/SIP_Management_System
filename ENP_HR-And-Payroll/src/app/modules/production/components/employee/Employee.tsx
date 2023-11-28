import { Input, Modal, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../../_metronic/helpers'
import { ImageBaseUrl, deleteItem, fetchDocument } from '../../../../services/ApiCalls'
import { getFieldName } from '../ComponentsFactory'
import { EmplyeeDetails } from '../employeeFormEntry/EmployeeDetails'

const Employee = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const tenantId = localStorage.getItem('tenant')
  console.log('tenantId: ', tenantId)
  const queryClient = useQueryClient()
  const { data: allEmployee } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 10000 })
  const { data: allDepartments } = useQuery('department', () => fetchDocument('departments'), { cacheTime: 10000 })
  const { data: allPaygroups } = useQuery('paygroup', () => fetchDocument(`Paygroups/tenant/${tenantId}`), { cacheTime: 10000 })
  const { data: allJobTitles } = useQuery('jobtitles', () => fetchDocument(`JobTitles/tenant/${tenantId}`), { cacheTime: 10000 })
  const [employeeData, setEmployeeData] = useState<any>({})
  const [beforeSearch, setBeforeSearch] = useState([])
  const [departmentSelected, setDepartmentSelected] = useState<any>("all") 
  const [statusSelected, setStatusSelected] = useState<any>("active") 

  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const showDetailsModal = (record: any) => {
    setDetailsModalOpen(true)
    setEmployeeData(record)
  }

  const handleDetailsModalCancel = () => {
    setDetailsModalOpen(false)
  }

  const empByDepartment = allEmployee?.data?.filter((item: any) => {
    return item.departmentId === parseInt(departmentSelected)
  })

  const empByDepartmentAndStatus = allEmployee?.data?.filter((item: any) => {
    return item.departmentId === parseInt(departmentSelected) && item.status === statusSelected
  })

  const empByStatus = allEmployee?.data?.filter((item: any) => {
    return item.status === statusSelected
  })

  // const empByDepartment = allEmployee?.data?.filter((item: any) => {
  //   return item.departmentId === parseInt(departmentSelected) && item.status === statusSelected
  // })

  // const { mutate: deleteData } = useMutation(deleteItem, {
  //   onSuccess: () => {
  //     queryClient.invalidateQueries('employees')
  //   },
  //   onError: (error) => {
  //     console.log('delete error: ', error)
  //     message.error('Error deleting employee')
  //   }
  // })

  // function handleDelete(element: any) {
  //   const item = {
  //     url: 'employees',
  //     data: element
  //   }
  //   deleteData(item)
  // }

  const columns: any = [
    {
      title: 'Profile',
      key: 'imageUrl',
      fixed: 'left',
      width: 260,
      render: (row: any) => {
        return (
          <EmployeeProfile employee={row} />
        )
      }
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: any, b: any) => {
        if (a.email > b.email) {
          return 1
        }
        if (b.email > a.email) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Employee Group',
      key: 'paygroupId',
      render: (row: any) => {
        return getFieldName(row.paygroupId, allPaygroups?.data)
      },
      sorter: (a: any, b: any) => {
        if (a.paygroupId > b.paygroupId) {
          return 1
        }
        if (b.paygroupId > a.paygroupId) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Job Title',
      dataIndex: 'jobTitleId',
      key: 'jobTitle',
      // width: 140,
      render: (row: any) => {
        return getFieldName(row, allJobTitles?.data)
      },
      sorter: (a: any, b: any) => {
        if (a.jobTitle > b.jobTitle) {
          return 1
        }
        if (b.jobTitle > a.jobTitle) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Department',
      dataIndex: 'departmentId',
      key: 'departmentId',
      // width: 120,
      render: (row: any) => {
        return getFieldName(row, allDepartments?.data)
      },

      sorter: (a: any, b: any) => {
        if (a.departmentId > b.departmentId) {
          return 1
        }
        if (b.departmentId > a.departmentId) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      render: (row: any) => {
        return <a href={`tel:${row}`}>{row}</a>
      },
      sorter: (a: any, b: any) => {
        if (a.phone > b.phone) {
          return 1
        }
        if (b.phone > a.phone) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (row: any) => {
        return (
              row === 'active' ?
              <span className='badge badge-light-success text-capitalize'>{row}</span> :
              <span className='badge badge-light-danger text-capitalize'>{row}</span>
        )
      },
      sorter: (a: any, b: any) => {
        if (a.status > b.status) {
          return 1
        }
        if (b.status > a.status) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 180,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a className='btn btn-light-success btn-sm' onClick={() => showDetailsModal(record)}>
            Details
          </a>
          <Link to={`/employee-edit-form/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Update</span>
          </Link>
        </Space>
      ),

    },
  ]

  const loadData = async () => {
    setLoading(true)
    try {
      const response = departmentSelected === "all" && statusSelected==="all" ? 
      allEmployee?.data : 
      statusSelected==="all" ? empByDepartment : departmentSelected==="all" ? empByStatus :
      empByDepartmentAndStatus 
      
      setGridData(response)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const dataWithIndex = allEmployee?.data.map((item: any, index: any) => ({
    ...item,
    key: index,
  }))

  useEffect(() => {
    loadData()
    setBeforeSearch(
      departmentSelected === "all" && statusSelected==="all" ? 
      allEmployee?.data : 
      statusSelected==="all" ? empByDepartment : departmentSelected==="all" ? empByStatus :
      empByDepartmentAndStatus 
     )
  }, [allEmployee?.data, departmentSelected, statusSelected])

  const globalSearch = (searchValue: string) => {
    const searchResult = gridData?.filter((item: any) => {
      return (
        Object.values(item).join('').toLowerCase().includes(searchValue?.toLowerCase())
      )
    })//search the grid data
    setGridData(searchResult)
  }

  const handleInputChange = (e: any) => {
    globalSearch(e.target.value)
    if (e.target.value === '') {
      setGridData(beforeSearch)
    }
  }

  return (
    <div className='card'
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <div className="card-custom card-flush">
        <div className="card-header mt-0" style={{ borderBottom: 'none' }}>
          <Space style={{ marginBottom: 16 }}>
            <Input
              placeholder='Enter Search Text'
              onChange={handleInputChange}
              type='text'
              allowClear
              size='large'
            />
            <div className='mb-7'>
              <label htmlFor="exampleFormControlInput1" className=" form-label">Department</label>
              <select value={departmentSelected} onChange={(e:any)=>setDepartmentSelected(e.target.value)} className="form-select form-select-solid">
                <option value="all">All</option>
                {allDepartments?.data.map((item: any) => (
                  <option value={item.id}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className='mb-7'>
              <label htmlFor="exampleFormControlInput1" className=" form-label">Status</label>
              <select value={statusSelected} onChange={(e:any)=>setStatusSelected(e.target.value)} className="form-select form-select-solid">
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </Space>
          <div className="card-toolbar">
            <Space style={{ marginBottom: 16 }}>
              <Link to='/employee-form'>
                <button style={{backgroundColor:"#216741", color:"#f2f2f2"}} type='button' className='btn me-3'>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
              </Link>
            </Space>
          </div>
        </div>
      </div>

      <KTCardBody className='py-1'>

          {
            loading ? <Skeleton active /> :
              <Table columns={columns} 
              dataSource={gridData}
              scroll={{ y: `calc(100vh - 250px)` }}
            />
          }
      </KTCardBody>
      <Modal
        open={detailsModalOpen}
        onCancel={handleDetailsModalCancel}
        closable={true}
        width="1000px"
        footer={null}>
          <EmplyeeDetails employeeData={employeeData} />
      </Modal>
    </div >
  )
}

const EmployeeProfile = (employee: any) => {
  return (
    <>
      <div className='d-flex display-direction-row align-items-center align-content-center'>
        <div>
          {
            employee?.employee?.imageUrl === null || employee?.employee?.imageUrl ==="" || employee?.employee?.imageUrl ==="No file was selected"?
            <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`${ImageBaseUrl}/omniAppraisalApi/uploads/employee/ahercode1.jpg`}></img>:
            <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`${ImageBaseUrl}/omniAppraisalApi/uploads/employee/${employee?.employee?.imageUrl}`}></img> 
          }
        </div>
        <div className='col px-4 align-items-center align-content-center'>
          <div className='text-dark fw-bold fs-4'>{`${employee?.employee?.firstName} ${employee?.employee?.surname}`}</div>
          <div className='badge badge-light-primary'>
            <span>{employee?.employee?.employeeId} </span>
          </div>
          {/* <div style={{margin: "0 5px"}} className="bullet"></div>
          {
            employee?.employee?.status === 'active' ?
            <div className='badge badge-light-success text-capitalize'>
              <span>{employee?.employee?.status}</span>
            </div> :
            <div className='badge badge-light-danger text-capitalize'>
              <span>{employee?.employee?.status}</span>
            </div>
          } */}
        </div>
      </div>
    </>
  )
}

export { Employee, EmployeeProfile }

