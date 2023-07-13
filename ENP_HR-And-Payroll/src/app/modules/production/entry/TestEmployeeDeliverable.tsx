

import { Button, Input, Modal, Skeleton, Space, Table } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers'
import { Api_Endpoint, deleteItem, fetchDocument } from '../../../services/ApiCalls'

const TestEmployeeDeliverable = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const navigate = useNavigate();
  const [tempData, setTempData] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedOption2, setSelectedOption2] = useState("");
  let [appraisalName, setAppraisalName] = useState<any>("")

  const { data: allAppraisals } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 5000 })

  const handleOptionChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const tenantId = localStorage.getItem('tenant')
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

  const { mutate: deleteData} = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('appraisalDeliverables')
      loadData()
    },
    onError: (error) => {
      console.log('delete error: ', error)
    }
  })

  function handleDelete(element: any) {
    const item = {
      url: 'Appraisals',
      data: element
    }
    deleteData(item)
  }

  const columns: any = [

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
      title: 'Description',
      dataIndex: 'description',
      sorter: (a: any, b: any) => {
        if (a.description > b.description) {
          return 1
        }
        if (b.description > a.description) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Sub Weight',
      dataIndex: 'subWeight',
      sorter: (a: any, b: any) => {
        if (a.subWeight > b.subWeight) {
          return 1
        }
        if (b.subWeight > a.subWeight) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Unit Of Measure',
      dataIndex: 'unitOfMeasure',
      sorter: (a: any, b: any) => {
        if (a.unitOfMeasure > b.unitOfMeasure) {
          return 1
        }
        if (b.unitOfMeasure > a.unitOfMeasure) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Target',
      dataIndex: 'target',
      sorter: (a: any, b: any) => {
        if (a.target > b.target) {
          return 1
        }
        if (b.target > a.target) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (record: any) => (
        <Space size='middle'>
          {/* <a onClick={() => showUpdateModal(record)} className='btn btn-light-warning btn-sm'>
            Update
          </a>
          <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
            Delete
          </a> */}

        </Space>
      ),

    },
  ]

  const loadData = async () => {
    setLoading(true)
    try {
      setGridData(allAppraisals?.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadData()
  }, [])


  const handleInputChange = (e: any) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      queryClient.invalidateQueries('appraisalDeliverables')
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

  const queryClient = useQueryClient()

  const showUpdateModal = (values: any) => {
    setIsModalOpen(true)
    setIsUpdateModalOpen(true)
    setTempData(values);
  }

  const url = `${Api_Endpoint}/AppraisalDeliverable`
  const urlUpdate = `${Api_Endpoint}/AppraisalDeliverable/${tempData?.id}`
  const OnSUbmit = handleSubmit(async (values) => {
    setLoading(true)
    const data = {
      tenantId: tenantId,
      code: values.code,
      name: values.name,
    }
    const dataUpdate = {
      id: tempData.id,
      tenantId: tenantId,
      code: values.code,
      name: values.name,
    }
    console.log(data)

    const newData = gridData.filter((item: any) => item.code == data.code)

    if (!isUpdateModalOpen) {
      if (newData.length == 0) {
        try {
          const response = await axios.post(url, data)
          setSubmitLoading(false)
          reset()
          setIsModalOpen(false)
          loadData()
          queryClient.invalidateQueries('AppraisalDeliverables')
          return response.statusText
        } catch (error: any) {
          setSubmitLoading(false)
          return error.statusText
        }
      }
      window.alert("The Code you entered already exist!");
    }

    try {
      const response = await axios.put(urlUpdate, dataUpdate)
      setSubmitLoading(false)
      reset()
      setIsModalOpen(false)
      setIsUpdateModalOpen(false)
      loadData()
      queryClient.invalidateQueries('appraisalDeliverables')
      return response.statusText
    } catch (error: any) {
      setSubmitLoading(false)
      return error.statusText
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
        <h3 style={{ fontWeight: "bolder" }}>{appraisalName}</h3>
          <br></br>
          <button className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' onClick={() => navigate(-1)}>Go Back</button>
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
              <Table columns={columns} dataSource={gridData} />
          }
          {/* <Table columns={columns} dataSource={dataByID} loading={loading} /> */}
          <Modal
            title={isUpdateModalOpen ? "Update Deliverable" : 'Add Deliverable'}
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
                loading={submitLoading}
                onClick={OnSUbmit}
              >
                Submit
              </Button>,
            ]}
          >
            <form
              onSubmit={OnSUbmit}
            >
              <hr></hr>
              <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Code </label>
                  <input type="text" {...register("code")} defaultValue={isUpdateModalOpen ? tempData?.code : ''} onChange={handleChange} className="form-control form-control-solid" />

                </div>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Name </label>
                  <input type="text" {...register("name")} defaultValue={isUpdateModalOpen ? tempData?.name : ''} onChange={handleChange} className="form-control form-control-solid" />
                </div>

              </div>
            </form>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export { TestEmployeeDeliverable }



