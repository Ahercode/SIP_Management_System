import { Button, Form, Input, Modal, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../../_metronic/helpers'
import { deleteItem, fetchDocument } from '../../../../services/ApiCalls'
import { getFieldName } from '../ComponentsFactory'
import { EmplyeeDetails } from '../employeeFormEntry/EmployeeDetails'


const Employee = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [form] = Form.useForm()
  const [img, setImg] = useState();
  const [imgNew, setImgNew] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const tenantId = localStorage.getItem('tenant')
  console.log('tenantId: ', tenantId)
  const queryClient = useQueryClient()
  const { data: allEmployee } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allDepartments } = useQuery('department', () => fetchDocument('departments'), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroup', () => fetchDocument(`Paygroups/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitles', () => fetchDocument(`JobTitles/tenant/${tenantId}`), { cacheTime: 5000 })
  // const { data: allGrades } = useQuery('grades', () => fetchDocument('grades'), { cacheTime: 5000 })
  const [employeeData, setEmployeeData] = useState<any>({})
  const [beforeSearch, setBeforeSearch] = useState([])

  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const showDetailsModal = (record: any) => {
    setDetailsModalOpen(true)
    setEmployeeData(record)
  }

  const handleDetailsModalCancel = () => {
    setDetailsModalOpen(false)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    form.resetFields()
    setIsModalOpen(false)
  }

  const { mutate: deleteData } = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('employees')
    },
    onError: (error) => {
      console.log('delete error: ', error)
      message.error('Error deleting employee')
    }
  })

  function handleDelete(element: any) {
    const item = {
      url: 'employees',
      data: element
    }
    deleteData(item)
  }



  const columns: any = [
    {
      title: 'Profile',
      key: 'imageUrl',
      fixed: 'left',
      width: 270,
      render: (row: any) => {
        return (
          <EmployeeProfile employee={row} />
          // row.imageUrl !== null ?
          //   <img style={{ borderRadius: "10px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${row.imageUrl}`} width={50} height={50}></img> :
          //   <img style={{ borderRadius: "10px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`} width={50} height={50}></img>
        )
      }
    },
    // {
    //   title: 'ID',
    //   dataIndex: 'employeeId',
    //   fixed: 'left',
    //   width: 100,
    //   render: (text: any) => {
    //     return (<span className='badge badge-primary flex-wrap'>{text}</span>)
    //   },
    //   sorter: (a: any, b: any) => {
    //     if (a.employeeId > b.employeeId) {
    //       return 1
    //     }
    //     if (b.employeeId > a.employeeId) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },
    // {
    //   title: 'First Name',
    //   dataIndex: 'firstName',
    //   width: 120,
    //   sorter: (a: any, b: any) => {
    //     if (a.firstName > b.firstName) {
    //       return 1
    //     }
    //     if (b.firstName > a.firstName) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },

    // {
    //   title: 'Surname',
    //   dataIndex: 'surname',
    //   width: 120,
    //   sorter: (a: any, b: any) => {
    //     if (a.surname > b.surname) {
    //       return 1
    //     }
    //     if (b.surname > a.surname) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },
    {
      title: 'Email',
      dataIndex: 'email',
      // width: 180,
      key: 'email',
      // render: (row: any) => {
      //   return <a href={`mailto:${row}`}>{row}</a>
      // },
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
      // width: 120,
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
      title: 'Action',
      fixed: 'right',
      width: 270,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a className='btn btn-light-success btn-sm' onClick={() => showDetailsModal(record)}>
            Details
          </a>
          {/* <Link to={`/employee-details/${record.id}`}>
            <span className='btn btn-light-success btn-sm'>Details</span>
          </Link> */}
          <Link to={`/employee-edit-form/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Update</span>
          </Link>
          <a className='btn btn-light-danger btn-sm' onClick={() => handleDelete(record)}>
            Delete
          </a>
        </Space>
      ),

    },
  ]
  var out_data: any = {};

  // gridData.forEach(function (row: any) {
  //   if (out_data[row.departmentId]) {
  //     out_data[row.departmentId].push(row);
  //   } else {
  //     out_data[row.departmentId] = [row];
  //   }
  // });

  const loadData = async () => {
    setLoading(true)
    try {
      const response = allEmployee?.data
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
    setBeforeSearch(allEmployee?.data)
  }, [allEmployee?.data])

  const globalSearch = (searchValue: string) => {
    const searchResult = allEmployee?.data?.filter((item: any) => {
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
              // value={searchText}
              size='large'
            />
            {/* <Button type='primary' onClick={globalSearch} size='large'>
              Search
            </Button> */}
          </Space>
          <div className="card-toolbar">
            <Space style={{ marginBottom: 16 }}>
              <Link to='/employee-form'>
                <button type='button' className='btn btn-primary me-3'>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
              </Link>
              <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button>
            </Space>
          </div>
        </div>
      </div>

      <KTCardBody className='py-1 '>
        <div className='table-responsive'>
          {
            loading ? <Skeleton active /> :
              <Table columns={columns} dataSource={gridData} scroll={{ x: 1300 }} />
          }
        </div>
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
            employee?.employee?.imageUrl === null || employee?.employee?.imageUrl ===""?
            <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`}></img>:
              <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${employee?.employee?.imageUrl}`}></img> 
             
          }
        </div>
        <div className='col px-4 align-items-center align-content-center'>
          {/* <div className='row'> */}
          <div className='text-dark fw-bold fs-4'>{`${employee?.employee?.firstName} ${employee?.employee?.surname}`}</div>
          {/* <div className='text-gray-500'>{employee?.employee?.email}</div> */}
          {/* </div> */}
          <div className='badge badge-light-primary'>
            <span>{employee?.employee?.employeeId}</span>
          </div>
        </div>
      </div>
    </>
  )
}

export { Employee, EmployeeProfile }

