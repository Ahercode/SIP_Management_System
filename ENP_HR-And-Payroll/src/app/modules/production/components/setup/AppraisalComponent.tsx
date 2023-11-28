import { Button, Input, Modal, Skeleton, Space, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../../_metronic/helpers'
import { ArrowLeftOutlined } from "@ant-design/icons"
import { deleteItem, fetchDocument, postItem, updateItem } from '../../../../services/ApiCalls'
import { getFieldName } from '../ComponentsFactory'

const AppraisalComponent = ({ title, endPoint }: any) => {

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
  let [pathName, setPathName] = useState<any>("")
  const prevPath = title === 'Objectives' ? 'parameters' : 'appraisalobjective'
  const { data: prevPathData } = useQuery('pathData', () => fetchDocument(`${prevPath}`), { cacheTime: 5000 })
  const { data: pathData } = useQuery(`${endPoint}`, () => fetchDocument(`${endPoint}`), { cacheTime: 5000 })
  const { data: allUnitsOfMeasure } = useQuery('unitofmeasures', () => fetchDocument('unitofmeasures'), { cacheTime: 5000 })


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
    setTempData({})
  }

  const handleChange = (event: any) => {
    event.preventDefault()
    setTempData({ ...tempData, [event.target.name]: event.target.value });
  }

  const { mutate: deleteData } = useMutation(deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${endPoint}`)
      loadData()
    },
    onError: (error) => {
      console.log('delete error: ', error)
      message.error('Error deleting record')
    }
  })

  function handleDelete(element: any) {
    const item = {
      url: endPoint,
      data: element
    }
    deleteData(item)
  }

  const columns: any = title === 'Objectives' ? [
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
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   sorter: (a: any, b: any) => {
    //     if (a.name > b.name) {
    //       return 1
    //     }
    //     if (b.name > a.name) {
    //       return -1
    //     }
    //     return 0
    //   },
    // },
    {
      title: 'Weight(%)',
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
          <Link to={`/deliverables/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Deliverables</span>
          </Link>
          <a onClick={() => showUpdateModal(record)} className='btn btn-light-warning btn-sm'>
            Update
          </a>
        </Space>
      ),
    },
  ] :
    [
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
          // const pointsArray = record.split(/\n• /)
          const pointsArray = record?.trim()?.split(/\n(?=\d+\.|\u2022)/).filter(Boolean)
          return (
            <>
              <span style={{ fontSize:"16px"}} className={ 'badge badge-light-warning fw-bolder' }>
                {record?.tag?.trim() === "same"? "Pre-defined":""}
              </span>
              <ul>
                {pointsArray?.map((point: any) => (
                  <p>{point}</p>
                ))}
              </ul>
            </>
          )
          },
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
        title: 'Sub Weight(%)',
        dataIndex: 'subWeight',
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
        title: 'Unit of Measure',
        key: 'unitOfMeasureId',
        render: (record: any) => {
          return getFieldName(record?.unitOfMeasureId, allUnitsOfMeasure?.data)
        },
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
        title: 'Target',
        dataIndex: 'target',
        sorter: (a: any, b: any) => {
          if (a.status > b.status) {
            return 1
          }
          if (b.status > a.status) {
            return -1
          }
          return 0
        },
        render: (text: any) => <span>{text.toLocaleString()}</span>,
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
            {/* <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
              Delete
            </a> */}
          </Space>
        ),
      },
    ]


  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetchDocument(`${endPoint}`)
      setGridData(response?.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const getItemData = async (param: any) => {
    let data = null
    const itemTest = await prevPathData?.data.find((item: any) =>
      item.id.toString() === param
    )
    data = await itemTest
    return data
  }

  useEffect(() => {
    (async () => {
      let res = await getItemData(param.id)
      setPathName(res)
    })();
    loadData()
  }, [param?.id, prevPathData?.data])

  const dataWithIndex = gridData.map((item: any, index) => ({
    ...item,
    key: index,
  }))

  const dataByID = gridData.filter((section: any) => {
    return title === 'Objectives' ?
      section.parameterId.toString() === param.id :
      section.objectiveId.toString() === param.id
  })

  const handleInputChange = (e: any) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      loadData()
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


  // to find the sum of the weight of the objectives or deliverables needed for validation
  const weightSum = (itemToPost: any) => {
    return title === 'Objectives' ? pathData?.data.filter((item: any) => item.parameterId === itemToPost.parameterId)
      .map((item: any) => item.weight)
      .reduce((a: any, b: any) => a + b, 0) :
      pathData?.data.filter((item: any) => item.objectiveId === itemToPost.objectiveId)
        .map((item: any) => item.subWeight)
        .reduce((a: any, b: any) => a + b, 0)
  };

  const { mutate: updateData } = useMutation(updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${endPoint}`)
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
    const data = await getItemData(param.id)
    // input validation
    if (title === 'Objectives') {
      // make sure all values are filled
      if (!tempData.name || !tempData.description || !tempData.weight || tempData.weight === '') {
        return message.error('Please fill all fields')
      } else if (parseInt(tempData.weight) <= 0) {
        return message.error('Weight cannot be zero or negative')
      } else if (parseInt(tempData.weight) > 100) {
        message.error('Weight cannot be greater than 100')
        setLoading(false)
        return
      }
    } else {

      // make sure all values are filled
      if (!tempData.name || !tempData.description || !tempData.subWeight ||
        tempData.subWeight === '' || !tempData.unitOfMeasureId || !tempData.target ||
        tempData.target === '') {
        return message.error('Please fill all fields')
      } else if (parseInt(tempData.subWeight) <= 0) {
        return message.error('Sub Weight cannot be zero or negative')
      } else if (parseInt(tempData.target) <= 0) {
        return message.error('Target cannot be zero or negative')
      } else if (parseInt(tempData.weight) > 100) {
        message.error('Weight cannot be greater than 100')
        setLoading(false)
        return
      }
    }

    //logic validation
    if (title === 'Objectives') {

      if (tempData.name === secondTempData.name && tempData.description === secondTempData.description) {
        if ((weightSum(tempData) - secondTempData.weight) + parseInt(tempData.weight) > data?.weight) {
          return message.error(`Total weight for ${pathName} cannot be greater than ${data?.weight}`);
        } else {
          const item: any = {
            url: endPoint,
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

        if (itemExists) { return message.error('Item already exists') } else {
          if ((weightSum(tempData) - secondTempData.weight) + parseInt(tempData.weight) > data?.weight) {
            return message.error(`Total weight for ${pathName} cannot be greater than ${data?.weight}`);
          } else {
            const item: any = {
              url: endPoint,
              data: tempData
            }
            updateData(item)
          }
        }
      }

    } else {
      // deliverables branch
      if (tempData.name === secondTempData.name && tempData.description === secondTempData.description &&
        tempData.unitOfMeasure === secondTempData.unitOfMeasure && tempData.target === secondTempData.target) {
        if ((weightSum(tempData) - secondTempData.subWeight) + parseInt(tempData.subWeight) > 100) {
          return message.error(`Total sub-weight for ${pathName} cannot be greater than 100`);
        } else {
          const item: any = {
            url: endPoint,
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
            url: endPoint,
            data: tempData
          }
          updateData(item)
        }
      }
    }
  }

  const showUpdateModal = (values: any) => {
    setIsUpdateModalOpen(true)
    setTempData(values);
    setSecondTempData(values);
    showModal()
    console.log(values)
  }


  const OnSubmit = handleSubmit(async (values) => {
    setLoading(true)

    // input validations
    if (title === 'Objectives') {
      // make sure all values are filled
      if (!values.name || !values.description || values.weight === '') {
        message.error('Please fill all fields')
        setLoading(false)
        return
      } else if (parseInt(values.weight) <= 0) {
        message.error('Weight cannot be zero or negative')
        setLoading(false)
        return
      } else if (parseInt(values.weight) > 100) {
        message.error('Weight cannot be greater than 100')
        setLoading(false)
        return
      }

    } else {

      // make sure all values are filled
      if (!values.name || !values.description || !values.subWeight ||
        !values.unitOfMeasure || !values.target) {
        message.error('Please fill all fields')
        setLoading(false)
        return
      } else if (parseInt(values.subWeight) <= 0) {
        message.error('Sub Weight cannot be zero or negative')
        setLoading(false)
        return
      } else if (parseInt(values.target) <= 0) {
        message.error('Target cannot be zero or negative')
        setLoading(false)
        return
      } else if (parseInt(values.weight) > 100) {
        message.error('Weight cannot be greater than 100')
        setLoading(false)
        return
      }
    }

    const itemToPost = title === 'Objectives' ? {
      data: {
        name: values.name,
        parameterId: parseInt(param.id),
        description: values.description,
        weight: parseInt(values.weight),
        tenantId: tenantId,
      },
      url: endPoint,
    } : {
      data: {
        name: values.name,
        objectiveId: parseInt(param.id),
        description: values.description,
        subWeight: parseInt(values.subWeight),
        unitOfMeasureId: values.unitOfMeasureId,
        target: parseInt(values.target),
        tenantId: tenantId,
      },
      url: endPoint,
    }

    // check if item already exist
    const itemExist = title === 'Objectives' ?
      gridData.find((item: any) =>
        item.name === itemToPost.data.name &&
        item.parameterId === itemToPost.data.parameterId &&
        item.description === itemToPost.data.description &&
        item.weight === itemToPost.data.weight
      ) : gridData.find((item: any) =>
        item.name === itemToPost.data.name &&
        item.objectiveId === itemToPost.data.objectiveId &&
        item.description === itemToPost.data.description &&
        item.subWeight === itemToPost.data.subWeight &&
        item.unitOfMeasureId === itemToPost.data.unitOfMeasureId &&
        item.target === itemToPost.data.target
      )

    if (itemExist) {
      message.error('Item already exist')
      setLoading(false)
      return
    }

    const sums = weightSum(itemToPost.data)

    if (title === 'Deliverables') {
      if (sums > 0) {
        if (sums + itemToPost.data.subWeight > 100) {
          setLoading(false)
          return message.error(`Total weight for ${pathName} cannot be greater than 100`);
        } else {
          postData(itemToPost)
        }
      } else {
        postData(itemToPost)
      }
    } else {
      if (sums > 0) {
        const data = await getItemData(param.id)
        if (sums + itemToPost.data.weight > data?.weight) {
          setLoading(false)
          return message.error(`Total weight for ${pathName} cannot be greater than ${data?.weight}`);
        } else {
          postData(itemToPost)
        }
      } else {
        postData(itemToPost)
      }
    }
  })

  const { mutate: postData } = useMutation(postItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`${endPoint}`)
      reset()
      setTempData({})
      setSecondTempData({})
      loadData()
      setIsModalOpen(false)
      setSubmitLoading(false)
      message.success('Item added successfully')
    },
    onError: (error: any) => {
      setSubmitLoading(false)
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
          <div className='d-flex mb-7 justify-content-between'>
           
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
                <span className="fw-bold d-block fs-2">{`${pathName?.name}`}</span>
                <div className="bullet bg-danger ms-4"></div>
                <span className=' fs-2 ms-4 fw-bold'>{`${pathName?.weight}%`}</span>
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
              <Table columns={columns} dataSource={dataByID} loading={loading} />
          }
          <Modal
            title={isUpdateModalOpen ? `Update ${title}` : `Add ${title}`}
            open={isModalOpen}
            onCancel={handleCancel}
            width={title === 'Objectives' ? 500 : 800}
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
              {
                title === 'Objectives' ?
                  <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                    <div className='mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Objective</label>
                      <input
                        {...register("name")}
                        defaultValue={isUpdateModalOpen === true ? tempData.name : null}
                        onChange={handleChange}
                        className="form-control form-control-solid" />
                    </div>
                    <div className='mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">{`Weight(%)`}</label>
                      <input
                        {...register("weight")}
                        type='number' min='0'
                        defaultValue={isUpdateModalOpen === true ? tempData.weight : 0}
                        onChange={handleChange}
                        className="form-control form-control-solid" />
                    </div>
                  </div>
                  :
                  <>
                    <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                      <div className=' mb-7'>
                        <label htmlFor="exampleFormControlInput1" className="form-label">Deliverable</label>
                        <textarea
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
                  </>
              }
            </form>
          </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export { AppraisalComponent }
