import { Button, Input, Modal, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG, checkIsActive } from '../../../../_metronic/helpers'
import { Api_Endpoint, deleteItem, fetchDocument, postItem, updateItem } from '../../../services/ApiCalls'
import { ArrowLeftOutlined } from "@ant-design/icons"
import { getFieldName } from '../components/ComponentsFactory'
import { check } from 'prettier'


const EmployeeDeliverableEntry = () => {
  const [gridData, setGridData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();   
  const navigate = useNavigate();
  const [tempData, setTempData] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [secondTempData, setSecondTempData] = useState<any>()
  // let [appraisalName, setAppraisalName] = useState<any>("")
  const [pathData, setPathData] = useState<any>("")

  const { data: allObjectiveDeliverables, isLoading: loading } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 5000 })
  const { data: appraisalobjectives } = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 5000 })
  const { data: allUnitsOfMeasure } = useQuery('unitofmeasures', () => fetchDocument('unitofmeasures'), { cacheTime: 5000 })
  const queryClient = useQueryClient()
  const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })
  const { data: allParameters } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 10000 })


  const checkActive = allReviewdates?.data?.find((item: any) => {
    return item?.isActive?.trim() === "active"
  })

  const sameObjective = appraisalobjectives?.data?.filter((item: any) => item?.tag?.trim() === "same" && item?.id.toString() === param.objectiveId)

  console.log('sameObjective: ', sameObjective)
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
      render:(record:any)=>{
        return (
          <>
            <span style={{ fontSize:"16px"}} 
              className={ `badge ${record?.goodBad?.trim() === "good"? 'badge-light-success' : 
              "badge-light-danger"}  fw-bolder` }>
              {record?.goodBad?.trim() === "good"? "Good": record?.goodBad?.trim() === "bad"?"Bad":""}
            </span>
          </>
        )
      }
    },
    {
      title: 'Deliverable',
      dataIndex: 'description',
      render: (record: any) => {
        const pointsArray = record?.trim()?.split(/\n(?=\d+\.|\u2022)/).filter(Boolean)
        return (
          <>
            <ul>
              {pointsArray?.map((point: any) => (
                <p>{point}</p>
              ))}
            </ul>
          </>
        )
        },
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
      key: 'unitOfMeasureId',
      sorter: (a: any, b: any) => {
        if (a.unitOfMeasureId > b.unitOfMeasureId) {
          return 1
        }
        if (b.unitOfMeasureId > a.unitOfMeasureId) {
          return -1
        }
        return 0
      },
      render: (record: any) => {
        return getFieldName(record?.unitOfMeasureId, allUnitsOfMeasure?.data)
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
        checkActive?.tag?.trim()==="final"?"":
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

  if (sameObjective?.length>0) {
    columns.splice(5, 1)
  }

  const showUpdateModal = (values: any) => {
    setIsUpdateModalOpen(true)
    setTempData(values);
    setSecondTempData(values);
    showModal()
  }

  const loadData = async () => {
    try {
      const neewData = allObjectiveDeliverables?.data?.filter((item: any) => item?.objectiveId?.toString() === param.objectiveId)
      setGridData(neewData)
      setPathData(getItemData(param?.objectiveId, appraisalobjectives?.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadData()
  }, [allObjectiveDeliverables?.data])

  const getItemData = (fieldProp: any, data: any) => {
    const item = data?.find((item: any) =>
      item?.id.toString() === fieldProp
    )
    return item
  }

  const weightSum = (itemToPost: any) => {
    return allObjectiveDeliverables?.data.filter((item: any) => item.objectiveId === itemToPost.objectiveId )
      .map((item: any) => item.subWeight)
      .reduce((a: any, b: any) => a + b, 0)
  };

  const { mutate: updateData } = useMutation(updateItem, {
    onSuccess: async(newData: any) => {
      queryClient.invalidateQueries(`appraisalDeliverables`)
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
    console.log('tempData: ', tempData)
    if (tempData.name ==='') {
      return message.error('Name is required.')
    } else if (parseInt(tempData.subWeight) <= 0) {
      return message.error('Sub Weight cannot be zero or negative')
    } else if (parseInt(tempData.target) <= 0) {
      return message.error('Target cannot be zero or negative')
    } else if (parseInt(tempData.weight) > 100) {
      message.error('Weight cannot be greater than 100')
      return
    }

    if (tempData.name === secondTempData.name && tempData.description === secondTempData.description &&
      tempData.unitOfMeasureId === secondTempData.unitOfMeasureId && tempData.target === secondTempData.target) {
      if ((weightSum(tempData) - secondTempData.subWeight) + parseInt(tempData.subWeight) > 100) {
        return message.error(`Total sub-weight for ${pathData?.name} cannot be greater than 100`);
      } else {
        const item: any = {
          url: 'AppraisalDeliverable',
          data: tempData
        }
        updateData(item)
      }

    } else {
      //cheeck if new name already exists
      const itemExists = gridData?.find((item: any) =>
        item.description === tempData.description &&
        item.unitOfMeasureId === tempData.unitOfMeasureId &&
        item.target === tempData.target
      )

      if (itemExists) { return message.error('Deliverable already exists') } else {
        const item: any = {
          url: 'AppraisalDeliverable',
          data: tempData
        }
        updateData(item)
      }
    }
  }

  const OnSubmit = handleSubmit(async (values) => {
    // input validations
    // make sure all values are filled
    if (values.name ==='' || values.unitOfMeasureId === 'Select') {
      return message.error('Please fill all fields')
    } else if (parseInt(values.subWeight) <= 0) {
      return message.error('Sub Weight cannot be zero or negative')
    } else if (parseInt(values.target) <= 0) {
      return message.error('Target cannot be zero or negative')
    } else if (parseInt(values.weight) > 100) {
      return message.error('Weight cannot be greater than 100')
    }

    const itemToPost = {
      data: {
        objectiveId: parseInt(param.objectiveId),
        description: values.description,
        subWeight: parseInt(values.subWeight),
        unitOfMeasureId: parseInt(values.unitOfMeasureId),
        target: parseInt(values.target),
        status: "drafted",
        tenantId: tenantId
      },
      url: `AppraisalDeliverable`,
    }

    console.log('itemToPost: ', itemToPost.data)

    // check if item already exist
    const itemExist = gridData?.find((item: any) =>
      item.objectiveId === itemToPost.data.objectiveId &&
      item.description === itemToPost.data.description &&
      item.subWeight === itemToPost.data.subWeight &&
      item.unitOfMeasureId === itemToPost.data.unitOfMeasureId &&
      item.target === itemToPost.data.target
    )
    if (itemExist) {
      message.error('Deliverable already exist')
      return
    }

    const sums = weightSum(itemToPost.data)

    if (sums > 0 || itemToPost?.data?.subWeight > 0) {
      console.log('sums: ', sums)
      if (parseInt(sums + itemToPost.data.subWeight) > 100 || itemToPost.data.subWeight > 100) {
        return message.error(`Total weight for ${pathData?.name} cannot exceed 100`);
      } else {
        postData(itemToPost)
      }
    } else {
      message.error(`Total weight for ${pathData?.name} is less than 0!`);
    }
  })

  const { mutate: postData } = useMutation(postItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`appraisalDeliverables`)
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
                <span className="fw-bold d-block fs-2">{`${pathData?.name}`}</span>
                <div className="bullet bg-danger ms-4"></div>
                <span className=' fs-2 ms-4 fw-bold'>{`100%`}</span>
                {/* <span className=' fs-2 ms-4 fw-bold'>{`${pathData?.weight}%`}</span> */}
              </div>
            </Space>
            <Space style={{ marginBottom: 16 }}>
              {
                checkActive?.tag?.trim()==="final"||sameObjective?.length>0?"":
                <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                  <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                  Add
                </button>
              }
              
            </Space>
          </div>
          {
            loading ? <Skeleton active /> :
              <Table columns={columns} dataSource={gridData} />
          }
          <Modal
            title={isUpdateModalOpen ? "Update Deliverable" : 'Add Deliverable'}
            open={isModalOpen}
            onCancel={handleCancel}
            width={800}
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
              <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                {/* <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Objective</label>
                  <input
                    {...register("name")}
                    type='text'
                    defaultValue={isUpdateModalOpen === true ? tempData.name : null}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div> */}
                <div className='mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Deliverable</label>
                  <textarea
                    {...register("description")}
                    // type='text'
                    rows={1}
                    defaultValue={isUpdateModalOpen === true ? tempData.description : null}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div>
              </div>
              <div style={{ padding: "0px 20px 20px 20px" }} className='row mb-0 '>
                <div className='col-4 mb-7'>
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
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Target</label>
                  <input
                    {...register("target")} type='number' min='0'
                    defaultValue={isUpdateModalOpen === true ? tempData.target : 0}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Sub Weight</label>
                  <input
                    {...register("subWeight")}
                    type='number' min='0'
                    defaultValue={isUpdateModalOpen === true ? tempData.subWeight : 0}
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

export { EmployeeDeliverableEntry }




