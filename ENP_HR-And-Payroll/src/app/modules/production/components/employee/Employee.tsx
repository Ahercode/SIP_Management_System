import { Button, Form, Input, Skeleton, Space, Table, message } from 'antd'
import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../../_metronic/helpers'
import { deleteItem, fetchDocument } from '../../../../services/ApiCalls'
import { getFieldName } from '../ComponentsFactory'


const Employee = () => {
  const [gridData, setGridData] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm()
  const [img, setImg] = useState();
  const [imgNew, setImgNew] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const tenantId = localStorage.getItem('tenant')
  console.log('tenantId: ', tenantId)
  const queryClient = useQueryClient()
  const { data: allEmployee, isLoading } = useQuery('employees', () => fetchDocument('employees'), { cacheTime: 5000 })
  const { data: allDepartments } = useQuery('department', () => fetchDocument('departments'), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroup', () => fetchDocument('paygroups'), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitles', () => fetchDocument('jobtitles'), { cacheTime: 5000 })
  const { data: allGrades } = useQuery('grades', () => fetchDocument('grades'), { cacheTime: 5000 })


  const showModal = () => {
    setIsModalOpen(true)
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
      message.error('Error deleting record')
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
      render: (row: any) => {

        return (
          row.imageUrl !== null ?
            <img style={{ borderRadius: "10px" }} src={`http://208.117.44.15/hrwebapi/uploads/employee/${row.imageUrl}`} width={50} height={50}></img> :
            <img style={{ borderRadius: "10px" }} src={`http://208.117.44.15/hrwebapi/uploads/employee/ahercode1.jpg`} width={50} height={50}></img>
        )
      }
    },
    {
      title: 'EmployeeID',
      dataIndex: 'employeeId',
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
      sorter: (a: any, b: any) => {
        if (a.firstName > b.firstName) {
          return 1
        }
        if (b.firstName > a.firstName) {
          return -1
        }
        return 0
      },
    },

    {
      title: 'Surname',
      dataIndex: 'surname',
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
    //   title: 'Gender',
    //   dataIndex: 'gender',
    //   sorter: (a: any, b: any) => {
    //     if (a.gender > b.gender) {
    //       return 1
    //     }
    //     if (b.gender > a.gender) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },
    {
      title: 'Paygroup',
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
      title: 'Email',
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
      title: 'job Title',
      key: 'jobTitle',
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
      key: 'departmentId',
      render: (row: any) => {
        return getFieldName(row.departmentId, allDepartments?.data)
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
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Link to={`/employee-edit-form/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Update</span>
          </Link>
          <Link to={`/employee-details/${record.id}`}>
            <span className='btn btn-light-success btn-sm'>Details</span>
          </Link>
        </Space>
      ),

    },
  ]



  // const loadData = async () => {
  //   setLoading(true)
  //   try {
  //     const response = await axios.get(`${Api_Endpoint}/Employees/tenant/${tenantId}`,
  //     )
  //     setGridData(response.data)
  //     setLoading(false)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // useEffect(() => {
  //   loadData()
  // }, [])


  var out_data: any = {};

  gridData.forEach(function (row: any) {
    if (out_data[row.departmentId]) {
      out_data[row.departmentId].push(row);
    } else {
      out_data[row.departmentId] = [row];
    }
  });



  const dataWithIndex = allEmployee?.data.map((item: any, index: any) => ({
    ...item,
    key: index,
  }))

  const handleInputChange = (e: any) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      // loadData()
    }
  }

  const globalSearch = () => {
    // @ts-ignore
    filteredData = dataWithIndex.filter((value) => {
      return (
        value.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
        value.surname.toLowerCase().includes(searchText.toLowerCase()) ||
        value.gender.toLowerCase().includes(searchText.toLowerCase()) ||
        value.employeeId.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
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
      <KTCardBody className='py-1 '>
        <div className='table-responsive'>

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
          {
            isLoading ? <Skeleton active /> :
              <Table columns={columns} dataSource={dataWithIndex} loading={isLoading} />
          }
        </div>
      </KTCardBody>
    </div>
  )
}

export { Employee }

