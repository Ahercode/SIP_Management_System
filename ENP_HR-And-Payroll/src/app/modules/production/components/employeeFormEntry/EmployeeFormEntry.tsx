
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Divider, Space, Tabs, TabsProps, message } from 'antd';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Api_Endpoint, ImageBaseUrl, fetchDocument } from '../../../../services/ApiCalls';
import { useAuth } from '../../../auth';
import "./formStyle.css";


const MultiTabForm = () => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('tab1');
  const { register, reset, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<any>(null);
  const [lineManagerId, setLineManagerId] = useState<any>(null);
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  }
  const [previewImage, setPreviewImage] = useState('');
  const [tempImage, setTempImage] = useState<any>();

  const navigate = useNavigate();
  const tenantId = localStorage.getItem('tenant')
  const { currentUser } = useAuth()
  const { data: allEmployees } = useQuery('employees', () => fetchDocument('employees'), { cacheTime: 5000 })
  const { data: allDepartments } = useQuery('departments', () => fetchDocument('departments'), { cacheTime: 5000 })
  const { data: allCategories } = useQuery('categories', () => fetchDocument('categories'), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroups', () => fetchDocument('paygroups'), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitle', () => fetchDocument('jobtitles'), { cacheTime: 5000 })



  const customOptions = allEmployees?.data?.map((item: any) => ({
    value: item.id,
    label: item.firstName + ' ' + item.surname
  }))

  // const handleChangeId = (selectedOption:any ) => {
  //   setLineManagerId(selectedOption?.value)
  // };

  const handleTabChange = (newTab: any) => {
    setActiveTab(newTab);
  }

  // console.log(currentUser?.exp);
  const expiringDate: any = currentUser?.exp

  const dateObj: any = new Date(expiringDate * 1000);

  // to preview the uploaded file
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const showPreview = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (x: any) => {
        setTempImage(
          imageFile
        )
      }
      reader.readAsDataURL(imageFile)
    }
  }

  const onFileChange = (e: any) => {
    const file = e.target.files[0];
    setTempImage(e.target.files[0]);

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
  const handleChangeId = (selectedOption:any ) => {
    setLineManagerId(selectedOption)
    // setLineManagerId(selectedOption?.value)
  };

  const clearImage = () => {
    setPreviewImage('');
  }

  const url = `${Api_Endpoint}/Employees`
  const OnSUbmit = handleSubmit(async (values, event) => {
    event?.preventDefault();
    setLoading(true)
    const formData: any = new FormData();
    formData.append('employeeId', values.employeeId)
    formData.append('firstName', values.firstName)
    formData.append('surname', values.surname)
    formData.append('otherName', values.otherName)
    formData.append('dob', values.dob)
    formData.append('gender', values.gender)
    formData.append('maritalStatus', values.maritalStatus)
    formData.append('phone', values.phone)
    formData.append('alternativePhone', values.alternativePhone)
    formData.append('address', values.address)
    formData.append('residentialAddress', values.residentialAddress)
    formData.append('email', values.email)
    formData.append('personalEmail', values.personalEmail)
    formData.append('paygroupId', parseInt(values.paygroupId))
    formData.append('categoryId', parseInt(values.categoryId))
    formData.append('departmentId', parseInt(values.departmentId))
    formData.append('jobTitleId', parseInt(values.jobTitleId))
    formData.append('annualSalary', parseInt(values.annualSalary))
    formData.append('categoryId', parseInt(values.categoryId))
    formData.append('employmentDate', values.employmentDate)
    formData.append('lineManagerId', lineManagerId?.value)
    formData.append('password', values.firstName + "@omni")
    formData.append('username', values.firstName)
    formData.append('status', values.status)
    formData.append('isAdmin', values.isAdmin)
    formData.append('jobRole', values.jobRole)
    formData.append('imageFile', tempImage)
    formData.append('tenantId', tenantId)

    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    }

    console.log(Object.fromEntries(formData))
    try {
      const response = await axios.post(url, formData, config)
      setSubmitLoading(false)
      message.success('Employee created successfully')
      reset()
      navigate('/employee', { replace: true })
      return response.statusText
    } catch (error: any) {
      setSubmitLoading(false)
      message.error('Error creating employee')
      return error.statusText
    }
  })

  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: <><span className="fw-bold d-block fs-2">Personal details</span></>,
      children: (
        <form onSubmit={OnSUbmit}>
          <div className='row'>
            <div className=' mb-7 '>
              {
                previewImage && (
                  <>
                    <img style={{ borderRadius: "10px", marginBottom: "20px" }} src={previewImage} width={120} height={120}>
                    </img>
                    <p style={{
                      width: "90px",
                      height: "20px",
                      fontSize: "14px",
                      fontWeight: "bold",
                      alignItems: "center",
                      display: "flex",
                      justifyContent: "center",
                      borderRadius: "5px",
                      marginTop: "-15px",
                      marginLeft: "10px",
                      cursor: "pointer",
                    }}
                      onClick={clearImage}
                    >Remove</p>
                  </>
                )
              }{
                !previewImage && (

                  <img style={{ borderRadius: "10px", marginBottom: "20px" }} src={`${ImageBaseUrl}/omniAppraisalApi/uploads/employee/ahercode1.jpg`} width={120} height={120}></img>
                )
              }
              <br></br>
              <label htmlFor="imageFile" className='btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'>Upload Picture</label>
              <input id='imageFile' style={{ visibility: "hidden" }}
                onChange={onFileChange}
                type="file" />
            </div>

            <div className='row mt-3'>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Employee ID</label>
                <input type="text"  {...register("employeeId")} className="form-control form-control-solid" />
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">First Name</label>
                <input type="text"  {...register("firstName")} className="form-control form-control-solid" />
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Surname</label>
                <input type="text" {...register("surname")} className="form-control form-control-solid" />
              </div>
            </div>
            <div className='row mt-3'>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Other Name</label>
                <input type="text" {...register("otherName")} className="form-control form-control-solid" />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Date of Birth</label>
                <input type="date" {...register("dob")} className="form-control form-control-solid" />
              </div>
              <div className='col-2 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Gender</label>
                <select {...register("gender")} className="form-select form-select-solid" aria-label="Select example">
                  <option>Select </option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                </select>
              </div>
              <div className='col-2 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">isAdmin</label>
                <select
                  {...register("isAdmin")} name="isAdmin"
                  className="form-select form-select-solid">
                  <option value="no">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            
            <div className='row mt-3'>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Line Manager</label>
                <Select  
                  isSearchable
                  value={lineManagerId}
                  onChange={handleChangeId}
                  options={customOptions}/>
              </div>
              <div className='col-2 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Marital Status</label>
                <select {...register("maritalStatus")} className="form-select form-select-solid" aria-label="Select example">
                  <option>Select </option>
                  <option value="SINGLE">SINGLE</option>
                  <option value="MARRIED">MARRIED</option>
                </select>
              </div>
              <div className='col-2 mb-7'>
                <label className=" form-label">Employee Status</label>
                <select {...register("status")} name="status" className="form-select form-select-solid" aria-label="Select example">
                    <option value="select">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Annual Salary</label>
                <input type="number" {...register("annualSalary")} className="form-control form-control-solid" />
              </div>
            </div>

            <Divider />


            <div className='row mt-3'>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Employee Group</label>
                <select {...register("paygroupId")} className="form-select form-select-solid" aria-label="Select example">
                  <option>Select </option>
                  {allPaygroups?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Department</label>
                <select {...register("departmentId")} className="form-select form-select-solid" aria-label="Select example">
                  <option>Select </option>
                  {allDepartments?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Job Title</label>
                <select {...register("jobTitleId")} className="form-select form-select-solid" aria-label="Select example">
                  <option>Select </option>
                  {allJobTitles?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className='row mt-3'>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Category</label>
                <select {...register("categoryId")} className="form-select form-select-solid" aria-label="Select example">
                  <option>Select </option>
                  {allCategories?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Employment Date</label>
                <input type="date" {...register("employmentDate")} className="form-control form-control-solid" />

              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Job Roles</label>
                <textarea  {...register("jobRole")} className="form-control form-control-solid" placeholder='list job roles (seperate each role with a comma)' aria-label="With textarea"></textarea>
              </div>
            </div>

          </div>
        </form>
      ),
    },
    {
      key: '2',
      label: <><span className="fw-bold d-block fs-2">Contact details</span></>,
      children: (
        <form onSubmit={OnSUbmit}>
          <div className='row'>
            <div className='col-4 mb-7'>
              <label htmlFor="exampleFormControlInput1" className=" form-label">Phone Number</label>
              <input type="phone" {...register("phone")} className="form-control form-control-solid" />
            </div>
            <div className='col-4 mb-7'>
              <label htmlFor="exampleFormControlInput1" className=" form-label">Alternative Phone number</label>
              <input type="phone" {...register("alternativePhone")} className="form-control form-control-solid" />
            </div>


            <div className='col-4 mb-7'>
              <label htmlFor="exampleFormControlInput1" className=" form-label">Address</label>
              <input type="text" {...register("address")} className="form-control form-control-solid" />
            </div>
            <div className='col-4 mb-7'>
              <label htmlFor="exampleFormControlInput1" className=" form-label">Residential Address</label>
              <input type="text" {...register("residentialAddress")} className="form-control form-control-solid" />
            </div>


            <div className='col-4 mb-7'>
              <label htmlFor="exampleFormControlInput1" className=" form-label">Email</label>
              <input type="email" {...register("email")} className="form-control form-control-solid" />
            </div>
            <div className='col-4 mb-7'>
              <label htmlFor="exampleFormControlInput1" className=" form-label">Personal Email</label>
              <input type="email" {...register("personalEmail")} className="form-control form-control-solid" />
            </div>
          </div>
        </form>
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
        <button className='btn btn-primary' onClick={OnSUbmit} type="submit">Submit</button>
      </div>
    </div>
  );
}


export { MultiTabForm };

