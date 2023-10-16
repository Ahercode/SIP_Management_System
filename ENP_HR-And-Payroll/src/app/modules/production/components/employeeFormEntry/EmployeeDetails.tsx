/* eslint-disable jsx-a11y/anchor-is-valid */
import { fetchDocument } from '../../../../services/ApiCalls';
import "./formStyle.css";

import { Tabs, TabsProps } from 'antd';
import { useQuery } from 'react-query';
import { getFieldName } from '../ComponentsFactory';

const EmplyeeDetails = ({employeeData}: any) => {
  // const param: any = useParams();
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
  // const tenantId = localStorage.getItem('tenant')
  // const [tempImage, setTempImage] = useState<any>();

  // const onFileChange = (e: any) => {
  //   // Update the state
  //   setTempImage(e.target.files[0]);

  // };


  const { data: allEmployees } = useQuery('employees', () => fetchDocument('employees'), { cacheTime: 5000 })
  const { data: allDepartments } = useQuery('departments', () => fetchDocument('departments'), { cacheTime: 5000 })
  // const { data: allDivisions } = useQuery('divisions', () => fetchDocument('divisions'), { cacheTime: 5000 })
  const { data: allCategories } = useQuery('categories', () => fetchDocument('categories'), { cacheTime: 5000 })
  const { data: alPaygroups } = useQuery('paygroups', () => fetchDocument('paygroups'), { cacheTime: 5000 })
  const { data: allJobTitles } = useQuery('jobtitle', () => fetchDocument('jobtitles'), { cacheTime: 5000 })
  const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
  const category = getFieldName(employeeData?.categoryId, allCategories?.data)
  const jobTitle = getFieldName(employeeData?.jobTitleId, allJobTitles?.data)
  // const division = getFieldName(employeeData?.divisionId, allDivisions?.data)
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
            <div className=' d-flex px-4 row-auto align-items-center align-content-center text-gray-500'>
              <i className="bi bi-envelope"></i>
              <div className='px-3'>{!employeeData?.email ? `Unavailable` : employeeData?.email}</div>
            </div>
            <div className=' d-flex row-auto align-items-center align-content-center text-gray-500'>
              <i className="bi bi-telephone"></i>
              <div className='px-3'>{!employeeData?.phone ? `Unavailable` : employeeData?.phone}</div>
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
          </div>
        </div>
      </div>
      <div className='mt-6'>
        <Tabs defaultActiveKey="1"
          type="line"
          items={tabItems}
          onChange={onTabsChange}
        />
      </div>
    </div>

  );
}

export { EmplyeeDetails };
