import { Button, Input, Modal, Skeleton, Space, Table, message } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers'
import { Api_Endpoint, deleteItem, fetchDocument, postItem, updateItem } from '../../../services/ApiCalls'
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useAuth } from '../../auth'


const EmployeeObjectiveEntry = () => {
  const [gridData, setGridData] = useState([])
  const { currentUser } = useAuth()
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const navigate = useNavigate();
  const [tempData, setTempData] = useState<any>()
  const [secondTempData, setSecondTempData] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()
  const [pathData, setPathData] = useState<any>("")


  const { data: appraisalobjectives, isLoading: loading } = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 5000 })
  const { data: parameterData } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })



  const tenantId = localStorage.getItem('tenant')
  const showModal = () => {
    setIsModalOpen(true)
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

  const { mutate: deleteData } = useMutation(deleteItem, {
    onSuccess: () => {
      message.warning('Objective deleted successfully')
      queryClient.invalidateQueries(`appraisalObjectives`)
    },
    onError: (error) => {
      console.log('delete error: ', error)
      message.error('Error deleting record')
    }
  })

  function handleDelete(element: any) {
    const item: any = {
      url: 'AppraisalObjective',
      data: element
    }
    deleteData(item)
  }

  const showUpdateModal = (values: any) => {
    setIsUpdateModalOpen(true)
    setTempData(values);
    setSecondTempData(values);
    showModal()
  }


  const columns: any = [

    {
      title: 'Objective',
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
      title: 'Weight',
      dataIndex: 'weight',
      sorter: (a: any, b: any) => {
        if (a.weight > b.weight) {
          return 1
        }
        if (b.weight > a.weight) {
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
          <Link to={`/deliverableEntry/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Deliverables</span>
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

  const loadData = async () => {
    try {
      setGridData(appraisalobjectives?.data?.filter((item: any) => item?.parameterId.toString() === param?.parameterId && item?.employeeId === currentUser?.id))
      setPathData(getItemData(param?.parameterId, parameterData?.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadData()
  }, [appraisalobjectives?.data, currentUser?.id, parameterData?.data, param?.parameterId])

  const getItemData = (fieldProp: any, data: any) => {
    const item = data?.find((item: any) =>
      item?.id.toString() === fieldProp
    )
    return item
  }


  const weightSum = (itemToPost: any) => {
    return appraisalobjectives?.data.filter((item: any) => item.parameterId === itemToPost.parameterId && item.employeeId === currentUser?.id)
      .map((item: any) => item.weight)
      .reduce((a: any, b: any) => a + b, 0)
  };


  const { mutate: updateData } = useMutation(updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`appraisalObjectives`)
      loadData()
      reset()
      setTempData({})
      setSecondTempData({})
      setIsUpdateModalOpen(false)
      setIsModalOpen(false)
      message.success('Objective updated successfully')
    },
    onError: (error) => {
      console.log('error: ', error)
      message.error('Error updating item')
    }
  })

  const handleUpdate = async (e: any) => {
    e.preventDefault()
    // input validation
    // make sure all values are filled
    if (!tempData.name || !tempData.weight || tempData.weight === '') {
      return message.error('Please fill all fields')
    } else if (parseInt(tempData.weight) <= 0) {
      return message.error('Weight cannot be zero or negative')
    } else if (parseInt(tempData.weight) > 100) {
      message.error('Weight cannot be greater than 100')
      return
    }

    //logic validatio

    if (tempData.name === secondTempData.name && tempData.description === secondTempData.description) {
      if ((weightSum(tempData) - secondTempData.weight) + parseInt(tempData.weight) > pathData?.weight) {
        return message.error(`Total weight for ${pathData?.name} cannot be greater than ${pathData?.weight}`);
      } else {
        const item: any = {
          url: `appraisalObjective`,
          data: tempData
        }
        updateData(item)
      }
    } else {
      //cheeck if new name already exists
      const itemExists = gridData.find((item: any) =>
        item.name === tempData.name &&
        item.code === tempData.description
      )

      if (itemExists) { return message.error('Objective already exists') } else {
        if ((weightSum(tempData) - secondTempData.weight) + parseInt(tempData.weight) > pathData?.weight) {
          return message.error(`Total weight for ${pathData} cannot be greater than ${pathData?.weight}`);
        } else {
          const item: any = {
            url: `appraisalObjective`,
            data: tempData
          }
          updateData(item)
        }
      }
    }
  }


  const OnSubmit = handleSubmit(async (values) => {
    // input validations
    // make sure all values are filled
    if (!values.name || values.weight === '') {
      message.error('Please fill all fields')
      return
    } else if (parseInt(values.weight) <= 0) {
      message.error('Weight cannot be zero or negative')
      return
    } else if (parseInt(values.weight) > 100) {
      message.error('Weight cannot be greater than 100')
      return
    }

    const itemToPost = {
      data: {
        name: values.name,
        parameterId: parseInt(param.parameterId),
        description: "description",
        weight: parseInt(values.weight),
        tenantId: tenantId,
        referenceId: '',
        employeeId: currentUser?.id, //use logged in employee id here
        comment: "",
        status: "Pending",
      },
      url: `appraisalObjective`,
    }


    // check if item already exist
    const itemExist = gridData.find((item: any) =>
      item.name === itemToPost.data.name &&
      item.parameterId === itemToPost.data.parameterId &&
      item.description === itemToPost.data.description &&
      item.weight === itemToPost.data.weight
    )
    if (itemExist) {
      message.error('Objective already exist')
      return
    }

    const sums = weightSum(itemToPost.data)

    if (sums > 0 || itemToPost.data.weight > 0) {
      if (parseInt(sums + itemToPost.data.weight) > parseInt(pathData?.weight) || itemToPost.data.weight > pathData?.weight) {
        console.log("what I got: ",sums + itemToPost.data.weight)
        return message.error(`Total weight for ${pathData?.name} cannot be greater than ${pathData?.weight}`);
      } else {
        console.log('item to post: ', itemToPost)
        postData(itemToPost)
      }
    } else {
      console.log('item to post: ', itemToPost)
      message.error(`Total weight for ${pathData?.name} is less than 0!`);
      // postData(itemToPost)
    }
  })

  const { mutate: postData } = useMutation(postItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`appraisalObjectives`)
      reset()
      setTempData({})
      setSecondTempData({})
      loadData()
      setIsModalOpen(false)
      message.success('Objective added successfully')
    },
    onError: (error: any) => {
      console.log('post error: ', error)
      message.error('Error adding item')
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
          <div className="mb-5 d-flex justify-content-between align-items-center align-content-center">
            <Space className=''>
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
              <div className="d-flex flex-direction-row align-items-center justify-content-start align-content-center text-gray-600">
                <span className="fw-bold d-block fs-2">{`${pathData?.name}`}</span>
                  <div className="bullet bg-danger ms-4"></div>
                <span className=' fs-2 ms-4 fw-bold'>{`${pathData?.weight}%`}</span>
              </div>
              {/* {
                parameterData?.data?.map((item: any) => (
                  <div className="d-flex flex-direction-row align-items-center justify-content-start align-content-center text-gray-600">
                    <span className="fw-bold d-block fs-2">{`${item?.name}`}</span>
                    <div className="bullet bg-danger ms-4"></div>
                    <span className=' fs-2 ms-4 fw-bold'>{`${item?.weight}%`}</span>
                  </div>
                ))
              } */}
              
            </Space>
            <Space style={{ marginBottom: 16 }}>
              
              <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>
              
            </Space>
          </div>
          {
            loading ? <Skeleton active /> :
              <Table columns={columns} dataSource={gridData} />
          }
          <Modal
            title={isUpdateModalOpen ? "Update Objective" : 'Add Objective'}
            open={isModalOpen}
            onCancel={handleCancel}
            width={500}
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
                  <label htmlFor="exampleFormControlInput1" className="form-label">Objective </label>
                  <input type="text" {...register("name")} defaultValue={isUpdateModalOpen ? tempData?.name : ''} onChange={handleChange} className="form-control form-control-solid" />
                </div>
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Weight </label>
                  <input type="number" min={0} max={100} {...register("weight")} defaultValue={isUpdateModalOpen ? tempData?.weight : ''} onChange={handleChange} className="form-control form-control-solid" />
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}
export { EmployeeObjectiveEntry }




