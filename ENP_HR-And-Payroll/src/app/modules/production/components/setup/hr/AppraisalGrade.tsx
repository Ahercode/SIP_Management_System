import { Button, Input, Modal, Skeleton, Space, Table, message } from "antd"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Api_Endpoint, deleteItem, fetchDocument, postItem } from "../../../../../services/ApiCalls"
import { KTCardBody, KTSVG } from "../../../../../../_metronic/helpers"
import { ArrowLeftOutlined } from "@ant-design/icons"
import axios from "axios"

const AppraisalGrade = () => {
    const [gridData, setGridData] = useState([])
    const [searchText, setSearchText] = useState('')
    let [filteredData] = useState([])
    const [submitLoading, setSubmitLoading] = useState(true)
    const { register, reset, handleSubmit } = useForm()
    const param: any = useParams();
    const navigate = useNavigate();
    const [tempData, setTempData] = useState<any>()
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    let [appraisalName, setAppraisalName] = useState<any>("")

    const tenantId = localStorage.getItem('tenant')
    const { data: tableData, isLoading } = useQuery('appraisalGrades', () => fetchDocument(`AppraisalGrades`), { cacheTime: 5000 })
    const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument('appraisals'), { cacheTime: 5000 })
    const queryClient = useQueryClient()
    const showModal = () => {
      setIsModalOpen(true)
    }
  
    let changer = 2
    const handleChange = (event: any) => {
        event.preventDefault()
        setTempData({ ...tempData, [event.target.name]: event.target.value });
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
    const showUpdateModal = (values: any) => {
        setIsModalOpen(true)
        setIsUpdateModalOpen(true)
        setTempData(values);
      }
    
    const { mutate: deleteData} = useMutation(deleteItem, {
        onSuccess: () => {
          queryClient.invalidateQueries('appraisalGrades')
          loadData()
        },
        onError: (error) => {
          console.log('delete error: ', error)
          message.error(`Error deleting Appraisal`)
        }
      })
    
      function handleDelete(element: any) {
        const item = {
          url: 'appraisalGrades',
          data: element
        }
        deleteData(item)
      }

      const loadData = async () => {
        try {
          setGridData(tableData?.data)
        } catch (error) {
          console.log(error)
        }
      }

      const getItemName = async (param: any) => {
        let newName = null
        const itemTest = await allAppraisals?.data.find((item: any) =>
          item.id.toString() === param
        )
        newName = await itemTest
        return newName
      }
      
    const columns: any = [

        {
          title: 'Range',
          dataIndex: 'range',
          sorter: (a: any, b: any) => {
            if (a.range > b.range) {
              return 1
            }
            if (b.range > a.range) {
              return -1
            }
            return 0
          },
        },
        {
          title: 'Grade',
          dataIndex: 'grade',
          sorter: (a: any, b: any) => {
            if (a.grade > b.grade) {
              return 1
            }
            if (b.grade > a.grade) {
              return -1
            }
            return 0
          },
        },
        {
          title: 'Name',
          dataIndex: 'payoutRatio',
          sorter: (a: any, b: any) => {
            if (a.payoutRatio > b.payoutRatio) {
              return 1
            }
            if (b.payoutRatio > a.payoutRatio) {
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

      
      
      // const handleUpdate = (e: any) => {
        
      // }
      const url = `${Api_Endpoint}/AppraisalGrades`
      const urlUpdate = `${Api_Endpoint}/AppraisalGrades/${tempData?.id}`
      const OnSUbmit = handleSubmit(async (values) => {
        const data = {
         appraisalId: parseInt(param?.id),
          grade: values.grade,
          range: values.range,
          payoutRatio: values.payoutRatio,
        }
        const dataUpdate = {
            id: tempData.id,
            appraisalId: parseInt(param?.id),
            grade: values.grade,
            range: values.range,
            payoutRatio: values.payoutRatio,
          }
        console.log(data)
    
        if(!isUpdateModalOpen){
            try {
              const response = await axios.post(url, data)
              setSubmitLoading(false)
              reset()
              setIsModalOpen(false)
              loadData()
              queryClient.invalidateQueries('appraisalGrades')
              return response.statusText
            } catch (error: any) {
              setSubmitLoading(false)
              return error.statusText
            }
        }else{
         message.success("Upadte trigger")
        try {
          console.log("Update Data",dataUpdate)
          const response = await axios.put(urlUpdate, dataUpdate)
          setSubmitLoading(false)
          reset()
          setIsModalOpen(false)
          setIsUpdateModalOpen(false)
          queryClient.invalidateQueries('appraisalGrades')
          loadData()
          return response.statusText
        } catch (error: any) {
          setSubmitLoading(false)
          return error.statusText
        }
      }
    
    })

    useEffect(() => {
      (async () => {
        let res = await getItemName(param.id)
        setAppraisalName(res?.name)
      })();
      loadData()
    }, [tableData, changer])

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
                    // onChange={handleInputChange}
                    type='text'
                    allowClear
                    value={searchText}
                    />
                    <Button type='primary' 
                //   onClick={globalSearch}
                    >
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
                    <Table columns={columns} dataSource={gridData} />
                }
                <Modal
                title={isUpdateModalOpen ? 'Appraisal Grade Update' : 'Appraisal Grade Setup'}
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
                        <label htmlFor="exampleFormControlInput1" className="form-label">Range</label>
                        <input
                        {...register("range")}
                        defaultValue={isUpdateModalOpen === true ? tempData.range : ''}
                        onChange={handleChange}
                        className="form-control form-control-solid" />
                    </div>
                    <div className='mb-7'>
                        <label htmlFor="exampleFormControlInput1" className="form-label">Garde</label>
                        <input
                        {...register("grade")}
                        defaultValue={isUpdateModalOpen === true ? tempData.grade : ''}
                        onChange={handleChange}
                        className="form-control form-control-solid" />
                    </div>
                    <div className='mb-7'>
                        <label htmlFor="exampleFormControlInput1" className="form-label">Payout Ratio</label>
                        <input
                        {...register("payoutRatio")} type='text'
                        defaultValue={isUpdateModalOpen === true ? tempData.payoutRatio : ''}
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

export { AppraisalGrade }