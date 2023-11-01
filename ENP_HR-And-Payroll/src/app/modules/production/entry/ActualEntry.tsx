import { Button, Modal, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers'
import { Api_Endpoint, deleteItem, fetchDocument, postItem, updateItem } from '../../../services/ApiCalls'
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useAuth } from '../../auth'


const ActualEntry = () => {
  const [gridData, setGridData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();   
  const navigate = useNavigate();
  const [tempData, setTempData] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [secondTempData, setSecondTempData] = useState<any>()
  const [pathData, setPathData] = useState<any>("")
  const { currentUser } = useAuth()
  const { data: allObjectiveDeliverables, isLoading: loading } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 5000 })
  const { data: appraisalobjectives } = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 5000 })
  const { data: allApraisalActual } = useQuery('apraisalActuals', () => fetchDocument('ApraisalActuals'), { cacheTime: 5000 })
  const queryClient = useQueryClient()


  const tenantId = localStorage.getItem('tenant')
  const showModal = () => {
    setIsModalOpen(true)
  }

//   get all objvetives from appraisalobjectives where employeeId = current employeeId



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
      queryClient.invalidateQueries('appraisalDeliverables')
      message.warning('Deliverable deleted successfully')
      loadData()
    },
    onError: (error) => {
      console.log('delete error: ', error)
    }
  })

  function handleDelete(element: any) {
    const item = {
      url: 'AppraisalDeliverable',
      data: element
    }
    deleteData(item)
  }

  const columns: any = [

    {
      title: 'Actual',
      dataIndex: 'actual',
      sorter: (a: any, b: any) => {
        if (a.actual > b.actual) {
          return 1
        }
        if (b.actual > a.actual) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Employee Comment',
      dataIndex: 'individualComment',
      sorter: (a: any, b: any) => {
        if (a.individualComment > b.individualComment) {
          return 1
        }
        if (b.individualComment > a.individualComment) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Line Manager Comment',
      dataIndex: 'lineManagerComment',
      sorter: (a: any, b: any) => {
        if (a.lineManagerComment > b.lineManagerComment) {
          return 1
        }
        if (b.lineManagerComment > a.lineManagerComment) {
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
          <a onClick={() => showUpdateModal(record)} className='btn btn-light-warning btn-sm'>
            Update
          </a>
        </Space>
      ),
    },
  ]

  const showUpdateModal = (values: any) => {
    setIsUpdateModalOpen(true)
    setTempData(values);
    setSecondTempData(values);
    showModal()
  }

  const loadData = async () => {
    try {

        const filteredDeliverables = allApraisalActual?.data.filter((item: any) =>
            item.deliverableId?.toString() === param?.id
        )

      setGridData(filteredDeliverables)
      setPathData(getItemData(param?.objectiveId, appraisalobjectives?.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadData()
  }, [allApraisalActual?.data])

  const getItemData = (fieldProp: any, data: any) => {
    const item = data?.find((item: any) =>
      item?.id.toString() === fieldProp
    )
    return item
  }

  const { mutate: updateData } = useMutation(updateItem, {
    onSuccess: async(newData: any) => {
      queryClient.invalidateQueries(`apraisalActuals`)
      reset()
      setTempData({})
      setSecondTempData({})
      setIsUpdateModalOpen(false)
      setIsModalOpen(false)
      message.success('Deliverable updated successfully')
    },
    onError: (error) => {
      console.log('error: ', error)
      message.error('Error updating item')
    }
  })

  const handleUpdate = async (e: any) => {
    e.preventDefault()
        const item: any = {
          url: 'ApraisalActuals',
          data: tempData
        }
        updateData(item)
     
    
  }
  
  const OnSubmit = handleSubmit(async (values) => {
      const itemToPost = {
          data: {
              deliverableId: parseInt(param.id),
              individualComment: values.individualComment,
              lineManagerComment: '',
              actual: parseFloat(values.actual).toFixed(2),
            //   tenantId: tenantId
            },
            url: `ApraisalActuals`,
        }
    console.log('itemToPost: ', itemToPost.data)
        postData(itemToPost)
   
    
  })

  const { mutate: postData } = useMutation(postItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`apraisalActuals`)
      reset()
      setTempData({})
      setSecondTempData({})
      setIsModalOpen(false)
      message.success('Deliverable added successfully')
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
                <span className="fw-bold d-block fs-2">Go back</span>
                {/* <span className="fw-bold d-block fs-2">{`${pathData?.name}`}</span> */}
                {/* <div className="bullet bg-danger ms-4"></div>
                <span className=' fs-2 ms-4 fw-bold'>{`100%`}</span> */}
              </div>
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
              <Table columns={columns} 
              dataSource={gridData} 
              />
          }
          <Modal
            title={isUpdateModalOpen ? "Update Actual" : 'Add Actual'}
            open={isModalOpen}
            onCancel={handleCancel}
            width={600}
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
              <div style={{ padding: "0px 20px 20px 20px" }} className='mb-0 '>
                {/* <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Unit of measure</label>
                  <select {...register("unitOfMeasureId")}
                    value={isUpdateModalOpen === true ? tempData?.unitOfMeasureId : null}
                    onChange={handleChange} className="form-select form-select-solid" aria-label="Select example">
                    {isUpdateModalOpen === false ? <option value="Select">Select</option> : null}
                    {
                      allUnitsOfMeasure?.data.map((item: any) => (
                        <option value={item.id}>{`${item?.name}`}</option>
                      ))
                    }
                  </select>
                </div> */}
                <div className=' mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Actual</label>
                  <input
                    {...register("actual")} type='number' min='0'
                    defaultValue={isUpdateModalOpen === true ? tempData.actual : 0}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div>
                <div className='mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Employee's Comment</label>
                  <textarea
                    {...register("individualComment")}
                    // type='text'
                    defaultValue={isUpdateModalOpen === true ? tempData.individualComment : null}
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

export { ActualEntry }




