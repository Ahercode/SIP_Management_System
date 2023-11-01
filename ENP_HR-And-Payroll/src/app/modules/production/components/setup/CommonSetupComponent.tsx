import { Button, Input, Modal, Skeleton, Space, Table, message } from "antd"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQuery, useQueryClient } from "react-query"
import { useNavigate, useParams } from "react-router-dom"
import { KTCardBody, KTSVG } from "../../../../../_metronic/helpers"
import { deleteItem, fetchDocument, postItem, updateItem } from "../../../../services/ApiCalls"
import "./stickyStyle.css"

// common setup component
const SetupComponent = (props: any) => {
    const [gridData, setGridData] = useState([])
    const [searchText, setSearchText] = useState('')
    let [filteredData] = useState([])
    const [submitLoading, setSubmitLoading] = useState(false)
    const { register, reset, handleSubmit } = useForm()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tempData, setTempData] = useState<any>()
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const queryClient = useQueryClient()
    const tenantId = localStorage.getItem('tenant')
    const param: any = useParams();
    const navigate = useNavigate();
    const [detailName, setDetailName] = useState('')
    const [objectivesId, setObjectivesId] = useState<any>()
    const [isSticky, setIsSticky] = useState(false);

    let endPoint = ""
    if(props.data.url ==="unitofmeasures"){
        endPoint = "UnitOfMeasures"
    }
    else{
        endPoint = `${props.data.url}/tenant/${tenantId}`
    }
    const { data: componentData, isLoading: loading } = useQuery(`${props.data.url}`, () => fetchDocument(endPoint), { cacheTime: 5000 })


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

    const { mutate: deleteData } = useMutation(deleteItem, {
        onSuccess: () => {
            queryClient.invalidateQueries(props.data.url)
            loadData()
        },
        onError: (error) => {
            console.log('delete error: ', error)
        }
    })

    function handleDelete(element: any) {
        const item = {
            url: props.data.url,
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
            title: 'Achievement Cap',
            dataIndex: 'threashold',
            sorter: (a: any, b: any) => {
                if (a.threashold > b.threashold) {
                    return 1
                }
                if (b.threashold > a.threashold) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Bonus target',
            dataIndex: 'bonusTarget',
            sorter: (a: any, b: any) => {
                if (a.bonusTarget > b.bonusTarget) {
                    return 1
                }
                if (b.bonusTarget > a.bonusTarget) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Group Weight',
            dataIndex: 'grouopWeight',
            sorter: (a: any, b: any) => {
                if (a.grouopWeight > b.grouopWeight) {
                    return 1
                }
                if (b.grouopWeight > a.grouopWeight) {
                    return -1
                }
                return 0
            },
        },
        {
            title: 'Individual Weight',
            dataIndex: 'individualWeight',
            sorter: (a: any, b: any) => {
                if (a.individualWeight > b.individualWeight) {
                    return 1
                }
                if (b.individualWeight > a.individualWeight) {
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

    // remove bonus target from columns if props.data.title is category
    // if (props.data.title === 'Category') {
    //     columns.splice(3, 4)
    // }
    if (props.data.title === 'Category') {
        columns.splice(2, 1)
    }
    else if (props.data.title === 'Departments') {
        columns.splice(3, 3)
        
    }else{
        columns.splice(2, 4)
    }

    

    const loadData = async () => {
        try {
            const response = componentData?.data
            setGridData(response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadData()
        const handleScroll = () => {
            if (window.scrollY > 10) { 
              setIsSticky(true);
            } else {
              setIsSticky(false);
            }
          };
      
          window.addEventListener('scroll', handleScroll);
      
          return () => {
            window.removeEventListener('scroll', handleScroll);
          };
    }, [componentData?.data])

    const dataWithIndex = gridData?.map((item: any, index) => ({
        ...item,
        key: index,
    }))

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

    const { mutate: updateData } = useMutation(updateItem, {
        onSuccess: () => {
            queryClient.invalidateQueries(`${props.data.url}`)
            reset()
            setTempData({})
            loadData()
            setIsUpdateModalOpen(false)
            setIsModalOpen(false)
            message.success(`${props.data.title} updated successfully.`)
        },
        onError: (error) => {
            console.log('error: ', error)
            message.error(`Error updating ${props.data.title}. Please try again later.`)
        }
    })

    const handleUpdate = (e: any) => {
        e.preventDefault()
        const item = {
            url: props.data.url,
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


    const OnSubmit = handleSubmit(async (values) => {
        const item: any = {
            data: {
                name: values.name,
                code: values.code,
                // medicalTypeId: parseInt(param.id),
                tenantId: tenantId,
                bonusTarget: values.bonusTarget,
                grouopWeight: values.grouopWeight,
                individualWeight: values.individualWeight,
                threashold: values.threashold,
            },
            url: props.data.url
        }
        postData(item)
    })

    const { mutate: postData } = useMutation(postItem, {
        onSuccess: () => {
            queryClient.invalidateQueries(`${props.data.url}`)
            reset()
            setTempData({})
            loadData()
            setIsModalOpen(false)
            message.success(`${props.data.title} created successfully`)
        },
        onError: (error) => {
            console.log('post error: ', error)
            message.error(`Error while creating ${props.data.title}. Please try again later.`)
        }
    })

    return (
        <div
            style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
                position: isSticky ? 'sticky' : 'static', top: 0
            }}
            className={isSticky ? 'sticky' : ''}
        >
            {/* <KTCardBody className='py-4 '> */}
                <div className='table-responsive'>
                    <div className="mb-5">
                        <div className='d-flex justify-content-between'>
                            <Space style={{ marginBottom: 16 }}>
                                <Input
                                    placeholder='Enter Search Text'
                                    onChange={handleInputChange}
                                    type='text'
                                    allowClear
                                    value={searchText} size='large'
                                />
                                <Button type='primary' onClick={globalSearch} size='large'>
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
                    </div>

                    {
                        loading ? <Skeleton active /> :
                            <Table columns={columns} dataSource={dataWithIndex} 
                            loading={loading} 
                            sticky={true}
                            scroll={{ y: `calc(100vh - 250px)` }}
                            />

                    }
                    <Modal
                        title={isUpdateModalOpen ? `${props.data.title} update` : `${props.data.title} setup`}
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
                            <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                                <div className=' mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Code</label>
                                    <input type="text" {...register("code")} defaultValue={isUpdateModalOpen === true ? tempData.code : ''} onChange={handleChange} className="form-control form-control-solid" />
                                </div>
                                <div className=' mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                                    <input type="text" {...register("name")} defaultValue={isUpdateModalOpen === true ? tempData.name : ''} onChange={handleChange} className="form-control form-control-solid" />
                                </div>
                                {
                                    props.data.title === 'Departments' &&
                                    <>
                                        <div className=' mb-7'>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Achievement Cap</label>
                                            <input type="number" {...register("threashold")} defaultValue={isUpdateModalOpen === true ? parseInt(tempData.threashold) : 0} onChange={handleChange} className="form-control form-control-solid" />
                                        </div>
                                    </>
                                }
                                {
                                    props.data.title === 'Category' &&
                                    <>
                                        <div className=' mb-7'>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Bonus Target</label>
                                            <input type="number" {...register("bonusTarget")} defaultValue={isUpdateModalOpen === true ? tempData.bonusTarget : 0} onChange={handleChange} className="form-control form-control-solid" />
                                        </div>
                                        <div className=' mb-7'>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Group Weight</label>
                                            <input type="number" {...register("grouopWeight")} defaultValue={isUpdateModalOpen === true ? parseInt(tempData.grouopWeight) : 0} onChange={handleChange} className="form-control form-control-solid" />
                                        </div>
                                        <div className=' mb-7'>
                                            <label htmlFor="exampleFormControlInput1" className="form-label">Individual Weight</label>
                                            <input type="number" {...register("individualWeight")} defaultValue={isUpdateModalOpen === true ? parseInt(tempData.individualWeight) : 0} onChange={handleChange} className="form-control form-control-solid" />
                                        </div>
                                    </>
                                }
                            </div>
                        </form>
                    </Modal>
                </div>
            {/* </KTCardBody> */}
        </div>
    )
}

export { SetupComponent }
