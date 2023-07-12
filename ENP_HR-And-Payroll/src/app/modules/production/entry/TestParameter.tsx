import { Button, Form, Input, InputNumber, Modal, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers'
import { Api_Endpoint, deleteItem, fetchAppraisals, fetchDocument, postItem, updateItem } from '../../../services/ApiCalls'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { set, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

const TestParameter = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const navigate = useNavigate();
  const param: any = useParams();
  const tenantId = localStorage.getItem('tenant')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempData, setTempData] = useState<any>()
  const [secondTempData, setSecondTempData] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const statusList = ['Active', 'Inactive']
  let [appraisalName, setAppraisalName] = useState<any>("")
  const { data: tableData, isLoading } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 5000 })
  const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument('appraisals'), { cacheTime: 5000 })

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    reset()
    setIsModalOpen(false)
    setIsUpdateModalOpen(false)
    setTempData(null)
  }

  const handleChange = (event: any) => {
    event.preventDefault()
    setTempData({ ...tempData, [event.target.name]: event.target.value });
  }


  const loadData = async () => {
    setLoading(true)
    try {
      setGridData(tableData?.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const { mutate: deleteData } = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('parameters')
      // loadData()
    },
    onError: (error) => {
      console.log('delete error: ', error)
      message.error('Error deleting record')
    }
  })

  function handleDelete(element: any) {
    const item = {
      url: 'parameters',
      data: element
    }
    deleteData(item)
  }

  const columns: any = [

    {
      title: 'Code',
      dataIndex: 'code',
      sorter: (a: any, b: any) => {
        if (a.code > b.code) {
          return 1
        }
        if (b.code > a.code) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Weight per parameter (%)',
      dataIndex: 'weight',
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
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Link to={`/new-employee-objectives/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Objectives</span>
          </Link>
          <a onClick={() => showUpdateModal(record)} className='btn btn-light-warning btn-sm'>
            Update
          </a>
          <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
            Delete
          </a>

        </Space>
      ),

    },
  ]


  const getItemName = async (param: any) => {
    let newName = null
    const itemTest = await allAppraisals?.data.find((item: any) =>
      item.id.toString() === param
    )
    newName = await itemTest
    return newName
  }


  const dataByID = tableData?.data?.filter((section: any) => {
    return section.appraisalId?.toString() === '12'
  })

  useEffect(() => {
    (async () => {
      let res = await getItemName(param.id)
      setAppraisalName(res?.name)
    })();
    loadData()
  }, [])



  const handleInputChange = (e: any) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
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

  // to find the sum of weights per appraisal needed for validation
  const weightSum = (itemToPost: any) => {
    return tableData?.data.filter((item: any) => item.appraisalId === itemToPost.appraisalId)
      .map((item: any) => item.weight)
      .reduce((a: any, b: any) => a + b, 0);
  };

  const { mutate: updateData } = useMutation(updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('parameters')
      loadData()
      reset()
      setIsUpdateModalOpen(false)
      setTempData({})
      setSecondTempData({})
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.log('error: ', error)
    }
  })

  const handleUpdate = (e: any) => {
    e.preventDefault()

    // make sure tempData properties are not empty
    if (!tempData.name || !tempData.code || !tempData.weight || tempData.weight === '') {
      return message.error('Please fill all fields');
    } else if (parseInt(tempData.weight) <= 0) {
      return message.error('Weight cannot be zero or negative')
    } else if (parseInt(tempData.weight) > 100) {
      message.error('Weight cannot be greater than 100')
      setLoading(false)
      return
    }

    // check if tempData is the same as secondTempData
    if (tempData.name === secondTempData.name && tempData.code === secondTempData.code) {
      // check if weight is greater than 100
      if ((weightSum(tempData) - secondTempData.weight) + parseInt(tempData.weight) > 100) {
        return message.error(`Total weight for ${appraisalName} cannot be greater than 100`);
      } else {
        const item = {
          url: 'Parameters',
          data: tempData
        }
        updateData(item)
      }
    } else {
      //cheeck if new name already exists
      const itemExists = gridData.find((item: any) =>
        item.name === tempData.name &&
        item.code === tempData.code
      )

      if (itemExists) {
        return message.error(`Parameter with name ${tempData.name} and code ${tempData.code} already exists`);
      } else {
        // check if weight is greater than 100
        if ((weightSum(tempData) - secondTempData.weight) + parseInt(tempData.weight) > 100) {
          return message.error(`Total weight for ${appraisalName} cannot be greater than 100`);
        } else {
          const item = {
            url: 'Parameters',
            data: tempData
          }
          console.log('update', item)
          updateData(item)
        }
      }
    }
  }

  const showUpdateModal = (values: any) => {
    showModal()
    setIsUpdateModalOpen(true)
    setTempData(values);
    setSecondTempData(values);
  }



  const OnSubmit = handleSubmit(async (values) => {
    setLoading(true)

    // make sure all values have been entered
    if (!values.name || !values.code || !values.weight || values.weight === '') {
      setLoading(false)
      return message.error('Please fill all fields');
    } else if (parseInt(values.weight) <= 0) {
      message.error('Weight cannot be zero or negative')
      setLoading(false)
      return
    } else if (parseInt(values.weight) > 100) {
      message.error('Weight cannot be greater than 100')
      setLoading(false)
      return
    }

    const itemToPost = {
      data: {
        appraisalId: parseInt(param.id),
        name: values.name,
        code: values.code,
        tenantId: tenantId,
        status: 1, //parseInt(values.status),
        weight: parseInt(values.weight)
      },
      url: 'parameters'
    }

    // check if item already exists
    const itemExists = gridData.find((item: any) =>
      item.name === itemToPost.data.name &&
      item.code === itemToPost.data.code &&
      item.appraisalId === itemToPost.data.appraisalId &&
      item.tenantId === itemToPost.data.tenantId
    )
    if (itemExists) {
      setLoading(false)
      return message.error('Item already exists');
    }

    const sums = weightSum(itemToPost.data)

    if (sums > 0) {
      if (sums + itemToPost.data.weight > 100) {
        setLoading(false)
        return message.error(`Total weight for ${appraisalName} cannot be greater than 100`);
      } else {
        postData(itemToPost)
      }
    } else {
      postData(itemToPost)
    }
  })

  const { mutate: postData } = useMutation(postItem, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('parameters')
      // queryClient.setQueryData('parameters', (old: any) => [...old, data])
      // loadData()
      reset()
      setTempData({})
      setIsModalOpen(false)
      setSubmitLoading(false)
      message.success('Item added successfully')
    },
    onError: (error: any) => {
      setSubmitLoading(false)
      console.log('post error: ', error)
    }
  })

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
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
            {/* <Space style={{ marginBottom: 16 }}>
              <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>

              <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button>
            </Space> */}
          </div>
          {
            isLoading ? <Skeleton active /> :
              <Table columns={columns} dataSource={dataByID}/>
          }
          
        </div>
      </KTCardBody>
    </div>
  )
}

export { TestParameter }