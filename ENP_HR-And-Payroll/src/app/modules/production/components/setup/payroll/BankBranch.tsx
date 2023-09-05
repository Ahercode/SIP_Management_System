import { Button, Input, Modal, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { KTCardBody, KTSVG } from '../../../../../../_metronic/helpers'
import { Api_Endpoint, deleteItem, fetchDocument, postItem, updateItem } from '../../../../../services/ApiCalls'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const BankBranch = () => {
  const [gridData, setGridData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const tenantId = localStorage.getItem('tenant')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [tempData, setTempData] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const param: any = useParams();
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalOpen(true)
  }
  const [beforeSearch, setBeforeSearch] = useState([])
  let [itemName, setItemName] = useState<any>("")

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

  const { mutate: deleteData, isLoading: deleteLoading } = useMutation(deleteItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['BankBranches', tempData], data);
      loadData()
    },
    onError: (error) => {
      console.log('delete error: ', error)
    }
  })

  function handleDelete(element: any) {
    const item = {
      url: '',
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
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
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


  const { data: allBanks } = useQuery('banks',()=>  fetchDocument(`Banks/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: bankBranches } = useQuery('bankBranches',()=>  fetchDocument(`BankBranches/tenant/${tenantId}`), { cacheTime: 5000 })


  const loadData = async () => {
    setLoading(true)
    try {
      const response = await  axios.get(`${Api_Endpoint}/BankBranches/tenant/${tenantId}`)
      // const response = await  axios.get(`${Api_Endpoint}/BankBranches/tenant/${tenantId}}`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const getItemName = async (param: any) => {
    let newName = null
    const itemTest = await allBanks?.data.find((item: any) => item.id === param)
    console.log("itemTest: ",itemTest)
    newName = itemTest?.name
    return newName
  }

  useEffect(() => {
    (async () => {
      let res = await getItemName(parseInt(param.id))
      setItemName(res)
      console.log("bank name: ",res)
    })();
    loadData()
    setBeforeSearch(bankBranches?.data)
  }, [])

  const dataByID = gridData?.filter((section: any) => {
    return section.bankId?.toString() === param.id
  })


  const { isLoading: updateLoading, mutate: updateData } = useMutation(updateItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['BankBranches', tempData], data);
      reset()
      setTempData({})
      loadData()
      setIsUpdateModalOpen(false)
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.log('error: ', error)
    }
  })

  const handleUpdate = (e: any) => {
    e.preventDefault()
    const item = {
      url: 'BankBranches',
      data: tempData
    }
    updateData(item)
    console.log('update: ', item.data)
  }

  const showUpdateModal = (values: any) => {
    showModal()
    setIsUpdateModalOpen(true)
    setTempData(values);
    console.log(values)
  }

  const { mutate: postData, isLoading: postLoading } = useMutation(postItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['BankBranches', tempData], data);
      reset()
      setTempData({})
      loadData()
      setIsModalOpen(false)
    },
    onError: (error) => {
      console.log('post error: ', error)
    }
  })

  const OnSubmit = handleSubmit(async (values) => {
    setLoading(true)
    const endpoint = 'BankBranches'

    const item = {
      data: {
        code: values.code,
        name: values.name,
        bankId: parseInt(param?.id),
      },
      url: endpoint
    }
    console.log(item.data)
    postData(item)
  })

  const globalSearch = (searchValue: string) => {
    const searchResult = bankBranches?.data?.filter((item: any) => {
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
          <h3 style={{ fontWeight: "bolder" }}>{itemName} </h3>
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
                // value={searchText}
              />
              {/* <Button type='primary' onClick={globalSearch}>
                Search
              </Button> */}
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
          <Table columns={columns} dataSource={dataByID} />
          <Modal
            title={isUpdateModalOpen ? 'Update Branch' : 'Add New Branch'}
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
              <div style={{ padding: "20px 20px 0 20px" }} className=''>
                <div className='mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Code</label>
                  <input type="text"
                    {...register("code")}
                    defaultValue={isUpdateModalOpen === true ? tempData.code : ''}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div>
                <div className='mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                  <input type="text"
                    {...register("name")}
                    defaultValue={isUpdateModalOpen === true ? tempData.name : ''}
                    onChange={handleChange}
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

export { BankBranch }


