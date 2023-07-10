/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./formStyle.css"
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Button, Form, Modal, Space, Table, } from 'antd';
import { Api_Endpoint, fetchCategories, fetchDepartments, fetchDivisions, fetchDocument, fetchEmployees, fetchExperiences, fetchGrades, fetchJobTitles, fetchMedicals, fetchNationalities, fetchNotches, fetchPaygroups, fetchQualifications, fetchSkills, fetchUnits, updateEmployee } from '../../../../services/ApiCalls';
import { KTSVG } from '../../../../../_metronic/helpers';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { BANKS } from '../../../../data/DummyData';

const EmployeeEditForm = () => {
  const [formData, setFormData] = useState({});
  const [statusModalOpen, setIsStatusModalOpen] = useState(false)
  const [statusGridModalOpen, setStatusGridModalOpen] = useState(false)
  const [statusData, setStatusData] = useState([])
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState()
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const [tempData, setTempData] = useState<any>()

  const [jobTName, setJobTName] = useState<any>()

  const [paygName, setPaygName] = useState<any>()
  const [newPay, setNewPay] = useState([])
  const tenantId = localStorage.getItem('tenant')
  const [tempImage, setTempImage] = useState<any>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [activeTab, setActiveTab] = useState('tab1');
  const navigate = useNavigate();
  const openStatus = () => {
    setIsStatusModalOpen(true)
  }
  const openStatusGrid = () => {
    setStatusGridModalOpen(true)
  }

  const handleTabClick = (tab:any) => {
    setActiveTab(tab);
  }

  const handleChange = (event: any) => {
    event.preventDefault()
    setTempData({ ...tempData, [event.target.name]: event.target.value });
  }

  const handleStatusCancel = () => {
    reset()
    setIsStatusModalOpen(false)
  }

  const [submitLoading, setSubmitLoading] = useState(false)


  const statusColumns: any = [
   
    {
      title: 'Status',
      dataIndex: 'status',
      sorter: (a: any, b: any) => {
        if (a.satatus > b.satatus) {
          return 1
        }
        if (b.satatus > a.satatus) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Date',
      key: 'date',
      render: (row:any )=>{
        return row.date?.substring(0,10)
      },
      sorter: (a: any, b: any) => {
        if (a.date > b.date) {
          return 1
        }
        if (b.date > a.date) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      sorter: (a: any, b: any) => {
        if (a.comment > b.comment) {
          return 1
        }
        if (b.comment > a.comment) {
          return -1
        }
        return 0
      },
    },
  ]


  // const getSkillName = (skillId: any) => {
  //   let skillName = null
  //   allSkills?.data.map((item: any) => {
  //     if (item.id === skillId) {
  //       skillName = item.name
  //     }
  //   })
  //   return skillName
  // }
  // const getQualificationName = (qualificationId: any) => {
  //   let qualificationName = null
  //   allQualifications?.data.map((item: any) => {
  //     if (item.id === qualificationId) {
  //       qualificationName = item.name
  //     }
  //   })
  //   return qualificationName
  // }
  // validates input field to accept only numbers
  const validatePhoneNumber = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }

  }
  const { data: allEmployees } = useQuery('employees',()=> fetchDocument('employees'), { cacheTime: 5000 })
  // const { data: allDepartments } = useQuery('departments',()=> fetchDepartments(tenantId), { cacheTime: 5000 })
  // const { data: allDivisions } = useQuery('divisions',()=> fetchDivisions(tenantId), { cacheTime: 5000 })
  const { data: allCategories } = useQuery('categories',()=> fetchCategories('categories'), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroups', ()=>fetchDocument('paygroups'), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitle',()=> fetchDocument('jobtitles'), { cacheTime: 5000 })



  const fetchImage = async () => {
    const res = await fetch("https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80");
    const imageBlob = await res.blob();
    const imageObjectURL: any = URL.createObjectURL(imageBlob);
    setImg(imageObjectURL);
  };


  useEffect(() => {


    const getJobTName = () => {
      let jobTitleName = ""
      allJobTitles?.data.map((item: any) => {
        if (item.id === tempData?.jobTitleId) {
          jobTitleName = item.name
        }
      })
      return setJobTName(jobTitleName)
    }


    const getPaygroupName = () => {
      let paygroupName = null
      allPaygroups?.data.map((item: any) => {
        if (item.id === tempData?.paygroupId) {
          paygroupName = item.name
        }
      })
      return setPaygName(paygroupName)
    }

    getJobTName()
    getPaygroupName()
  })

  useEffect(() => {
    const newData = allPaygroups?.data.filter((item: any) => item.id !== tempData?.paygroupId)
    setNewPay(newData)

    const dataByID = allEmployees?.data.find((employee: any) => {
      return employee.id.toString() === param.id
    })
    const getEmployeeById = () => {
      setTempData(dataByID)
    }

    getEmployeeById()
    fetchImage()
  }, [param.id, allEmployees])


  const statusByEmployee:any = statusData.filter((section: any) => {
    return section.employeeId.toString() === param.id
  })

  const recentStatus: any = statusByEmployee?.find((item:any)=>{
    return item.index === (statusByEmployee.length -1)
  })
  
  let highestIdItem:any = null;
  let highestId:any = -1;

  for (let i = 0; i < statusByEmployee.length; i++) {
    if (statusByEmployee[i]?.id > highestId) {
      highestId = statusByEmployee[i]?.id;
      highestIdItem = statusByEmployee[i];
    }
  }
  
  // check date be make sure users can not select date before today
  const today = new Date().toISOString().split('T')[0];  



  const queryClient = useQueryClient()
  const { isLoading, mutate } = useMutation(updateEmployee, {
    onSuccess: (data) => {
      queryClient.setQueryData(['employees', tempData.id], data);
      navigate('/employee', { replace: true })
      queryClient.invalidateQueries(['employees', tempData.id]);
    }
  })

  const handleUpdate = (e: any) => {
    e.preventDefault()
    mutate(tempData)
  }

  const handleImageChange = (e:any) => {
    const file = e.target.files[0];
    setTempImage(file);

    if (file) {
      const reader:any = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewImage('');
    }
  };

// for posting employee statuses
  const urlSta = `${Api_Endpoint}/EmployeeStatus`
  const OnSubmitStatus = handleSubmit(async (values: any) => {
    setLoading(true)
    const data = {
      comment: values.comment,
      status: values.status,
      employeeId: parseInt(param.id),
    }
    console.log(data);
    
    try {
      const response = await axios.post(urlSta, data)
      setSubmitLoading(false)
      reset()
      setIsStatusModalOpen(false)
      return response.statusText
    } catch (error: any) {
      setSubmitLoading(false)
      return error.statusText
    }
  })

  console.log('New', param.id);
  

  const uRL = `${Api_Endpoint}/Employees/${param.id}`
    const OnSUbmitUpdate = handleSubmit( async ( )=> {
      setLoading(true)
      const formData:any = new FormData();
      formData.append('id', parseInt(tempData.id))
      formData.append('employeeId', tempData.employeeId==null?"":tempData.employeeId)
      formData.append('firstName', tempData.firstName==null?"":tempData.firstName)
      formData.append('surname', tempData.surname==null?"":tempData.surname)
      formData.append('otherName', tempData.otherName==null?"":tempData.otherName)
      formData.append('dob', tempData.dob==null?"":tempData.dob)
      formData.append('gender', tempData.gender==null?"":tempData.gender)
      formData.append('maritalStatus', tempData.maritalStatus==null?"":tempData.maritalStatus)
      formData.append('nationality', tempData.nationality==null?"":tempData.nationality)
      formData.append('nationalId', tempData.nationalId==null?"":tempData.nationalId)
      formData.append('phone', tempData.phone==null?"":tempData.phone)
      formData.append('alternativePhone', tempData.alternativePhone==null?"":tempData.alternativePhone)
      formData.append('address', tempData.address==null?"":tempData.address)
      formData.append('residentialAddress', tempData.residentialAddress==null?"":tempData.residentialAddress)
      formData.append('email', tempData.email==null?"":tempData.email)
      formData.append('personalEmail', tempData.personalEmail==null?"":tempData.personalEmail)
      formData.append('jobRole', tempData.jobRole==null?"":tempData.jobRole)
      formData.append('nextOfKin', tempData.nextOfKin==null?"":tempData.nextOfKin)
      formData.append('guarantor', tempData.guarantor==null?"":tempData.guarantor)
      formData.append('paygroupId', tempData.paygroupId==null?"":parseInt(tempData.paygroupId))
      formData.append('categoryId', tempData.categoryId==null?"":parseInt(tempData.categoryId))
      formData.append('divisionId', tempData.divisionId==null?"":parseInt(tempData.divisionId))
      formData.append('departmentId', tempData.departmentId==null?"":parseInt(tempData.departmentId))
      formData.append('gradeId', tempData.gradeId==null?"":parseInt(tempData.gradeId))
      formData.append('notchId', tempData.notchId==null?"":tempData.notchId)
      formData.append('jobTitleId', tempData.jobTitleId==null?"":parseInt(tempData.jobTitleId))
      formData.append('employmentDate', tempData.employmentDate==null?"":tempData.employmentDate)
      formData.append('payType', tempData.payType==null?"":tempData.payType)
      formData.append('paymentMethod', tempData.paymentMethod==null?"":tempData.paymentMethod)
      formData.append('bankId', tempData.bankId==null?"":tempData.bankId)
      formData.append('account', tempData.account==null?"":tempData.account)
      formData.append('tin', tempData.tin==null?"":tempData.tin)
      formData.append('ssf', tempData.ssf==null?"":tempData.ssf)
      formData.append('imageFile', tempImage?tempImage:"")
      formData.append('tenantId', tenantId)


      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },}

      console.log(Object.fromEntries(formData))
      try {
        const response = await axios.put(uRL, formData, config)
        setSubmitLoading(false)
        navigate('/employee', {replace: true})
        return response.statusText
      } catch (error: any) {
        setSubmitLoading(false)
        return error.statusText
      }
    })

    // 

  return (
    <div
      className="col-12"
      style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <h3>You are updating <span style={{ color: "#FF6363"  }}>  {tempData?.firstName} {tempData?.surname}</span></h3>
      <br></br>
      <Link to="/employee">
        <a style={{ fontSize: "16px", fontWeight: "500" }} className='mb-7 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'>
          Back to list
        </a>
      </Link>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'tab1' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab1')}
        >
          Details
        </button>
        <button
          className={`tab ${activeTab === 'tab2' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab2')}
        >
          Communication
        </button>
        <button
          className={`tab ${activeTab === 'tab3' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab3')}
        >
          Administration
        </button>
       
      </div>
      <hr></hr>
      <br></br>
      <div className="FormClass" >
        <div className="tab-content">

          {/* Details */}
          {activeTab === 'tab1' &&
          <>
            <div className='col-4 mb-7'>
            {
              !previewImage&&(
              tempData?.imageUrl!==null?
              <img style={{borderRadius:"10px", marginBottom:"20px"}} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${tempData?.imageUrl}`} width={150} height={150}></img>:
              <img style={{borderRadius:"10px",marginBottom:"20px"}} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`} width={150} height={150}></img>
              )
            }
            {
              previewImage&&(

                <img style={{borderRadius:"10px",marginBottom:"20px"}} src={previewImage} width={150} height={150}></img>
              )
            }
           <br></br>
            <label htmlFor="imageFile" className='btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'>Change Picture</label>
            <input id='imageFile' style={{visibility:"hidden"}}  {...register("imageUrl")}
              onChange={handleImageChange}
              type="file" />
          </div>
            <div className='row col-12'>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Employee ID</label>
                  <input type="text" {...register("phone")}
                    name="employeeId"
                    onChange={handleChange}
                    value={tempData?.employeeId} className="form-control form-control-solid" />
                </div>

                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">First Name</label>
                  <input type="text" {...register("firstName")}
                    name="firstName"
                    onChange={handleChange}
                    value={tempData?.firstName} className="form-control form-control-solid" />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Surname</label>
                  <input type="text" {...register("surname")}
                    name="surname"
                    onChange={handleChange}
                    value={tempData?.surname} className="form-control form-control-solid" />
                </div>
              
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Other Name</label>
                  <input type="text" {...register("otherName")}
                    name="otherName"
                    onChange={handleChange}
                    value={tempData?.otherName} className="form-control form-control-solid" />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Date of Birth</label>
                  <input type="date" {...register("date")}
                    name="dob"
                    onChange={handleChange}
                    value={tempData?.dob?.substring(0,10)} className="form-control form-control-solid" />
                </div>
              

                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Gender</label>
                  <select
                    {...register("gender")} name="gender"
                    onChange={handleChange}
                    value={tempData?.gender?.trim()}
                    className="form-select form-select-solid" aria-label="Select example">
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                  </select>
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Marital Status</label>
                  <select
                    {...register("maritalStatus")} name="maritalStatus"
                    onChange={handleChange}
                    value={tempData?.maritalStatus?.trim()}
                    className="form-select form-select-solid" aria-label="Select example">
                    <option value="SINGLE">SINGLE</option>
                    <option value="MARRIED">MARRIED</option>

                  </select>
                </div>
              
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">National ID</label>
                  <input type="text" {...register("nationalId")}
                    name="nationalId"
                    onChange={handleChange}
                    value={tempData?.nationalId} className="form-control form-control-solid" />
                </div>
              </div>
              </>
          }

          {/* Communications */}
          {
            activeTab === 'tab2' &&
            <div className='row col-12'>
              
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Phone Number</label>
                  <input type="phone"
                    {...register("phone")} name="phone" 
                    onChange={handleChange}
                    value={tempData?.phone}
                    pattern="[0-9]*" className="form-control form-control-solid" />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Alternative Phone number</label>
                  <input type="phone" value={tempData?.alternativePhone}
                    {...register("alternativePhone")} name="alternativePhone" 
                    maxLength={15}
                    onKeyPress={validatePhoneNumber}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div>
              
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Address</label>
                  <input type="text"
                    {...register("address")} name="address" 
                    value={tempData?.address}
                    onChange={handleChange}
                    className="form-control form-control-solid" />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Residential Address</label>
                  <input type="text" {...register("residentialAddress")} name="residentialAddress" 
                    value={tempData?.residentialAddress} onChange={handleChange} className="form-control form-control-solid" />
                </div>
              
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Email</label>
                  <input type="email" {...register("email")} name="email"  value={tempData?.email?.toLowerCase()} onChange={handleChange} className="form-control form-control-solid" />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Personal Email</label>
                  <input type="email" {...register("personalEmail")} name="personalEmail"  value={tempData?.personalEmail} onChange={handleChange} className="form-control form-control-solid" />
                </div>
              </div>
           
          }
          {/* Administration */}
          {activeTab === 'tab3' &&
            <div className='row col-12'>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Employee Group</label>
                  <select {...register("paygroupId")} value={tempData?.paygroupId} name='paygroupId' onChange={handleChange}  className="form-select form-select-solid" aria-label="Select example">
                    {allPaygroups?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Category</label>
                  <select  {...register("categoryId")} name="categoryId" onChange={handleChange} value={tempData?.categoryId} className="form-select form-select-solid" aria-label="Select example">
                    {allCategories?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                {/* <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Division</label>
                  <select  {...register("divisionId")} name="divisionId" onChange={handleChange} value={tempData?.divisionId} className="form-select form-select-solid" aria-label="Select example">
                    {allDivisions?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div> */}
                {/* <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Salary Grade</label>
                  <select  {...register("gradeId")} name="gradeId" onChange={handleChange} value={tempData?.gradeId} className="form-select form-select-solid" aria-label="Select example">
                    {allGrades?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div> */}

              
                {/* <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Department</label>
                  <select  {...register("departmentId")} name="departmentId" onChange={handleChange} value={tempData?.departmentId} className="form-select form-select-solid" aria-label="Select example">
                    {allDepartments?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div> */}
                
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Job Title</label>
                  <select  {...register("jobTitleId")} name="jobTitleId" onChange={handleChange} value={tempData?.gradeId} className="form-select form-select-solid" aria-label="Select example">
                    <option>{jobTName} </option>
                    {allJobTitles?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>

              
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Job Roles</label>
                  <textarea  {...register("jobRole")} name="jobRole" value={tempData?.jobRole} onChange={handleChange} className="form-control form-control-solid" placeholder='list job roles (seperate each role with a comma)' aria-label="With textarea"></textarea>

                </div>
                <div className='col-3 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Employment Date</label>
                  <input type="date"  {...register("employmentDate")} name="employmentDate" value={tempData?.employmentDate?.substring(0,10)} onChange={handleChange} className="form-control form-control-solid" />

                </div>
                <div className='col-3 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Most Recent Status</label>
                  <br></br>
                  <span className="form-control form-control-solid">{highestIdItem?.status} - {highestIdItem?.date.substring(0,10)}</span>
                  
                  {/* <input  disabled value={highestIdItem?.status - highestIdItem?.date.substring(0,10)} className="form-control form-control-solid" /> */}

                </div>
                <div className='col-3 mb-7'>
                  <br></br>
                  <a onClick={openStatusGrid} className="btn btn-danger"> Change Status</a>
                  <Modal
                        title={`Status for ${tempData?.firstName} ${tempData?.surname}`}
                        open={statusGridModalOpen}
                        // onCancel={handleCancel}
                        closable={true}
                        footer={[
                            <Button key='back' >
                                Close
                            </Button>,
                            
                        ]}
                    >
                      <div style={{margin:"20px 0px"}}>

                        <button type='button' className='btn btn-primary me-3' onClick={openStatus}>
                          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                          Add
                        </button>
                      </div>
                      <hr></hr>
                      <Table columns={statusColumns} dataSource={statusByEmployee} />
                        
                        <Modal
                        title={isUpdateModalOpen ? `Update` : `Setup`}
                        open={statusModalOpen}
                        onCancel={handleStatusCancel}
                        closable={true}
                        footer={[
                            <Button key='back' onClick={handleStatusCancel}>
                                Cancel
                            </Button>,
                            <Button
                                key='submit'
                                type='primary'
                                htmlType='submit'
                                loading={submitLoading}
                                onClick={isUpdateModalOpen ? handleUpdate : OnSubmitStatus}
                            >
                                Submit
                            </Button>,
                        ]}
                    >
                        <form
                            onSubmit={isUpdateModalOpen ? handleUpdate : OnSubmitStatus}
                        >
                            <hr></hr>
                            <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                                <div className=' mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Status</label>
                                    <select className="form-select form-select-solid" {...register("status")} defaultValue={isUpdateModalOpen === true ? tempData.status : ''} onChange={handleChange} aria-label="Select example">
                                      <option> select</option>
                                      <option value="Activate"> Activate</option>
                                      <option value="Terminate"> Terminate</option>
                                      <option value="Suspended"> Suspended</option>
                                      <option value="End of Contract">End of Contract</option>
                                    </select>
                                    {/* <input type="text" {...register("status")} defaultValue={isUpdateModalOpen === true ? tempData.status : ''} onChange={handleChange} className="form-control form-control-solid" /> */}
                                </div>
                                <div className=' mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Comment</label>
                                    <input type="text" {...register("comment")} defaultValue={isUpdateModalOpen === true ? tempData.comment : ''} onChange={handleChange} className="form-control form-control-solid" />
                                </div>
                                <div className=' mb-7'>
                                    <label htmlFor="exampleFormControlInput1" className="form-label">Date</label>
                                    <input type="date" {...register("date")} min={today} defaultValue={isUpdateModalOpen === true ? tempData.date : ''} onChange={handleChange} className="form-control form-control-solid" />
                                </div>
                            </div>
                        </form>
                    </Modal>
                    </Modal>
                </div>
              </div>
}

          {/* Payroll */}
          {activeTab === 'tab4' &&
            <div className='row col-12'>
  
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Pay Type</label>
                  <select name="payType" onChange={handleChange} value={tempData?.payType} className="form-select form-select-solid" aria-label="Select example">
                    <option value="MONTHLY">MONTHLY</option>
                    <option value="WEEKLY">WEEKLY</option>
                    <option value="HOURLY">HOURLY </option>
                  </select>
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Payment Method</label>
                  <select name="paymentMethod" onChange={handleChange} value={tempData?.paymentMethod} className="form-select form-select-solid" aria-label="Select example">
                    <option value="BANK">BANK</option>
                    <option value="CASH">CASH</option>
                  </select>

                </div>
  
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Bank</label>

                  <br></br>

                  <select onChange={handleChange} value={tempData?.bankId} name='bankId' className="form-select form-select-solid" aria-label="Select example">
                    {BANKS.map((item: any) => (
                      <option value={item.code}>{item.branch}</option>
                    ))}
                  </select>
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Account </label>
                  <input type="text" name="account" onChange={handleChange} value={tempData?.account} className="form-control form-control-solid" />
                </div>
  

                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">TIN </label>
                  <input type="text" name="tin" onChange={handleChange} value={tempData?.tin} className="form-control form-control-solid" />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">SSN </label>
                  <input type="text" name="ssf" onChange={handleChange} value={tempData?.ssf} className="form-control form-control-solid" />
                </div>
              </div>
          }
        </div>
      </div >
      <button className='btn btn-primary' onClick={OnSUbmitUpdate} type="submit">Submit</button>

    </div>
  );
}


export { EmployeeEditForm }