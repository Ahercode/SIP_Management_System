import { ArrowLeftOutlined } from "@ant-design/icons"
import { Button, Input, Modal, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'
import { deleteItem, fetchDocument, postItem, updateItem } from '../../../../../services/ApiCalls'


const Parameter = () => {
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
          {/* <Link to={`/objectives/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Objectives</span>
          </Link> */}
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
    return section.appraisalId?.toString() === param.id
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
      const itemExists = gridData?.find((item: any) =>
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
          <Space className='d-flex align-items-center align-content-center mb-3 flex-direction-row' >
            <Button
              onClick={() => navigate(-1)}
              className="btn btn-light-primary me-4"
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
              }}
              type="primary" shape="circle" icon={<ArrowLeftOutlined rev={''} />} size={'large'}
            />
            <span className="fw-bold text-gray-600 d-block fs-2 mb-3 ">{appraisalName}</span>
          </Space>
          
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
            isLoading ? <Skeleton active /> :
              <Table columns={columns} dataSource={dataByID} />
          }
          <Modal
            title={isUpdateModalOpen ? 'Parameter Update' : 'Parameter Setup'}
            open={isModalOpen}
            onCancel={handleCancel}
            closable={true}
            footer={[
              <Button key='back' onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key='submit'
                type='primary'
                htmlType='submit'
                onClick={isUpdateModalOpen ? handleUpdate : OnSubmit}
              >
                Submit
              </Button>,
            ]}
          >
            <form
              onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmit}
            >
              <hr></hr>
              <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Code</label>
                  <input
                    {...register("code")}
                    defaultValue={isUpdateModalOpen === true ? tempData.code : ''}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div>
                <div className='mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                  <input
                    {...register("name")}
                    defaultValue={isUpdateModalOpen === true ? tempData.name : ''}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div>
                <div className='mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">{`Parameter Weight (%)`}</label>
                  <input
                    {...register("weight")} type='number'
                    defaultValue={isUpdateModalOpen === true ? tempData.weight : 0}
                    onChange={handleChange}
                    max={100}
                    min={0}
                    className="form-control form-control-solid" />
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export { Parameter }
