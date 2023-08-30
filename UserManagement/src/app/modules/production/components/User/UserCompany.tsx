import { Button, Input, Modal, Space, Table, message } from 'antd'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../../_metronic/helpers'
import { deleteItem, fetchDocument, postItem } from '../../../../services/ApiCalls'

const UserCompany = () => {
  const [gridData, setGridData] = useState<any>([])
  const [beforeSearch, setBeforeSearch] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const {register, reset, handleSubmit} = useForm()
  const param:any  = useParams();
  const navigate = useNavigate();
  let [userFName, setUserFName] = useState<any>("")
  const queryClient = useQueryClient()
  const [userID, setUserID] = useState<any>("")

    const {data: userCompanies} = useQuery('userCompanies',() => fetchDocument('UserCompanies'), {cacheTime:5000})
    const {data: userApplications} = useQuery('userApplications',() => fetchDocument('UserApplications'), {cacheTime:5000})
    const {data: allUsers} = useQuery('users',() => fetchDocument('Users'), {cacheTime:5000})
    const {data: companies} = useQuery('companies',() => fetchDocument('Companies'), {cacheTime:5000})
  

    // console.log("User ID",userID);

 
    

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    reset()
    setIsModalOpen(false)
  }

  const { mutate: deleteData, isLoading: deleteLoading } = useMutation(deleteItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['userCompanies'], data);
      loadData()
    },
    onError: (error) => {
      console.log('delete error: ', error)
    }
  })

  const handleDelete = (element: any) => {
    const item = {
      url: 'UserCompanies',
      data: element
    }
    deleteData(item)
  }



  const columns: any = [    
    {
      title: 'Company Name',
      key: 'companyId',
      render:(i:any)=>{
        return getRoleName(i.companyId)
      },
      sorter: (a: any, b: any) => {
        if (a.companyId > b.companyId) {
          return 1
        }
        if (b.companyId > a.companyId) {
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
          {/* <Link to="#">
            <span className='btn btn-light-danger btn-sm'>Remove</span>
          </Link> */}
          <Link to={`/user-roles/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Roles</span>
          </Link>
          <a onClick={() => handleDelete(record)} className='btn btn-light-danger btn-sm'>
          Remove
          </a>
        </Space>
      ),
      
    },
  ]

  const getRoleName = (perkId: any) => {
    let RoleName = null
    companies?.data.map((item: any) => {
      if (item.id === perkId) {
        RoleName=item.name
      }
    })
    return RoleName
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await fetchDocument('UserCompanies')
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const getUserName= async (id:any) =>{
    let newName=null
     const itemTest = await allUsers?.data.find((item:any) =>
      item.id===id
    )
     newName = await itemTest
    return newName
 }

  // get user id from userApplications
  const getUserID = (id:any) => {
    // let userID = null
    userApplications?.data.map((item: any) => {
      if (item.id?.toString() === id) {
        return setUserID(item.userId)
      }
    })

    // console.log("Before userID:",param.id);
    // console.log(userID);
    return userID
  }

  useEffect(() => {
    (async ()=>{
      let res = await getUserName(userID)
      setUserFName(res?.firstName + "   "+ res?.surname)
    })();
    loadData()

    getUserID(param.id?.toString())
    setGridData(userCompanies?.data)
    setBeforeSearch(userCompanies?.data)
  }, [param?.id, userApplications?.data, userCompanies?.data, userID])

  const dataByID = gridData?.filter((section:any) =>{
    return section.userId === userID
  })

  const globalSearch = (searchValue: string) => {
    const searchResult = userCompanies?.data?.filter((item: any) => {
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

  const checkCompany = (companyId: any) => {
    let isAssigned = false
    userCompanies?.data.map((item: any) => {
      if (item.userId?.toString() === param.id && item.companyId?.toString() === companyId?.toString()) {
        isAssigned = true
      }
    })
    return isAssigned
  }

  const OnSubmit = handleSubmit(async (values) => {
    setLoading(true)
    const endpoint = 'UserCompanies'
    if(!checkCompany(values.companyId)){
      const item = {
        data: {
          userId: userID,
          companyId: values.companyId,
        },
        url: endpoint
      }
      console.log(item.data)
      postData(item)
    }else{
      message.error('Company already assigned')
    }
  })

  const { mutate: postData, isLoading: postLoading } = useMutation(postItem, {
    onSuccess: (data) => {
      queryClient.setQueryData(['userCompanies'], data);
      reset()
      loadData()
      setIsModalOpen(false)
    },
    onError: (error) => {
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
        <h3 style={{fontWeight:"bolder"}}>{userFName} </h3>
        <br></br>
        <button className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' onClick={() => navigate(-1)}>Go Back</button>
        <br></br>
          <div className='d-flex justify-content-between'>
            <Space style={{marginBottom: 16}}>
              <Input
                placeholder='Enter Search Text'
                onChange={handleInputChange}
                type='text'
                allowClear
              />
            </Space>
            <Space style={{marginBottom: 16}}>
              <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>
            </Space>
          </div>
          <Table columns={columns} dataSource={dataByID} />
          <Modal
                title='Add New User Company'
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
                    onClick={OnSubmit}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <form
                    onSubmit={OnSubmit}
                >
                   <hr></hr>
                   <div style={{padding: "20px 20px 20px 20px"}} className='row mb-0 '>
                    {/* <div className=' mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Code</label>
                      <input type="text" {...register("code")}  className="form-control form-control-solid"/>
                    </div> */}
                    <div className=' mb-7'>
                      <label htmlFor="exampleFormControlInput1" className="form-label">Company</label>
                        <select {...register("companyId")} className="form-select form-select-solid"  aria-label="Select example">
                            <option value=""> Select </option>
                            {companies?.data.map((item: any) => (
                                <option value={item.id}>{item.name}</option>
                            ))}
                        </select>
                    </div>

                   
                  </div>
                </form>
            </Modal>
        </div>
      </KTCardBody>
    </div>
  )
}

export { UserCompany }

