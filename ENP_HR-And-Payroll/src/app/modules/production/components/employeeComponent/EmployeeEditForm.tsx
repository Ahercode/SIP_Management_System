/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import "./formStyle.css"
import { Button, Form, Modal, Space, Table, } from 'antd';
import { Api_Endpoint, fetchCategories, fetchDepartments, fetchDivisions, fetchEmployees, fetchGrades, fetchJobTitles, fetchMedicals, fetchNationalities, fetchNotches, fetchPaygroups, fetchUnits, updateEmployee } from '../../../../services/ApiCalls';
import { KTSVG } from '../../../../../_metronic/helpers';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { BANKS } from '../../../../data/DummyData';
import EmployeeAppraisal from './EmployeeAppraisal';
import EmployeeLeave from './EmployeeLeave';
import EmployeeNote from './EmployeeNote';
import EmployeeTraining from './EmployeeTraining';
import EmployeeCompensation from './EmployeeCompensation';
import EmployeeSkillnQualification from './EmployeeSkillnQual';

const EmployeeEditForm = () => {
  const [activeTab, setActiveTab] = useState('tab1');
  const [activeTab2, setActiveTab2] = useState('medical');
  const [medicalOpen, setMedicalOpen] = useState(false)
  const [familyOpen, setFamilyOpen] = useState(false)
  const [statusModalOpen, setIsStatusModalOpen] = useState(false)
  const [statusGridModalOpen, setStatusGridModalOpen] = useState(false)
  const [medicalEntryData, setMedicalEntryData] = useState([])
  const [familyData, setFamilyData] = useState([])
  const [statusData, setStatusData] = useState([])
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState()
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const [tempData, setTempData] = useState<any>()
  // const [graName, setGraName] = useState<any>()
  // const [depName, setDepName] = useState<any>()
  // const [divName, setDivName] = useState<any>()
  // const [jobTName, setJobTName] = useState<any>()
  // const [uniName, setUniName] = useState<any>()
  // const [paygName, setPaygName] = useState<any>()
  // const [catName, setCatName] = useState<any>()
  // const [notchName, setNotchName] = useState<any>()
  // const [newPay, setNewPay] = useState([])
  const tenantId = localStorage.getItem('tenant')
  const [tempImage, setTempImage] = useState<any>();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('');
  const navigate = useNavigate();

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  }
  const handleTab2Click = (tab2: any) => {
    setActiveTab2(tab2);
  }

  const openStatus = () => {
    setIsStatusModalOpen(true)
  }
  const openStatusGrid = () => {
    setStatusGridModalOpen(true)
  }

  const handleChange = (event: any) => {
    // event.preventDefault()
    setTempData({ ...tempData, [event.target.name]: event.target.value });
  }
 
  const showMedicalModal = () => {
    setMedicalOpen(true)
  }

  const showFamilyModal = () => {
    setFamilyOpen(true)
  }

  const deleteFamMem = async (element: any) => {
    try {
      const response = await axios.delete(`${Api_Endpoint}/FamilyMembers/${element.id}`)
      // update the local state so that react can refecth and re-render the table with the new data
      const newData = familyData.filter((item: any) => item.id !== element.id)
      setFamilyData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }

  const deleteMedicalEntry = async (element: any) => {
    try {
      const response = await axios.delete(`${Api_Endpoint}/MedicalEntries/${element.id}`)
      // update the local state so that react can refecth and re-render the table with the new data
      const newData = medicalEntryData.filter((item: any) => item.id !== element.id)
      setMedicalEntryData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }

  function handleFamilyDelete(element: any) {
    deleteFamMem(element)
  }
  function handleMedicalEntryDelete(element: any) {
    deleteMedicalEntry(element)

  }

  const handleCancel = () => {
    setMedicalOpen(false)
    setFamilyOpen(false)
    setStatusGridModalOpen(false)

  }

  const handleStatusCancel = () => {
    reset()
    setIsStatusModalOpen(false)
  }

  const [submitLoading, setSubmitLoading] = useState(false)

  const familyColumns: any = [

    {
      title: 'National ID',
      dataIndex: 'nationalId',
      sorter: (a: any, b: any) => {
        if (a.nationalId > b.nationalId) {
          return 1
        }
        if (b.nationalId > a.nationalId) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Prénoms',
      dataIndex: 'firstName',
      sorter: (a: any, b: any) => {
        if (a.firstName > b.firstName) {
          return 1
        }
        if (b.firstName > a.firstName) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Nom',
      dataIndex: 'surname',
      sorter: (a: any, b: any) => {
        if (a.surname > b.surname) {
          return 1
        }
        if (b.surname > a.surname) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Autres Nom',
      dataIndex: 'otherName',
      sorter: (a: any, b: any) => {
        if (a.otherName > b.otherName) {
          return 1
        }
        if (b.otherName > a.otherName) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Lien de parenté',
      dataIndex: 'relationship',
      sorter: (a: any, b: any) => {
        if (a.relationship > b.relationship) {
          return 1
        }
        if (b.relationship > a.relationship) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Date de Naissance',
      dataIndex: 'dob',
      sorter: (a: any, b: any) => {
        if (a.dob > b.dob) {
          return 1
        }
        if (b.dob > a.dob) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Téléphone',
      dataIndex: 'phone',
      sorter: (a: any, b: any) => {
        if (a.phone > b.phone) {
          return 1
        }
        if (b.phone > a.phone) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Addresse',
      dataIndex: 'address',
      sorter: (a: any, b: any) => {
        if (a.address > b.address) {
          return 1
        }
        if (b.address > a.address) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Note',
      dataIndex: 'note',
      sorter: (a: any, b: any) => {
        if (a.note > b.note) {
          return 1
        }
        if (b.note > a.note) {
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
          <a onClick={() => handleFamilyDelete(record)} className='btn btn-light-danger btn-sm'>
            Delete
          </a>

        </Space>
      ),

    },
  ]

  const medicalColumns: any = [

    {
      title: 'Type Medicale ',
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
      title: 'Date',
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
      title: 'Commentaires',
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
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <a onClick={() => handleMedicalEntryDelete(record)} className='btn btn-light-danger btn-sm'>
            Delete
          </a>
        </Space>
      ),

    },
  ]

  const statusColumns: any = [

    {
      title: 'Statut',
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
      title: 'Commentaires',
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

  // validates input field to accept only numbers
  const validatePhoneNumber = (event: any) => {
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }

  const { data: allEmployees } = useQuery('employees', () => fetchEmployees(tenantId), { cacheTime: 100000 })
  const { data: allDepartments } = useQuery('departments', () => fetchDepartments(tenantId), { cacheTime: 5000 })
  const { data: allDivisions } = useQuery('divisions', () => fetchDivisions(tenantId), { cacheTime: 5000 })
  const { data: allCategories } = useQuery('categories', () => fetchCategories(tenantId), { cacheTime: 5000 })
  const { data: allPaygroups } = useQuery('paygroups', () => fetchPaygroups(tenantId), { cacheTime: 5000 })
  const { data: allUnits } = useQuery('units', () => fetchUnits(tenantId), { cacheTime: 5000 })
  const { data: allGrades } = useQuery('grades', () => fetchGrades(tenantId), { cacheTime: 5000 })
  const { data: allNotches } = useQuery('notches', () => fetchNotches(tenantId), { cacheTime: 5000 })
  const { data: allNations } = useQuery('nations', () => fetchNationalities(tenantId), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitle', () => fetchJobTitles(tenantId), { cacheTime: 5000 })
  const { data: paygroups } = useQuery('paygroups', () => fetchPaygroups(tenantId), { cacheTime: 5000 })
  const { data: medicals } = useQuery('medicals', () => fetchMedicals(tenantId), { cacheTime: 5000 })



  // const fetchImage = async () => {
  //   const res = await fetch("https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80");
  //   const imageBlob = await res.blob();
  //   const imageObjectURL: any = URL.createObjectURL(imageBlob);
  //   setImg(imageObjectURL);
  // };

  const loadStatus = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Api_Endpoint}/EmployeeStatus`)
      setStatusData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const loadFamilyMembers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Api_Endpoint}/FamilyMembers/tenant/${tenantId}`)
      setFamilyData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  const loadMedicalEntry = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Api_Endpoint}/Medicals/tenant/${tenantId}`)
      setMedicalEntryData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }



  // useEffect(() => {


  //   const getDepartmentName = () => {
  //     let departmentName = null
  //     allDepartments?.data.map((item: any) => {
  //       if (item.id === tempData?.departmentId) {
  //         departmentName = item.name
  //       }
  //     })
  //     return setDepName(departmentName)
  //   }

  //   const getGradeName = () => {
  //     let gradeName = ""
  //     allGrades?.data.map((item: any) => {
  //       if (item.id === tempData?.gradeId) {
  //         gradeName = item.name
  //       }
  //     })
  //     return setGraName(gradeName)
  //   }

  //   const getUnitName = () => {
  //     let unitName = ""
  //     allUnits?.data.map((item: any) => {
  //       if (item.id === tempData?.unitId) {
  //         unitName = item.name
  //       }
  //     })
  //     return setUniName(unitName)
  //   }

  //   const getJobTName = () => {
  //     let jobTitleName = ""
  //     allJobTitles?.data.map((item: any) => {
  //       if (item.id === tempData?.jobTitleId) {
  //         jobTitleName = item.name
  //       }
  //     })
  //     return setJobTName(jobTitleName)
  //   }

  //   const getCatName = () => {
  //     let categoryName = ""
  //     allCategories?.data.map((item: any) => {
  //       if (item.id === tempData?.categoryId) {
  //         categoryName = item.name
  //       }
  //     })
  //     return setCatName(categoryName)
  //   }

  //   const getDivisionName = () => {
  //     let divisionName = ""
  //     allDivisions?.data.map((item: any) => {
  //       if (item.id === tempData?.divisionId) {
  //         divisionName = item.name
  //       }
  //     })
  //     return setDivName(divisionName)
  //   }

  //   const getPaygroupName = () => {
  //     let paygroupName = null
  //     allPaygroups?.data.map((item: any) => {
  //       if (item.id === tempData?.paygroupId) {
  //         paygroupName = item.name
  //       }
  //     })
  //     return setPaygName(paygroupName)
  //   }

  //   const getNotchName = () => {
  //     let notchName = null
  //     allNotches?.data.map((item: any) => {
  //       if (item.id === tempData?.notchId) {
  //         notchName = item.name
  //       }
  //     })
  //     return setNotchName(notchName)
  //   }

  //   getCatName()
  //   getJobTName()
  //   getUnitName()
  //   getDivisionName()
  //   getDepartmentName()
  //   getPaygroupName()
  //   getNotchName()
  //   getGradeName()
  // })

  useEffect(() => {
    // const newData = allPaygroups?.data.filter((item: any) => item.id !== tempData?.paygroupId)
    // setNewPay(newData)

    const dataByID = allEmployees?.data.find((employee: any) => {
      return employee.id.toString() === param.id
    })
    const getEmployeeById = () => {
      setTempData(dataByID)
    }

    getEmployeeById()
    loadMedicalEntry()
    loadFamilyMembers()
    loadStatus()
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

  const familyByEmployee = familyData.filter((qualification: any) => {
    return qualification.employeeId.toString() === param.id
  })


  const queryClient = useQueryClient()
  const { isLoading, mutate } = useMutation(updateEmployee, {
    onSuccess: (data) => {
      queryClient.invalidateQueries('employees')
      navigate('/employee', { replace: true })
      // queryClient.invalidateQueries(['employees', tempData.id]);
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
      loadStatus()
      return response.statusText
    } catch (error: any) {
      setSubmitLoading(false)
      return error.statusText
    }
  })

  const url3 = `${Api_Endpoint}/FamilyMembers`
  const submitFamilys = handleSubmit(async (values: any) => {
    setLoading(true)
    const data = {
      nationalId: values.nationalId,
      firstName: values.firstName,
      surname: values.surname,
      otherName: values.otherName,
      dob: values.dob,
      relationship: values.relationship,
      address: values.address,
      phone: values.phone,
      note: values.note,
      employeeId: parseInt(param.id),
      tenantId: tenantId,
    }
    try {
      const response = await axios.post(url3, data)
      setSubmitLoading(false)
      reset()
      setFamilyOpen(false)
      loadFamilyMembers()
      return response.statusText
    } catch (error: any) {
      setSubmitLoading(false)
      return error.statusText
    }
  })

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
      <h3>You are updating <span style={{ color: "#FF6363" }}>  {tempData?.firstName} {tempData?.surname}</span></h3>
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
        <button
          className={`tab ${activeTab === 'tab4' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab4')}
        >
          Payroll
        </button>
        <button
          className={`tab ${activeTab === 'tab8' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab8')}
        >
          Skills & Qualifications
        </button>


        <button
          className={`tab ${activeTab === 'tab7' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab7')}
        >
          Compensations
        </button>
        <button
          className={`tab ${activeTab === 'tab6' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab6')}
        >
          Trainings
        </button>
        <button
          className={`tab ${activeTab === 'tab9' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab9')}
        >
          Appraisals
        </button>
        <button
          className={`tab ${activeTab === 'tab5' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab5')}
        >
          Notes
        </button>
        <button
          className={`tab ${activeTab === 'tab10' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab10')}
        >
          Leaves
        </button>
        <button
          className={`tab ${activeTab === 'tab11' ? 'active' : ''}`}
          onClick={() => handleTabClick('tab11')}
        >
          Medicals & Family
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
              <img style={{borderRadius:"10px", marginBottom:"20px"}} src={`http://enp.sipconsult.net/hrwebapi/uploads/employee/${tempData?.imageUrl}`} width={150} height={150}></img>:
              <img style={{borderRadius:"10px",marginBottom:"20px"}} src={`http://enp.sipconsult.net/hrwebapi/uploads/employee/ahercode1.jpg`} width={150} height={150}></img>
              )
            }
            {
              previewImage&&(
                    <img style={{ borderRadius: "10px", marginBottom: "20px" }} src={previewImage} width={150} height={150}></img>
                  )
                }
                <br></br>
                <label htmlFor="imageFile" className='btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary'>Change Picture</label>
                <input id='imageFile' style={{ visibility: "hidden" }}  {...register("imageUrl")}
                  onChange={handleImageChange}
                  type="file" />
              </div>
              <div className='row col-12'>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">ID Employé</label>
                  <input type="text" {...register("phone")}
                    name="employeeId"
                    onChange={handleChange}
                    value={tempData?.employeeId} className="form-control form-control-solid" />
                </div>

                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Prénoms</label>
                  <input type="text" {...register("firstName")}
                    name="firstName"
                    onChange={handleChange}
                    value={tempData?.firstName} className="form-control form-control-solid" />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Nom</label>
                  <input type="text" {...register("surname")}
                    name="surname"
                    onChange={handleChange}
                    value={tempData?.surname} className="form-control form-control-solid" />
                </div>

                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className="form-label">Autres nom</label>
                  <input type="text" {...register("otherName")}
                    name="otherName"
                    onChange={handleChange}
                    value={tempData?.otherName} className="form-control form-control-solid" />
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Date de Naissance</label>
                  <input type="date" {...register("date")}
                    name="dob"
                    onChange={handleChange}
                    value={tempData?.dob?.substring(0, 10)} className="form-control form-control-solid" />
                </div>


                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Genre</label>
                  <select
                    {...register("gender")} name="gender"
                    onChange={handleChange}
                    value={tempData?.gender}
                    className="form-select form-select-solid" aria-label="Select example">
                    <option value="MALE">MASCULIN</option>
                    <option value="FEMALE">FEMININ</option>
                  </select>
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">S. Matrimoniale</label>
                  <select
                    {...register("maritalStatus")} name="maritalStatus"
                    onChange={handleChange}
                    value={tempData?.maritalStatus}
                    className="form-select form-select-solid" aria-label="Select example">
                    <option value="SINGLE">CELIBATAIRE</option>
                    <option value="MARRIED">MARIE</option>

                  </select>
                </div>

                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Nationalité</label>
                  <select
                    {...register("nationality")} name="nationality"
                    onChange={handleChange}
                    value={parseInt(tempData?.nationality)}
                    className="form-select form-select-solid" aria-label="Select example">
                    {allNations?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}

                  </select>
                </div>
                <div className='col-4 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Numéro ID</label>
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
                <label htmlFor="exampleFormControlInput1" className=" form-label">Téléphone</label>
                <input type="phone"
                  {...register("phone")} name="phone"
                  onChange={handleChange}
                  value={tempData?.phone}
                  pattern="[0-9]*" className="form-control form-control-solid" />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Numero Alternative</label>
                <input type="phone" value={tempData?.alternativePhone}
                  {...register("alternativePhone")} name="alternativePhone"
                  maxLength={15}
                  onKeyPress={validatePhoneNumber}
                  onChange={handleChange}
                  className="form-control form-control-solid" />
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Addresse</label>
                <input type="text"
                  {...register("address")} name="address"
                  value={tempData?.address}
                  onChange={handleChange}
                  className="form-control form-control-solid" />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Addresse Residentielle </label>
                <input type="text" {...register("residentialAddress")} name="residentialAddress"
                  value={tempData?.residentialAddress} onChange={handleChange} className="form-control form-control-solid" />
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Email</label>
                <input type="email" {...register("email")} name="email" value={tempData?.email?.toLowerCase()} onChange={handleChange} className="form-control form-control-solid" />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Email Personel</label>
                <input type="email" {...register("personalEmail")} name="personalEmail" value={tempData?.personalEmail} onChange={handleChange} className="form-control form-control-solid" />
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Proche</label>
                <input type="text" {...register("nextOfKin")} name="nextOfKin" value={tempData?.nextOfKin} onChange={handleChange} className="form-control form-control-solid" />
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Garant</label>
                <input type="text" {...register("guarantor")} name="guarantor" value={tempData?.guarantor} onChange={handleChange} className="form-control form-control-solid" />
              </div>
            </div>

          }


          {/* Administration */}
          {activeTab === 'tab3' &&
            <div className='row col-12'>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Groupe de paie</label>
                <select {...register("paygroupId")} value={tempData?.paygroupId} name='paygroupId' onChange={handleChange} className="form-select form-select-solid" aria-label="Select example">
                  {paygroups?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Division</label>
                <select  {...register("divisionId")} name="divisionId" onChange={handleChange} value={tempData?.divisionId} className="form-select form-select-solid" aria-label="Select example">
                  {allDivisions?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Categorie</label>
                <select  {...register("categoryId")} name="categoryId" onChange={handleChange} value={tempData?.categoryId} className="form-select form-select-solid" aria-label="Select example">
                  {allCategories?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Grade</label>
                <select  {...register("gradeId")} name="gradeId" onChange={handleChange} value={tempData?.gradeId} className="form-select form-select-solid" aria-label="Select example">
                  {allGrades?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>


              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Departement</label>
                <select  {...register("departmentId")} name="departmentId" onChange={handleChange} value={tempData?.departmentId} className="form-select form-select-solid" aria-label="Select example">
                  {allDepartments?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Titre</label>
                <select  {...register("jobTitleId")} name="jobTitleId" onChange={handleChange} value={tempData?.gradeId} className="form-select form-select-solid" aria-label="Select example">
                  {allJobTitles?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Notch</label>
                <select  {...register("notchId")} name="notchId" onChange={handleChange} value={tempData?.notchId} className="form-select form-select-solid" aria-label="Select example">
                  {allNotches?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Unité</label>
                <select  {...register("unitId")} name="unitId" onChange={handleChange} value={tempData?.unitId} className="form-select form-select-solid" aria-label="Select example">
                  {allUnits?.data.map((item: any) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>

              <div className='col-4 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Roles</label>
                <textarea  {...register("jobRole")} name="jobRole" value={tempData?.jobRole} onChange={handleChange} className="form-control form-control-solid" placeholder='list job roles (seperate each role with a comma)' aria-label="With textarea"></textarea>

              </div>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Date de prise de fonction</label>
                <input type="date"  {...register("employmentDate")} name="employmentDate" value={tempData?.employmentDate?.substring(0, 10)} onChange={handleChange} className="form-control form-control-solid" />

              </div>
              <div className='col-3 mb-7'>
                <label htmlFor="exampleFormControlInput1" className=" form-label">Statut recent</label>
                <br></br>
                <span className="form-control form-control-solid">{highestIdItem?.status} - {highestIdItem?.date.substring(0, 10)}</span>

                {/* <input  disabled value={highestIdItem?.status - highestIdItem?.date.substring(0,10)} className="form-control form-control-solid" /> */}

              </div>
              <div className='col-3 mb-7 py-2'>
                <br></br>
                <a onClick={openStatusGrid} className="btn btn-danger"> Changer Statut</a>
                <Modal
                  title={`Status for ${tempData?.firstName} ${tempData?.surname}`}
                  open={statusGridModalOpen}
                  onCancel={handleCancel}
                  closable={true}
                  footer={[
                    <Button key='back' onClick={handleCancel}>
                      Close
                    </Button>,

                  ]}
                >
                  <div style={{ margin: "20px 0px" }}>

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
                          <label htmlFor="exampleFormControlInput1" className="form-label">Statut</label>
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
                          <label htmlFor="exampleFormControlInput1" className="form-label">Commentaires</label>
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
                <label htmlFor="exampleFormControlInput1" className=" form-label">Type Paye </label>
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

          {/* skills & qualifications */}
          {activeTab === 'tab8' &&

            <EmployeeSkillnQualification employeeId={tempData?.id} />

          }

          {/* Compensation */}
          {activeTab === 'tab7' &&

            <EmployeeCompensation/>
            
            // <div >
            //   <Table columns={compensationColumns} />
            // </div>
            
          }

          {/* Trainings */}
          {activeTab === 'tab6' &&

            <EmployeeTraining/>

          }

          {/* Appraisal */}
          {activeTab === 'tab9' &&
            <EmployeeAppraisal/>
            
          }

          {/* Notes */}
          {activeTab === 'tab5' &&
            <EmployeeNote/>
          }

          {/* Leave */}
          {activeTab === 'tab10' &&
            
            <EmployeeLeave/>
          }

          {/* Medical */}
          {activeTab === 'tab11' &&
            <div >
              <div className="tab2s">

                <button
                  className={`tab2 ${activeTab2 === 'medical' ? 'active' : ''}`}
                  onClick={() => handleTab2Click('medical')}
                >
                  Medical
                </button>
                <button
                  className={`tab2 ${activeTab2 === 'fam' ? 'active' : ''}`}
                  onClick={() => handleTab2Click('fam')}
                >
                  Family
                </button>
              </div>
              <br></br>
              <div className='tab2-content'>
                {activeTab2 === 'medical' &&
                  <div >

                    <button style={{ margin: "0px 0px 20px 0" }} type='button' className='btn btn-primary me-3' onClick={showMedicalModal}>
                      <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                      Add New Medical
                    </button>

                    <Table columns={medicalColumns} />
                    <Modal
                      title="Ajouter Medical"
                      open={medicalOpen}
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
                          onClick={() => {

                          }}
                        >
                          Submit
                        </Button>,
                      ]}
                    >
                      <Form
                        labelCol={{ span: 7 }}
                        wrapperCol={{ span: 14 }}
                        layout='horizontal'
                        name='control-hooks'

                      >
                        <hr></hr>
                        <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                          <div className=' mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Type Medical</label>
                            <select className="form-select form-select-solid" aria-label="Select example">
                              <option> select</option>
                              {medicals?.data.map((item: any) => (
                                <option value={item.id}>{item.name}</option>
                              ))}
                            </select>
                          </div>
                          <div className=' mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Nom</label>
                            <input type="text" name="name" className="form-control form-control-solid" />
                          </div>

                        </div>
                      </Form>
                    </Modal>
                  </div>}
                {activeTab2 === 'fam' &&
                  <div >

                    <button style={{ margin: "0px 0px 20px 0" }} type='button' className='btn btn-primary me-3' onClick={showFamilyModal}>
                      <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                      Ajouter Nouvelle Famille
                    </button>

                    <Table columns={familyColumns} dataSource={familyByEmployee} loading={loading} />
                    <Modal
                      title="Add Family Member"
                      open={familyOpen}
                      onCancel={handleCancel}
                      closable={true}
                      width={800}
                      footer={[
                        <Button key='back' onClick={handleCancel}>
                          Cancel
                        </Button>,
                        <Button
                          key='submit'
                          type='primary'
                          htmlType='submit'
                          loading={submitLoading}
                          onClick={submitFamilys}
                        >
                          Submit
                        </Button>,
                      ]}
                    >
                      <form
                        onSubmit={submitFamilys}
                      >
                        <hr></hr>
                        <div className='row mb-0'>
                          <div className='col-6 mb-7'>
                            {/* <Upload
                                
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}


                            onPreview={onPreview}
                          > 
                            <UploadOutlined />
                          </Upload> */}
                          </div>

                        </div>
                        <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
                          <div className='col-6 mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Numero ID</label>
                            <input type="text" {...register("nationalId")} className="form-control form-control-solid" />
                          </div>
                          <div className='col-6 mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Prénoms</label>
                            <input type="text" {...register("firstName")} className="form-control form-control-solid" />
                          </div>

                        </div>
                        <div style={{ padding: "0px 20px 20px 20px" }} className='row mb-0 '>
                          <div className='col-6 mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Nom</label>
                            <input type="text" {...register("surname")} className="form-control form-control-solid" />
                          </div>
                          <div className='col-6 mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Autres Nom</label>
                            <input type="text" {...register("otherName")} className="form-control form-control-solid" />
                          </div>

                        </div>
                        <div style={{ padding: "0px 20px 20px 20px" }} className='row mb-0 '>
                          <div className='col-6 mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Lien de parente</label>
                            <select className="form-select form-select-solid" {...register("relationship")} aria-label="Select example">
                              <option>select </option>
                              <option value="SPOUSE">SPOUSE</option>
                              <option value="PARENT">PARENT</option>
                              <option value="CHILD">CHILD</option>
                              <option value="SIBLING">SIBLING</option>
                            </select>
                          </div>
                          <div className='col-6 mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Date de Naissance</label>
                            <input type="date" {...register("dob")} className="form-control form-control-solid" />
                          </div>

                        </div>
                        <div style={{ padding: "0px 20px 20px 20px" }} className='row mb-0 '>
                          <div className='col-6 mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Addresse</label>
                            <input type="text" {...register("address")} className="form-control form-control-solid" />
                          </div>
                          <div className='col-6 mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Téléphone</label>
                            <input type="text" {...register("phone")} className="form-control form-control-solid" />
                          </div>

                        </div>
                        <div style={{ padding: "0px 20px 20px 20px" }} className='row mb-0 '>
                          <div className=' mb-7'>
                            <label htmlFor="exampleFormControlInput1" className="form-label">Notes</label>
                            <textarea {...register("note")} className="form-control form-control-solid"> </textarea>
                            {/* <textarea style={{margin: "10px 0px 0 0px"}} className="form-control form-control-solid"  aria-label="With textarea"></textarea> */}
                          </div>
                        </div>
                      </form>
                    </Modal>
                  </div>}
              </div>

            </div>}
        </div>
      </div >
      {
        activeTab === 'tab1'||activeTab === 'tab2'||activeTab === 'tab3'||activeTab === 'tab4' ?
        <button className='btn btn-primary' onClick={OnSUbmitUpdate} type="submit">Submit</button>:null
      }

    </div>
  );
}

export { EmployeeEditForm }




