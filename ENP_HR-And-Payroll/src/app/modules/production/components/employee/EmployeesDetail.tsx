import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDocument } from '../../../../services/ApiCalls';
// import "./formStyle.css";

import { Modal, Table, Tabs, TabsProps } from 'antd';
import { useQuery } from 'react-query';
import { getFieldName } from '../../../../services/CommonService';

const EmployeesDetail = ({employeeData, title}: any) => {
  const param: any = useParams();
  // const [tempData, setTempData] = useState<any>()
  // const [graName, setGraName] = useState<any>()
  // const [depName, setDepName] = useState<any>()
  // const [divName, setDivName] = useState<any>()
  // const [jobTName, setJobTName] = useState<any>()
  // const [uniName, setUniName] = useState<any>()
  // const [paygName, setPaygName] = useState<any>()
  // const [catName, setCatName] = useState<any>()
  // const [notchName, setNotchName] = useState<any>()
  // const [nation, setNation] = useState<any>()
  const tenantId = localStorage.getItem('tenant')
  const [tempImage, setTempImage] = useState<any>();

  const [employeeDataHere, setEmployeeDataHere] = useState<any>()

  const [detailsModalOpen, setDetailsModalOpen] = useState(false)

  const showDetailsModal = () => {
    setDetailsModalOpen(true)
    // window.alert('showDetailsModal')
    const employeeNew = allEmployees?.data?.find((employee: any) => employee.id === employeeData?.employeeId )
    title === 'Appraisal'? setEmployeeDataHere(employeeNew): setEmployeeDataHere(employeeData)

      console.log('employeeNew', employeeNew)
      console.log('employeeData', employeeData)
    // setEmployeeData(record)
  }

  const handleDetailsModalCancel = () => {
    setDetailsModalOpen(false)
  }

  const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allDepartments } = useQuery('departments', () => fetchDocument(`departments/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allDivisions } = useQuery('divisions', () => fetchDocument(`divisions/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allCategories } = useQuery('categories', () => fetchDocument(`categories/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: alPaygroups } = useQuery('paygroups', () => fetchDocument(`paygroups/tenant/${tenantId}`), { cacheTime: 5000 })
  // const { data: allUnits } = useQuery('units', () => fetchDocument(`units/tenant/${tenantId}`), { cacheTime: 5000 })
  // const { data: allGrades } = useQuery('grades', () => fetchDocument(`grades/tenant/${tenantId}`), { cacheTime: 5000 })
  // const { data: allNotches } = useQuery('notches', () => fetchDocument(`notches/tenant/${tenantId}`), { cacheTime: 5000 })
//   const { data: allNations } = useQuery('nations', () => fetchDocument(`nations/tenant/${tenantId}`), { cacheTime: 5000 })
  // const { data: allSkills } = useQuery('skill', () => fetchDocument(`skills/tenant/${tenantId}`), { cacheTime: 5000 })
  // const { data: allQualifications } = useQuery('qualifications', () => fetchDocument(`qualifications/tenant/${tenantId}`), { cacheTime: 5000 })
  // const { data: allExperiences } = useQuery('experiences', () => fetchDocument(`experiences/tenant/${tenantId}`), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitle', () => fetchDocument(`jobtitles/tenant/${tenantId}`), { cacheTime: 5000 })
  // const [employeeData, setEmployeeData] = useState<any>()

  const department = getFieldName(employeeDataHere?.departmentId, allDepartments?.data)
  const category = getFieldName(employeeDataHere?.categoryId, allCategories?.data)
  const jobTitle = getFieldName(employeeDataHere?.jobTitleId, allJobTitles?.data)
  const division = getFieldName(employeeDataHere?.divisionId, allDivisions?.data)
  const employeeGroup = getFieldName(employeeDataHere?.paygroupId, alPaygroups?.data)

// console.log('employeeData',employeeData)




  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: <span>Job roles</span>,
      children: (<></>),
    },
    {
      key: '2',
      label: <span>Other details</span>,
      children: (<></>),
    },
  ]
  const onTabsChange = (key: string) => {
    console.log(key);
  };

  const columns = [
    {
      title: 'Parameter',
      dataIndex: 'parameter',
      key: 'parameter',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    }
  ]


  useEffect(() => {
    
  }, [employeeData])

  return (
    <>
      <a className='btn btn-light-success btn-sm' onClick={() => showDetailsModal()}>
        Details
      </a>


      <Modal
        open={detailsModalOpen}
        onCancel={handleDetailsModalCancel}
        closable={true}
        width="1000px"
        footer={null}>
          {/* <EmployeesDetail employeeData={employeeData} /> */}

          <div className='py-7'>
            <div className="d-flex row-auto align-items-center align-content-center ">
              <div>
                {
                  employeeDataHere?.imageUrl !== null ?
                    <img style={{ borderRadius: "5%", width: "160px", height: "160px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${employeeDataHere?.imageUrl}`}></img> :
                    <img style={{ borderRadius: "5%", width: "160px", height: "160px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`}></img>
                }
              </div>
              <div className="column-auto align-items-center align-content-center" >
                <div className='fs-1 fw-bold mb-2 px-4 d-flex row-auto align-items-center align-content-center'>
                  <div className="me-3"> {!employeeDataHere ? 'Unknown Employee' : `${employeeDataHere?.firstName} ${!employeeDataHere?.otherName ? '' : employeeDataHere?.otherName} ${employeeDataHere?.surname}`} </div>
                  <div className='badge badge-light-primary'>
                    <span className='fs-4'>{employeeDataHere?.employeeId}</span>
                  </div>
                </div>

                <div className="d-flex row-auto align-items-center align-content-center mb-6">
                  <div className=' d-flex px-4 row-auto align-items-center align-content-center text-gray-500'>
                    <i className="bi bi-envelope"></i>
                    <div className='px-3'>{!employeeDataHere?.email ? `Unavailable` : employeeDataHere?.email}</div>
                  </div>
                  <div className=' d-flex row-auto align-items-center align-content-center text-gray-500'>
                    <i className="bi bi-telephone"></i>
                    <div className='px-3'>{!employeeDataHere?.phone ? `Unavailable` : employeeDataHere?.phone}</div>
                  </div>
                </div>

                <div className="d-flex px-4 row-auto align-items-center align-content-center ">
                  <div className='btn btn-outline btn-outline-dashed btn-outline-default me-3 mb-2 align-content-start align-item-start'>
                    <div className='column-auto justify-content-start align-content-start'>
                      <div className='fs-5 fw-bold'>{`${!jobTitle ? 'Unavailable' : jobTitle}`}</div>
                      <div className='text-gray-500'>Job Title</div>
                    </div>
                  </div>
                  <div className='btn btn-outline btn-outline-dashed btn-outline-default me-3 mb-2 align-content-start align-item-start'>
                    <div className='column-auto justify-content-start align-content-start'>
                      <div className='fs-5 fw-bold'>{`${!employeeGroup ? 'Unavailable' : employeeGroup}`}</div>
                      <div className='text-gray-500'>Employee group</div>
                    </div>
                  </div>
                  <div className='btn btn-outline btn-outline-dashed btn-outline-default me-3 mb-2 align-content-start align-item-start'>
                    <div className='column-auto justify-content-start align-content-start'>
                      <div className='fs-5 fw-bold'>{`${!category ? 'Unavailable' : category}`}</div>
                      <div className='text-gray-500'>Category</div>
                    </div>
                  </div>
                  <div className='btn btn-outline btn-outline-dashed btn-outline-default me-3 mb-2 align-content-start align-item-start'>
                    <div className='column-auto justify-content-start align-content-start'>
                      <div className='fs-5 fw-bold'>{`${!department ? 'Unavailable' : department}`}</div>
                      <div className='text-gray-500'>Department</div>
                    </div>
                  </div>
                  <div className='btn btn-outline btn-outline-dashed btn-outline-default me-3 mb-2 align-content-start align-item-start'>
                    <div className='column-auto justify-content-start align-content-start'>
                      <div className='fs-5 fw-bold'>{`${!division ? 'Unavailable' : division}`}</div>
                      <div className='text-gray-500'>Division</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='mt-6'>
              {
                title === 'Employee' ?
                <Tabs defaultActiveKey="1"
                type="line"
                items={tabItems}
                onChange={onTabsChange}
              // tabBarExtraContent={slot}
              />:
              <>
                {/* <h2 >Details</h2> */}
                <Table columns={columns}/>
              </>
              }
              
            </div>
          </div>
      </Modal>
    </>
    

  );
}



export { EmployeesDetail};