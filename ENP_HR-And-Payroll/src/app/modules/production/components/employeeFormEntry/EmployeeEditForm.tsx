/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./formStyle.css"
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Button, Divider, Form, Modal, Space, Table, Tabs, TabsProps, } from 'antd';
import { Api_Endpoint, fetchCategories, fetchDepartments, fetchDivisions, fetchDocument, fetchEmployees, fetchExperiences, fetchGrades, fetchJobTitles, fetchMedicals, fetchNationalities, fetchNotches, fetchPaygroups, fetchQualifications, fetchSkills, fetchUnits, updateEmployee } from '../../../../services/ApiCalls';
import { KTSVG } from '../../../../../_metronic/helpers';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { BANKS } from '../../../../data/DummyData';
import { ArrowLeftOutlined } from "@ant-design/icons"
import { getFieldName } from '../ComponentsFactory';

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
  const [catName, setCatName] = useState<any>()

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

  const handleTabClick = (tab: any) => {
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
      render: (row: any) => {
        return row.date?.substring(0, 10)
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
  const { data: allEmployees } = useQuery('employees', () => fetchDocument('employees'), { cacheTime: 5000 })
  const { data: allDepartments } = useQuery('departments', () => fetchDepartments(tenantId), { cacheTime: 5000 })
  // const { data: allDivisions } = useQuery('divisions',()=> fetchDivisions(tenantId), { cacheTime: 5000 })
  const { data: allCategories } = useQuery('categories', () => fetchCategories('Categories'), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroups', () => fetchDocument('paygroups'), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitle', () => fetchDocument('jobtitles'), { cacheTime: 5000 })



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

    setCatName(getFieldName(tempData?.categoryId, allCategories?.data))

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


  const statusByEmployee: any = statusData.filter((section: any) => {
    return section.employeeId.toString() === param.id
  })

  const recentStatus: any = statusByEmployee?.find((item: any) => {
    return item.index === (statusByEmployee.length - 1)
  })

  let highestIdItem: any = null;
  let highestId: any = -1;

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

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    setTempImage(file);

    if (file) {
      const reader: any = new FileReader();
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
  const OnSUbmitUpdate = handleSubmit(async () => {
    setLoading(true)
    const formData: any = new FormData();
    formData.append('id', parseInt(tempData.id))
    formData.append('employeeId', tempData.employeeId == null ? "" : tempData.employeeId)
    formData.append('firstName', tempData.firstName == null ? "" : tempData.firstName)
    formData.append('surname', tempData.surname == null ? "" : tempData.surname)
    formData.append('otherName', tempData.otherName == null ? "" : tempData.otherName)
    formData.append('dob', tempData.dob == null ? "" : tempData.dob)
    formData.append('gender', tempData.gender == null ? "" : tempData.gender)
    formData.append('maritalStatus', tempData.maritalStatus == null ? "" : tempData.maritalStatus)
    formData.append('nationality', tempData.nationality == null ? "" : tempData.nationality)
    formData.append('nationalId', tempData.nationalId == null ? "" : tempData.nationalId)
    formData.append('phone', tempData.phone == null ? "" : tempData.phone)
    formData.append('alternativePhone', tempData.alternativePhone == null ? "" : tempData.alternativePhone)
    formData.append('address', tempData.address == null ? "" : tempData.address)
    formData.append('residentialAddress', tempData.residentialAddress == null ? "" : tempData.residentialAddress)
    formData.append('email', tempData.email == null ? "" : tempData.email)
    formData.append('personalEmail', tempData.personalEmail == null ? "" : tempData.personalEmail)
    formData.append('jobRole', tempData.jobRole == null ? "" : tempData.jobRole)
    formData.append('nextOfKin', tempData.nextOfKin == null ? "" : tempData.nextOfKin)
    formData.append('guarantor', tempData.guarantor == null ? "" : tempData.guarantor)
    formData.append('paygroupId', tempData.paygroupId == null ? "" : parseInt(tempData.paygroupId))
    formData.append('categoryId', tempData.categoryId == null ? "" : parseInt(tempData.categoryId))
    formData.append('divisionId', tempData.divisionId == null ? "" : parseInt(tempData.divisionId))
    formData.append('departmentId', tempData.departmentId == null ? "" : parseInt(tempData.departmentId))
    formData.append('gradeId', tempData.gradeId == null ? "" : parseInt(tempData.gradeId))
    formData.append('notchId', tempData.notchId == null ? "" : tempData.notchId)
    formData.append('jobTitleId', tempData.jobTitleId == null ? "" : parseInt(tempData.jobTitleId))
    formData.append('employmentDate', tempData.employmentDate == null ? "" : tempData.employmentDate)
    formData.append('payType', tempData.payType == null ? "" : tempData.payType)
    formData.append('paymentMethod', tempData.paymentMethod == null ? "" : tempData.paymentMethod)
    formData.append('bankId', tempData.bankId == null ? "" : tempData.bankId)
    formData.append('account', tempData.account == null ? "" : tempData.account)
    formData.append('tin', tempData.tin == null ? "" : tempData.tin)
    formData.append('ssf', tempData.ssf == null ? "" : tempData.ssf)
    formData.append('imageFile', tempImage ? tempImage : "")
    formData.append('tenantId', tenantId)


    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    console.log(Object.fromEntries(formData))
    try {
      const response = await axios.put(uRL, formData, config)
      setSubmitLoading(false)
      navigate('/employee', { replace: true })
      return response.statusText
    } catch (error: any) {
      setSubmitLoading(false)
      return error.statusText
    }
  })

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: <><span className="fw-bold d-block fs-2">Personal details</span></>,
      children: (
        <>
          <div className='row'>
            <div className=' mb-7 '>
              {
                !previewImage && (
                  tempData?.imageUrl !== null ?
                    <img style={{ borderRadius: "10px", marginBottom: "20px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${tempData?.imageUrl}`} width={150} height={150}></img> :
                    <img style={{ borderRadius: "10px", marginBottom: "20px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`} width={150} height={150}></img>
                )
              }
              {
                previewImage && (

                  <img style={{ borderRadius: "10px", marginBottom: "20px" }} src={previewImage} width={150} height={150}></img>
                )
              }
              <br></br>
              <label htmlFor="imageFile" className='btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'>Change Picture</label>
              <input id='imageFile' style={{ visibility: "hidden" }}  {...register("imageUrl")}
                onChange={handleImageChange}
                type="file" />
            </div>

            <div className='row mt-3'>
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
            </div>

            <div className='row mt-3'>
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
                  value={tempData?.dob?.substring(0, 10)} className="form-control form-control-solid" />
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
            </div>
            <div className='row mt-3'>
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
                <label htmlFor="exampleFormControlInput1" className=" form-label">Annual Salary</label>
                <input type="number" {...register("annualSalary")}
                  onChange={handleChange}
                  value={tempData?.annualSalary}
                  className="form-control form-control-solid" />
              </div>
            </div>

            <Divider />


            <div className='row mt-3'>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Employee Group</label>
                <select {...register("paygroupId")} value={tempData?.paygroupId} name='paygroupId' onChange={handleChange} className="form-select form-select-solid" aria-label="Select example">
                  {allPaygroups?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Department</label>
                <select  {...register("departmentId")} name="departmentId" onChange={handleChange} value={tempData?.departmentId} className="form-select form-select-solid" aria-label="Select example">
                  {allDepartments?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Job Title</label>
                <select  {...register("jobTitleId")} name="jobTitleId" onChange={handleChange} value={tempData?.gradeId} className="form-select form-select-solid" aria-label="Select example">
                  <option>{jobTName} </option>
                  {allJobTitles?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>


            <div className='row mt-3'>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Category</label>
                <select  {...register("categoryId")} name="categoryId" onChange={handleChange} value={tempData?.categoryId} className="form-select form-select-solid" aria-label="Select example">
                  <option>{catName} </option>
                  {allCategories?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Employment Date</label>
                <input type="date"  {...register("employmentDate")} name="employmentDate" value={tempData?.employmentDate?.substring(0, 10)} onChange={handleChange} className="form-control form-control-solid" />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Job Roles</label>
                <textarea  {...register("jobRole")} name="jobRole" value={tempData?.jobRole} onChange={handleChange} className="form-control form-control-solid" placeholder='list job roles (seperate each role with a comma)' aria-label="With textarea"></textarea>
              </div>
            </div>

          </div>
        </>
      ),
    },
    {
      key: '2',
      label: <><span className="fw-bold d-block fs-2">Contact details</span></>,
      children: (
        <>
          <div className='row'>
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
              <input type="email" {...register("email")} name="email" value={tempData?.email?.toLowerCase()} onChange={handleChange} className="form-control form-control-solid" />
            </div>
            <div className='col-4 mb-7'>
              <label htmlFor="exampleFormControlInput1" className=" form-label">Personal Email</label>
              <input type="email" {...register("personalEmail")} name="personalEmail" value={tempData?.personalEmail} onChange={handleChange} className="form-control form-control-solid" />
            </div>
          </div>
        </>
      ),
    },
  ]
  const onTabsChange = (key: string) => {
    console.log(key);
  };


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
      {/* <h3>You are updating <span style={{ color: "#FF6363" }}>  {tempData?.firstName} {tempData?.surname}</span></h3>
      <br></br> */}
      <Space>
        <Link to="/employee">
          <Button
            className="btn btn-light-primary me-4"
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
            type="primary" shape="circle" icon={<ArrowLeftOutlined rev={''} />} size={'large'}
          />
        </Link>
        <span className="fw-bold text-gray-600 d-block fs-2">Back</span>
      </Space>
      <Tabs defaultActiveKey="1"
        type="line"
        items={tabItems}
        onChange={onTabsChange}
        className='mt-5'
      />
      <div className='d-flex align-items-end justify-content-end align-content-end' >
        <button className='btn btn-primary' onClick={OnSUbmitUpdate} type="submit">Submit</button>
      </div>
    </div>
  );
}




export { EmployeeEditForm }