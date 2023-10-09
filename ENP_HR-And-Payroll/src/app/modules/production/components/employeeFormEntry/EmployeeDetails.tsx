/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDocument } from '../../../../services/ApiCalls';
import "./formStyle.css";

import { Tabs, TabsProps } from 'antd';
import { useQuery } from 'react-query';
import { getFieldName } from '../ComponentsFactory';

const EmplyeeDetails = ({employeeData}: any) => {
  const param: any = useParams();
  const [tempData, setTempData] = useState<any>()
  const [graName, setGraName] = useState<any>()
  const [depName, setDepName] = useState<any>()
  const [divName, setDivName] = useState<any>()
  const [jobTName, setJobTName] = useState<any>()
  const [uniName, setUniName] = useState<any>()
  const [paygName, setPaygName] = useState<any>()
  const [catName, setCatName] = useState<any>()
  const [notchName, setNotchName] = useState<any>()
  const [nation, setNation] = useState<any>()
  const tenantId = localStorage.getItem('tenant')
  const [tempImage, setTempImage] = useState<any>();


  const onFileChange = (e: any) => {
    // Update the state
    setTempImage(e.target.files[0]);

  };


  const { data: allEmployees } = useQuery('employees', () => fetchDocument('employees'), { cacheTime: 5000 })
  const { data: allDepartments } = useQuery('departments', () => fetchDocument('departments'), { cacheTime: 5000 })
  const { data: allDivisions } = useQuery('divisions', () => fetchDocument('divisions'), { cacheTime: 5000 })
  const { data: allCategories } = useQuery('categories', () => fetchDocument('categories'), { cacheTime: 5000 })
  const { data: alPaygroups } = useQuery('paygroups', () => fetchDocument('paygroups'), { cacheTime: 5000 })
  const { data: allUnits } = useQuery('units', () => fetchDocument('units'), { cacheTime: 5000 })
  const { data: allGrades } = useQuery('grades', () => fetchDocument('grades'), { cacheTime: 5000 })
  const { data: allNotches } = useQuery('notches', () => fetchDocument('notches'), { cacheTime: 5000 })
  const { data: allNations } = useQuery('nations', () => fetchDocument('nations'), { cacheTime: 5000 })
  const { data: allSkills } = useQuery('skill', () => fetchDocument('skills'), { cacheTime: 5000 })
  const { data: allQualifications } = useQuery('qualifications', () => fetchDocument('qualifications'), { cacheTime: 5000 })
  const { data: allExperiences } = useQuery('experiences', () => fetchDocument('experiences'), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitle', () => fetchDocument('jobtitles'), { cacheTime: 5000 })
  // const [employeeData, setEmployeeData] = useState<any>()

  const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
  const category = getFieldName(employeeData?.categoryId, allCategories?.data)
  const jobTitle = getFieldName(employeeData?.jobTitleId, allJobTitles?.data)
  const division = getFieldName(employeeData?.divisionId, allDivisions?.data)
  const employeeGroup = getFieldName(employeeData?.paygroupId, alPaygroups?.data)
  // const lineManager = getSupervisorData({ employeeId: employeeData?.id, allEmployees, allOrganograms })

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

  return (
    <div className='py-7'>
      <div className="d-flex row-auto align-items-center align-content-center ">
        <div>
          {
            employeeData?.imageUrl === null || employeeData?.imageUrl ===""?
            <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`}></img>:
              <img style={{ borderRadius: "50%", width: "70px", height: "60px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${employeeData?.imageUrl}`}></img> 
          }
        </div>
        <div className="column-auto align-items-center align-content-center" >
          <div className='fs-1 fw-bold mb-2 px-4 d-flex row-auto align-items-center align-content-center'>
            <div className="me-3"> {!employeeData ? 'Unknown Employee' : `${employeeData?.firstName} ${!employeeData?.otherName ? '' : employeeData?.otherName} ${employeeData?.surname}`} </div>
            <div className='badge badge-light-primary'>
              <span className='fs-4'>{employeeData?.employeeId}</span>
            </div>
            <div style={{marginLeft:"10px"}} className='badge badge-light-info'>
              {/* <span className='fs-4'>{employeeData?.employeeId}</span> */}
               <span className='px-3  fs-4'>Level: </span>
              <div className='px-3 fs-4'>{!employeeData?.currentLevel ? `Unavailable` : employeeData?.currentLevel}</div>
            </div>
          </div>

          <div className="d-flex row-auto align-items-center align-content-center mb-6">
            {/* <div className=' d-flex px-4 row-auto align-items-center align-content-center '>
              Level
              <div className='px-3'>{!employeeData?.currentLevel ? `Unavailable` : employeeData?.currentLevel}</div>
            </div> */}
            <div className=' d-flex px-4 row-auto align-items-center align-content-center text-gray-500'>
              <i className="bi bi-envelope"></i>
              <div className='px-3'>{!employeeData?.email ? `Unavailable` : employeeData?.email}</div>
            </div>
            <div className=' d-flex row-auto align-items-center align-content-center text-gray-500'>
              <i className="bi bi-telephone"></i>
              <div className='px-3'>{!employeeData?.phone ? `Unavailable` : employeeData?.phone}</div>
            </div>
            {/* <div className=' d-flex row-auto align-items-center align-content-center text-gray-500'>
              <i className="bi bi-telephone"></i>
              Level
              
            </div> */}
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
            {/* <div className='btn btn-outline btn-outline-dashed btn-outline-default me-3 mb-2 align-content-start align-item-start'>
              <div className='column-auto justify-content-start align-content-start'>
                <div className='fs-5 fw-bold'>{`${!division ? 'Unavailable' : division}`}</div>
                <div className='text-gray-500'>Division</div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
      <div className='mt-6'>
        <Tabs defaultActiveKey="1"
          type="line"
          items={tabItems}
          onChange={onTabsChange}
        // tabBarExtraContent={slot}
        />
      </div>
    </div>

  );
}

{/* <>
<div className='row mb-5'>
  <div style={{ marginBottom: "10px" }}>
    <h2 style={{ color: "#f2f2f2", fontWeight: "bold", backgroundColor: "Highlight", maxWidth: "180px", padding: "8px" }}>Details</h2>
  </div>
  <br />
  <br />
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>EmployeeId: <span style={{ color: "black" }}>{tempData?.employeeId}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>First Name: <span style={{ color: "black" }}>{tempData?.firstName}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Surname: <span style={{ color: "black" }}>{tempData?.surname}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>
      Other name: <span style={{ color: "black" }}>{tempData?.otherName === null ? "NULL" : tempData?.otherName}</span>
    </h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>
      Gender: <span style={{ color: "black" }}> {tempData?.gender}</span>
    </h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Date of Birth:
      <span style={{ color: "black" }}> {tempData?.dob}</span>
    </h5>
  </div>

  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }} >Mrital Status:
      <span style={{ color: "black" }}> {tempData?.maritalStatus === null ? " NULL" : tempData?.maritalStatus}</span>
    </h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }} >
      Nationality: <span style={{ color: "black" }}>{tempData?.nationality === null ? " NULL" : nation}</span>
    </h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }} >
      ID Card Number: <span style={{ color: "black" }}>{tempData?.nationalId}</span>
    </h5>
  </div>
</div>

<div className='row mb-5'>
  <div style={{ marginBottom: "10px" }}>
    <h2 style={{ color: "#f2f2f2", fontWeight: "bold", backgroundColor: "Highlight", maxWidth: "180px", padding: "8px" }}>Communication</h2>
  </div>
  <br />
  <br />
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Phone Number: <span style={{ color: "black" }}>{tempData?.phone === null ? " NULL" : tempData?.phone}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Alternative Phone Number: <span style={{ color: "black" }}>{tempData?.alternativePhone === null ? " NULL" : tempData?.alternativePhone}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Address: <span style={{ color: "black" }}>{tempData?.address === null ? " NULL" : tempData?.address}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Residential Address: <span style={{ color: "black" }}>{tempData?.residentialAddress === null ? " NULL" : tempData?.residentialAddress}</span></h5>
  </div>


  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Next Of Kin: <span style={{ color: "black" }}>{tempData?.nextOfKin === null ? " NULL" : tempData?.nextOfKin}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Guarantor: <span style={{ color: "black" }}>{tempData?.guarantor === null ? " NULL" : tempData?.guarantor}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Email: <span style={{ color: "black" }}>{tempData?.email === null ? " NULL" : tempData?.email.toLowerCase()}</span></h5>
  </div>
</div>

<div className='row mb-5'>
  <div style={{ marginBottom: "10px" }}>
    <h2 style={{ color: "#f2f2f2", fontWeight: "bold", backgroundColor: "Highlight", maxWidth: "180px", padding: "8px" }}>Administration</h2>
  </div>
  <br />
  <br />
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Employee Group: <span style={{ color: "black" }}>{tempData?.paygroupId === null ? " NULL" : paygName}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Category: <span style={{ color: "black" }}>{tempData?.categoryId === null ? " NULL" : catName}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Division: <span style={{ color: "black" }}>{tempData?.divisionId === null ? " NULL" : divName}</span></h5>
  </div>

  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Department: <span style={{ color: "black" }}>{tempData?.departmentId === null ? " NULL" : depName}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Unit: <span style={{ color: "black" }}>{tempData?.unitId === null ? " NULL" : uniName}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>JobTitle: <span style={{ color: "black" }}>{tempData?.jobTitleId === null ? " NULL" : jobTName}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Job Roles: <span style={{ color: "black" }}>{tempData?.jobRole === null ? " NULL" : tempData?.jobRole}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Employment Date: <span style={{ color: "black" }}>{tempData?.employmentDate === null ? " NULL" : tempData?.employmentDate}</span></h5>
  </div>
</div>

<div className='row mb-5'>
  <div style={{ marginBottom: "10px" }}>
    <h2 style={{ color: "#f2f2f2", fontWeight: "bold", backgroundColor: "Highlight", maxWidth: "180px", padding: "8px" }}>Payroll</h2>
  </div>
  <br />
  <br />
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Phone: <span style={{ color: "black" }}>{tempData?.phone}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Alternative Phone: <span style={{ color: "black" }}>{tempData?.alternativePhone}</span></h5>
  </div>
  <div className='col-3 mb-5'>
    <h5 style={{ color: "GrayText" }}>Address: <span style={{ color: "black" }}>{tempData?.employmentDate === null ? " NULL" : tempData?.employmentDate}</span></h5>
  </div>
</div>
</> */}


export { EmplyeeDetails };
