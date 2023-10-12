import { Button, Form, Input, Modal, Space, Table, Radio, RadioChangeEvent, message } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { KTCardBody, KTSVG, toAbsoluteUrl } from '../../../../../../_metronic/helpers'
import { ENP_URL } from '../../../urls'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useForm } from 'react-hook-form'
import {  useQuery, useQueryClient } from 'react-query'
import { Api_Endpoint, fetchCategories, fetchJobTitles, fetchPaygroups, fetchRecruitmentTransactions, fetchUnits } from '../../../../../services/ApiCalls'
import { forUdateButton } from './Common/customInfoAlert'



const tempImg = toAbsoluteUrl('/media/avatars/user.png')

const RecruitmentSelection = () => {
  const [gridData, setGridData] = useState([])
  const [recruitData, setRecruitData] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  let [filteredData] = useState([])
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefModalOpen, setIsRefModalOpen] = useState(false)
  const [isShortModalOpen, setIsShortModalOpen] = useState(false)
  const [radioValue, setRadioValue] = useState();
  const [radio1Value, setRadio1Value] = useState();
  const [radio2Value, setRadio2Value] = useState();
  const [radio3Value, setRadio3Value] = useState();
  const [radio4Value, setRadio4Value] = useState();
  const [selectedValue, setSelectedValue] = useState<any>("");
  const [selectedGen, setSelectedGen] = useState<any>("");
  const [employeeRecord, setEmployeeRecord] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("tab1");
  const [tempImage, setTempImage] = useState<any>();
  const tenantId = localStorage.getItem('tenant')
  const queryClient = useQueryClient()
  const showModal = () => {
    // if(selectedValue!==""){
      setIsModalOpen(true)
    // }
    // else{
    //   warnUser()
    // }
  }
  const showRefModal = () => {
      setIsRefModalOpen(true)
  }

  function refreshPage() {
    setTimeout(()=>{
        window.location.reload();
    }, 500);
    // console.log('page to reload')
}
const onRadioChange = (e: RadioChangeEvent) => {
  console.log('radio checked', e.target.value);
  setRadioValue(e.target.value);
};
const onRadio1Change = (e: RadioChangeEvent) => {
  console.log('radio checked', e.target.value);
  setRadio1Value(e.target.value);
};
const onRadio2Change = (e: RadioChangeEvent) => {
  console.log('radio checked', e.target.value);
  setRadio2Value(e.target.value);
};
const onRadio3Change = (e: RadioChangeEvent) => {
  console.log('radio checked', e.target.value);
  setRadio3Value(e.target.value);
};
const onRadio4Change = (e: RadioChangeEvent) => {
  console.log('radio checked', e.target.value);
  setRadio4Value(e.target.value);
};
  const handleTabClick = (tab:any) => {
    setActiveTab(tab);
  };
  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    reset()
    setIsModalOpen(false)
    setTempImage(tempImg);
  }
  const handleRefCancel = () => {
    reset()
    setIsRefModalOpen(false)
  }
  const showShortModal = (record: any) => {
    setIsShortModalOpen(true)
    setEmployeeRecord({ ...record })
  }

  const handleShortOk = () => {
    setIsShortModalOpen(false)
  }

  const handleShortCancel = () => {
    reset()
    setIsModalOpen(false)
    setIsShortModalOpen(false)
  }

  const deleteData = async (element: any) => {
    try {
      const response = await axios.delete(`${ENP_URL}/RecruitmentApplicants/${element.id}`)
      // update the local state so that react can refecth and re-render the table with the new data
      const newData = gridData.filter((item: any) => item.id !== element.id)
      setGridData(newData)
      return response.status
    } catch (e) {
      return e
    }
  }
  const [fileList, setFileList] = useState<UploadFile[]>([

  ]);

  const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };


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


  function handleDelete(element: any) {
    deleteData(element)
  }

  const handleChange = (event: any) => {
    event.preventDefault()
    setTempImage(event.target.value);
  }
  
  // const showPreview = (e:any)=>{
  //   if (e.target.files && e.target.files[0]){
  //     let imageFile = e.target.files[0]
  //     const reader = new FileReader()
  //     reader.onload = (x:any)=>{
  //       setTempImage({
  //         imageFile,
  //       //  imageFile: x.target.value
  //       })
  //     }
  //     reader.readAsDataURL(imageFile)
  //   }
  // }

  const onFileChange = (e:any) => {
     
    // Update the state
    setTempImage(e.target.files[0] );
   
  };

  const columns: any = [
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
      dataIndex: 'lastName',
      sorter: (a: any, b: any) => {
        if (a.lastName > b.lastName) {
          return 1
        }
        if (b.lastName > a.lastName) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Date de Naissance',
      dataIndex: 'dob',
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
      title: 'Genre',
      dataIndex: 'gender',
      sorter: (a: any, b: any) => {
        if (a.gender > b.gender) {
          return 1
        }
        if (b.gender > a.gender) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Num Téléphone',
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
      title: 'Score',
      dataIndex: 'score',
      sorter: (a: any, b: any) => {
        if (a.score > b.score) {
          return 1
        }
        if (b.score > a.score) {
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
          <a href='#' onClick={() => { showShortModal(record) }} className=' btn btn-light-info btn-sm'>
            Shortlist
          </a>
          <a onClick={forUdateButton} className='btn btn-light-primary btn-sm'>
            Selection
          </a>
        </Space>
      ),

    },
  ]

  const loadData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${Api_Endpoint}/RecruitmentApplicants/tenant/${tenantId}`)
      setGridData(response.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }
  
  const dataByID:any = gridData.filter((refId:any) =>{
    return  refId.recruitmentTransactionId===parseInt(selectedValue)
  })
  
  const dataWithIndex = dataByID.map((item: any, index:any) => ({
    ...item,
    key: index,
    score: 0,
  }))


  const { data: allPaygroups } = useQuery('paygroup', ()=>fetchPaygroups(tenantId), { cacheTime: 5000 })
  const { data: allCategories } = useQuery('categories', ()=>fetchCategories(tenantId), { cacheTime: 5000 })
  const { data: allUnits } = useQuery('units',()=> fetchUnits(tenantId), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitles',()=> fetchJobTitles(tenantId), { cacheTime: 5000 })
  const { data: allRecuitmentTransactions } = useQuery('recruitmentTransactions',()=> fetchRecruitmentTransactions(tenantId), { cacheTime: 5000 })

  const handleInputChange = (e: any) => {
    setSearchText(e.target.value)
    if (e.target.value === '') {
      loadData()
      
    }
  }


  useEffect(() => {
    loadData()
  }, [])


  const globalSearch = () => {
    // @ts-ignore
    filteredData = dataWithVehicleNum.filter((value) => {
      return (
        value.name.toLowerCase().includes(searchText.toLowerCase())
      )
    })
    setGridData(filteredData)
  }

  const warning = () => {
    messageApi.open({
      type: 'warning',
      style:{fontSize:"18px"},
      content: 'Désolé la référence existe deja ',
    });
  };
  const success = () => {
    messageApi.open({
      type: 'success',
      style:{fontSize:"20px"},
      content: 'Soumis avec succès',
    });
  };

  
const url = `${Api_Endpoint}/RecruitmentTransactions`
const OnSUbmit = handleSubmit(async (values) => {
  setLoading(true)
  const data = {
    reference: values.reference,
    description: values.description,
    startDate: values.startDate,
    endDate: values.endDate,
    paygroupId: parseInt(values.paygroupId),
    categoryId: parseInt(values.categoryId),
    jobTitleId: parseInt(values.jobTitleId),
    unitId: parseInt(values.unitId),
    tenantId: tenantId,
  }
  try {
   
      const response = await axios.post(url, data)
      setSubmitLoading(false)
      reset()
      refreshPage();
      success()
      return response.statusText
    
  } catch (error: any) {
    warning()
    setSubmitLoading(false)
    return error.statusText
  }
})


  const url1 = `${Api_Endpoint}/RecruitmentApplicants`
  const submitApplicant = handleSubmit(async (values) => {
    setLoading(true)
    const formData:any = new FormData();
    formData.append('recruitmentTransactionId', selectedValue )
    formData.append('firstName', values.firstName)
    formData.append('lastName', values.lastName)
    formData.append('dob', values.dob)
    formData.append('gender', selectedGen)
    formData.append('email', values.email)
    formData.append('phone', values.phone)
    formData.append('qualification', values.qualification)
    formData.append('imageFile', tempImage)
    formData.append('tenantId', tenantId)
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },}

    console.log(Object.fromEntries(formData))

    axios.post(url1, formData, config).then((response) => {
      console.log(response.data);
      reset()
      loadData()
      setIsModalOpen(false)
    });
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
      <br></br>
      <div className='col-12 row'>
        <h4></h4> 
        <div className='col-6'>
            <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)} className="form-select form-select-solid"  aria-label="Select example">
              <option value="Select">Select</option>
              {allRecuitmentTransactions?.data.map((item: any) => (
                <option value={item.id}>{item.reference}</option>
              ))}
            </select>
        </div>
        <div className='col-4'>
         
          {
            selectedValue===""||
            selectedValue==="Select"?
            <button type='button' className='btn btn-info me-3' onClick={showRefModal}>
              <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
              Ajouter Nouveau
            </button>:
            ""
          }
        </div>
      </div>
      <br></br>
      <br></br>
      {
        selectedValue===""||
        selectedValue==="Select"?"":
        <KTCardBody className='py-4 '>
        <div className='table-responsive'>
           
          <div className='d-flex justify-content-between'>
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder='Enter Search Text'
                onChange={handleInputChange}
                type='text'
                allowClear
                value={searchText}
              />
              <Button type='primary' onClick={globalSearch}>
                Search
              </Button>
            </Space>
            <Space style={{ marginBottom: 16 }}>
            {contextHolder}
              <button type='button' className='btn btn-primary me-3' onClick={showModal}>
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                Add
              </button>

              <button onClick={forUdateButton} type='button' className='btn btn-light-primary me-3'>
                <KTSVG path='/media/icons/duotune/arrows/arr078.svg' className='svg-icon-2' />
                Export
              </button>
            </Space>
          </div>
          <Table columns={columns} rowKey={(record) => record.id} dataSource={dataWithIndex} loading={loading} />
          {/* Add form */}
          
          {/* Add applicant form modal*/}
          <Modal
          title='New Applicant'
          open={isModalOpen}
          onCancel={handleCancel}
          closable={true}
          width="900px"
          footer={[
            <Button key='back' onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key='submit'
              type='primary'
              htmlType='submit'
              loading={submitLoading}
              onClick={submitApplicant}
            >
              Submit
            </Button>,
          ]}
        >
          <form
            onSubmit={submitApplicant}
          >
            <hr></hr>
            <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
              <div className='col-6 mb-3'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Prénoms</label>
                <input type="text" {...register("firstName")} className="form-control form-control-solid" />
              </div>
              <div className='col-6 mb-3'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Nom</label>
                <input type="text" {...register("lastName")} className="form-control form-control-solid" />
              </div>
            </div>
            <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
              <div className='col-6 mb-3'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Date de Naissance</label>
                <input type="date" {...register("dob")} className="form-control form-control-solid" />
              </div>
              <div className='col-6 mb-3'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Genre</label>
                {/* <input type="phone" {...register("gender")} className="form-control form-control-solid" />
                 */}
                <select value={selectedGen} onChange={(e) => setSelectedGen(e.target.value)} className="form-select form-select-solid"  aria-label="Select example">
                <option value="">select</option>
                <option value="MALE">MASCULIN</option>
                <option value="FEMALE">FEMININ</option>                
              </select>
              </div>
            </div>
            <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
              <div className='col-6 mb-3'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Num Téléphone</label>
                <input type="text" {...register("phone")} className="form-control form-control-solid" />
              </div>
              <div className='col-6 mb-3'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Email</label>
                <input type="email" {...register("email")} className="form-control form-control-solid" />
              </div>
            </div>
            <div style={{ padding: "20px 20px 0 20px" }} className='row mb-7 '>
              <div className='col-6 mb-3'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Qualification</label>
                <input type="text" {...register("qualification")} className="form-control form-control-solid" />
              </div>
              <div className='col-6 mb-3' style={{ padding: "30px 20px 0 20px" }}>
                <img src={tempImage} style={{height:"90px"}}  alt="" />

                <input className='mb-3 btn btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary' 
                onChange={onFileChange}
                type="file" />
                
              </div>
            </div>
          </form>
        </Modal>

          {/* shortlist form modal*/}
          <Modal
            title='Pré-sélectionné'
            open={isShortModalOpen}
            onCancel={handleShortCancel}
            closable={true}
            width="900px"
            footer={[
              <Button key='back' onClick={handleShortCancel}>
                Cancel
              </Button>,
              <Button
                key='submit'
                type='primary'
                htmlType='submit'
                loading={submitLoading}
              >
                Submit
              </Button>,
            ]}
          >
            <form
              
            >
              {/* <hr></hr> */}
              <hr></hr>
              <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                <div className='col-6 mb-3'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Prénoms</label>
                  <input type="text" name="code" value={employeeRecord?.firstName} className="form-control form-control-solid" />
                </div>
                <div className='col-6 mb-3'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Nom</label>
                  <input type="text" name="name" readOnly value={employeeRecord?.lastName} className="form-control form-control-solid" />
                </div>
              </div>
              <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                <div className='col-6 mb-3'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Date de Naissance</label>
                  <input type="text" name="code" readOnly value={employeeRecord?.dob} className="form-control form-control-solid" />
                </div>
                <div className='col-6 mb-3'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Genre</label>
                  <input type="text" name="name" readOnly value={employeeRecord?.gender} className="form-control form-control-solid" />
                </div>
              </div>
              <div style={{ padding: "20px 20px 0 20px" }} className='row mb-0 '>
                <div className='col-6 mb-3'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Num Téléphone</label>
                  <input type="phone" name="code" readOnly value={employeeRecord?.phone} className="form-control form-control-solid" />
                </div>
                <div className='col-6 mb-3'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Email</label>
                  <input type="email" name="name" readOnly value={employeeRecord?.email} className="form-control form-control-solid" />
                </div>
              </div>
              <hr></hr>

              <div>
                <div style={{display:"flex", }} className="tabs">
                  <div
                    className={`tab ${activeTab === "tab1" ? "active" : ""}`}
                    onClick={() => handleTabClick("tab1")}
                  >
                    Qualifications
                  </div>

                  <div className={`tab ${activeTab === "tab2" ? "active" : ""}`}
                    onClick={() => handleTabClick("tab2")}
                  >
                    Work Skils
                  </div>
                  <div
                    className={`tab ${activeTab === "tab3" ? "active" : ""}`}
                    onClick={() => handleTabClick("tab3")}
                  >
                    Experiences
                  </div>
                  <div
                    className={`tab ${activeTab === "tab4" ? "active" : ""}`}
                    onClick={() => handleTabClick("tab4")}
                  >
                    Reference
                  </div>
                  <div
                    className={`tab ${activeTab === "tab5" ? "active" : ""}`}
                    onClick={() => handleTabClick("tab5")}
                  >
                    Social Skills
                  </div>
                </div>
                <div className="tab-content">
                  {activeTab === "tab1" && 
                  <div>
                    <div className='col-12 mb-3'>
                      <label style={{ padding: "0px 30px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Qualification score</label>
                      <Radio.Group onChange={onRadioChange} value={radioValue}>
                        <Radio value={1}>1</Radio>
                        <Radio value={2}>2</Radio>
                        <Radio value={3}>3</Radio>
                        <Radio value={4}>4</Radio>
                        <Radio value={5}>5</Radio>
                      </Radio.Group>
                      <textarea style={{ margin: "10px 0px 0 0px" }} className="form-control form-control-solid" placeholder='comments on qualification (optional)' aria-label="With textarea"></textarea>
                    </div>
                    
                  </div>}
                  
                  {activeTab === "tab2" && 
                  <div>
                    <div className='col-12 mb-3'>
                    <label style={{ padding: "0px 40px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Score de compétences professionnelles</label>
                    <Radio.Group onChange={onRadio1Change} value={radio1Value}>
                      <Radio value={1}>1</Radio>
                      <Radio value={2}>2</Radio>
                      <Radio value={3}>3</Radio>
                      <Radio value={4}>4</Radio>
                      <Radio value={5}>5</Radio>
                    </Radio.Group>
                    <textarea style={{ margin: "10px 0px 0 0px" }} className="form-control form-control-solid" placeholder='comments on work skills (optional)' aria-label="With textarea"></textarea>
                    </div>
                  </div>}

                  {activeTab === "tab3" && 
                  <div>
                    <div className='col-12 mb-3'>
                      <label style={{ padding: "0px 36px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Score des expériences</label>
                      <Radio.Group onChange={onRadio2Change} value={radio2Value}>
                        <Radio value={1}>1</Radio>
                        <Radio value={2}>2</Radio>
                        <Radio value={3}>3</Radio>
                        <Radio value={4}>4</Radio>
                        <Radio value={5}>5</Radio>
                      </Radio.Group>
                      <br></br>
                      <textarea style={{ margin: "10px 0px 0 0px" }} className="form-control form-control-solid" placeholder='comments on experiences (optional)' aria-label="With textarea"></textarea>
                    </div>
                  </div>}

                  {activeTab === "tab4" && 
                  <div>
                    <div className='col-12 mb-3'>
                      <label style={{ padding: "0px 48px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Note de référence</label>
                      <Radio.Group onChange={onRadio3Change} value={radio3Value}>
                        <Radio value={1}>1</Radio>
                        <Radio value={2}>2</Radio>
                        <Radio value={3}>3</Radio>
                        <Radio value={4}>4</Radio>
                        <Radio value={5}>5</Radio>
                      </Radio.Group>
                      <textarea style={{ margin: "10px 0px 0 0px" }} className="form-control form-control-solid" placeholder='comments on reference (optional)' aria-label="With textarea"></textarea>
                    </div>
                  </div>}
                  {activeTab === "tab5" && 
                  <div>
                    <div className='col-12 mb-3'>
                      <label style={{ padding: "0px 39px 0 0px" }} htmlFor="exampleFormControlInput1" className=" form-label">Score de compétences sociales</label>
                      <Radio.Group onChange={onRadio4Change} value={radio4Value}>
                        <Radio value={1}>1</Radio>
                        <Radio value={2}>2</Radio>
                        <Radio value={3}>3</Radio>
                        <Radio value={4}>4</Radio>
                        <Radio value={5}>5</Radio>
                      </Radio.Group>
                      <textarea style={{ margin: "10px 0px 0 0px" }} className="form-control form-control-solid" placeholder='comments on social skills (optional)' aria-label="With textarea"></textarea>
                    </div>
                  </div>}
                </div>
              </div>
            </form>
          </Modal>
        </div>
      </KTCardBody>
      }
      <Modal
          title='Ajouter Nouveau'
          open={isRefModalOpen}
          onCancel={handleRefCancel}
          closable={true}
          width="900px"
          footer={[
            <Button key='back' onClick={handleRefCancel}>
              Cancel
            </Button>,
            <Button
              key='submit'
              type='primary'
              htmlType='submit'
              loading={submitLoading}
              onClick={OnSUbmit}
            >
              Submit
            </Button>,
          ]}
        >
          <hr />
          <br />
          <form onSubmit={OnSUbmit}>
          {contextHolder}
            <div style={{ padding: "0px 0px 0px 0px" }} className='col-12 row'>
              <div style={{ padding: "20px 20px 0 20px" }} className='col-6 row mb-0'>
                <div className='col-6 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Reference#</label>
                  <input type="text" {...register("reference")} className="form-control form-control-solid" />
                </div>
                <div className='col-6 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Description</label>
                  <input type="textarea" {...register("description")} className="form-control form-control-solid" />
                </div>
              </div>
              <div style={{ padding: "20px 0px 0 0px" }} className='col-6 row mb-0'>
                <div className='col-6 mb-3'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Date de début</label>
                  <input type="date" {...register("startDate")} className="form-control form-control-solid" />
                </div>

                <div className='col-6 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Date de fin</label>
                  <input type="date" {...register("endDate")} className="form-control form-control-solid" />
                </div>
              </div>
              <div style={{ padding: "20px 20px 0 20px" }} className='col-6 row mb-0'>
                <div className='col-6 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Groupe de paie</label>
                  <select className="form-select form-select-solid" {...register("paygroupId")} aria-label="Select example">
                    <option> Select</option>
                    <option> N/A</option>
                    {allPaygroups?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className='col-6 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Catégorie</label>
                  <select className="form-select form-select-solid" {...register("categoryId")} aria-label="Select example">
                    <option> Select</option>
                    <option> N/A</option>
                    {allCategories?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div style={{ padding: "20px 0px 0 0px" }} className='col-6 row mb-0'>
                <div className='col-6 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Titre</label>
                  <select className="form-select form-select-solid" {...register("jobTitleId")} aria-label="Select example">
                    <option> Select</option>
                    <option> N/A</option>

                    {allJobTitles?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className='col-6 mb-7'>
                  <label htmlFor="exampleFormControlInput1" className=" form-label">Unité</label>
                  <select className="form-select form-select-solid" {...register("unitId")} aria-label="Select example">
                    <option> Select</option>
                    <option> N/A</option>
                    {allUnits?.data.map((item: any) => (
                      <option value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
          </form> 
        </Modal>
      
    </div>
  )
}

export { RecruitmentSelection }
