

import { Button, Input, Modal, Skeleton, Space, Table, message } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers'
import { Api_Endpoint, deleteItem, fetchDocument, postItem, updateItem } from '../../../services/ApiCalls'
import { ArrowLeftOutlined } from "@ant-design/icons"


const TestEmployeeDeliverable = () => {
  const [gridData, setGridData] = useState([])
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const navigate = useNavigate();
  const [tempData, setTempData] = useState<any>()
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [secondTempData, setSecondTempData] = useState<any>()
  let [appraisalName, setAppraisalName] = useState<any>("")
  const [pathData, setPathData] = useState<any>("")
  const { data: allObjectiveDeliverables, isLoading: loading } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 5000 })
  const { data: appraisalobjectives } = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 5000 })
  const { data: allUnitsOfMeasure } = useQuery('unitofmeasures', () => fetchDocument('unitofmeasures'), { cacheTime: 5000 })
  const queryClient = useQueryClient()




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
      queryClient.invalidateQueries('appraisaldeliverable')
      loadData()
    },
    onError: (error) => {
      console.log('delete error: ', error)
    }
  })

  function handleDelete(element: any) {
    const item = {
      url: 'appraisaldeliverable',
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

  const showUpdateModal = (values: any) => {
    setIsUpdateModalOpen(true)
    setTempData(values);
    setSecondTempData(values);
    showModal()
  }

  const loadData = async () => {
    try {
      console.log('param', param)
      setGridData(allObjectiveDeliverables?.data?.filter((item: any) => item?.objectiveId.toString() === param.objectiveId))
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
    return allObjectiveDeliverables?.data.filter((item: any) => item.objectiveId === itemToPost.objectiveId)
      .map((item: any) => item.subWeight)
      .reduce((a: any, b: any) => a + b, 0)
  };


  const { mutate: updateData } = useMutation(updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`appraisalDeliverables`)
      loadData()
      reset()
      setTempData({})
      setSecondTempData({})
      setIsUpdateModalOpen(false)
      setIsModalOpen(false)
      message.success('Item updated successfully')
    },
    onError: (error) => {
      console.log('error: ', error)
      message.error('Error updating item')
    }
  })

  const handleUpdate = async (e: any) => {
    e.preventDefault()
    const data = getItemData(tempData?.objectiveId, appraisalobjectives?.data)

    if (!tempData.name || !tempData.subWeight ||
      tempData.subWeight === '' || !tempData.unitOfMeasureId || !tempData.target ||
      tempData.target === '') {
      return message.error('Please fill all fields')
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
          url: 'appraisalDeliverables',
          data: tempData
        }
        updateData(item)
      }

    } else {
      //cheeck if new name already exists
      const itemExists = gridData.find((item: any) =>
        item.name === tempData.name &&
        item.description === tempData.description &&
        item.unitOfMeasureId === tempData.unitOfMeasureId &&
        item.target === tempData.target
      )

      if (itemExists) { return message.error('Item already exists') } else {
        const item: any = {
          url: 'appraisalDeliverables',
          data: tempData
        }
        updateData(item)
      }
    }
  }



  const OnSubmit = handleSubmit(async (values) => {
    // input validations
    // make sure all values are filled
    if (values.name === '' || values.unitOfMeasure==='Select') {
      message.error('Please fill all fields')
      return
    } else if (parseInt(values.subWeight) <= 0) {
      message.error('Sub Weight cannot be zero or negative')
      return
    } else if (parseInt(values.target) <= 0) {
      message.error('Target cannot be zero or negative')
      return
    } else if (parseInt(values.weight) > 100) {
      message.error('Weight cannot be greater than 100')
      return
    }

    const itemToPost = {
      data: {
        name: values.name,
        objectiveId: parseInt(param.id),
        description: values.description,
        subWeight: parseInt(values.subWeight),
        unitOfMeasureId: parseInt(values.unitOfMeasureId),
        target: parseInt(values.target),
        tenantId: tenantId
      },
      url: `appraisalObjectives`,
    }

    // check if item already exist
    const itemExist = gridData.find((item: any) =>
      item.name === itemToPost.data.name &&
      item.objectiveId === itemToPost.data.objectiveId &&
      item.description === itemToPost.data.description &&
      item.subWeight === itemToPost.data.subWeight &&
      item.unitOfMeasureId === itemToPost.data.unitOfMeasureId &&
      item.target === itemToPost.data.target
    )
    if (itemExist) {
      message.error('Item already exist')
      return
    }

    const sums = weightSum(itemToPost.data)

    if (sums > 0) {
      if (sums + itemToPost.data.subWeight > 100) {
        return message.error(`Total weight for ${pathData?.name} cannot exceed 100`);
      } else {
        postData(itemToPost)
      }
    } else {
      postData(itemToPost)
    }
  })

  const { mutate: postData } = useMutation(postItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`appraisalDeliverables`)
      reset()
      setTempData({})
      setSecondTempData({})
      loadData()
      setIsModalOpen(false)
      message.success('Item added successfully')
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
              <span className="fw-bold text-gray-600 d-block fs-2">{`${pathData?.name}`}</span>
            </Space>
            <Space style={{ marginBottom: 16 }}>
              <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>
              {/* <button type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button> */}
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
              onClick={isUpdateModalOpen ? handleUpdate : OnSubmit}
            >
              <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                  <input
                    {...register("name")}
                    defaultValue={isUpdateModalOpen === true ? tempData.name : null}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div>
                <div className='col-8 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Description</label>
                  <input
                    {...register("description")}
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

export { TestEmployeeDeliverable }




