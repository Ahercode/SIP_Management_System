import { Button, Skeleton, Space, Table, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { KTCardBody } from '../../../../_metronic/helpers'
import { Api_Endpoint, fetchDocument } from '../../../services/ApiCalls'
import { useAuth } from '../../auth'
import axios from 'axios'

const ParameterEntry = () => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  // const param: any = useParams();
  const tenantId = localStorage.getItem('tenant')
  const { currentUser } = useAuth()
  // let [appraisalName, setAppraisalName] = useState<any>("")
const [objectiveStatus, setObjectiveStatus] = useState<any>("")

const [deliverableStatus, setDeliverableStatus] = useState<any>("")
  const { data: allAppraisalobjective} = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 10000 })
  const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })
  const { data: allParameters, isLoading: loading } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 10000 })
  const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument('appraisals'), { cacheTime: 10000 })
  const { data: allObjectiveDeliverables } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 10000 })
  const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 10000 })

  const columns: any = [

    {
      title: 'Code',
      dataIndex: 'code',
      key:"code",
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
      title: 'Main Parameter',
      dataIndex: 'name',
      key:"name",
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
      title: 'Weight per parameter (%)',
      dataIndex: 'weight',
      key:"weight",
      sorter: (a: any, b: any) => {
        if (a.status > b.status) {
          return 1
        }
        if (b.status > a.status) {
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
          <Link to={`/objectiveEntry/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Objectives</span>
          </Link>
        </Space>
      ),

    },
  ]

  const dataByID = allParameters?.data?.filter((section: any) => {
    return section.appraisalId?.toString() === '12'
  })

  const checkActive = allReviewdates?.data?.filter((item: any) => {
    return item?.isActive?.trim() === "active"
})

  //find appraisal by id
  const appraisalData = allAppraisals?.data?.find((appraisal: any) => {
    return appraisal.id === 12
  })

  // add a key to dataByID
  const dataByIDWithKey = dataByID?.map((item: any) => {
    return { ...item, key: item.id, obj: "Objectives", del: "Deliverables" }
  })

  const weightSum = (id: any) => {

    return allAppraisalobjective?.data.filter((item: any) => item.parameterId === id && item.employeeId === currentUser?.id)
      .map((item: any) => item.weight)
      .reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0)
  };

  // get weight of deliverables from each objective
  const weightSumDeliverables = (id: any) => {
    const allObj= allAppraisalobjective?.data.filter((item: any) => item.parameterId === id && item.employeeId === currentUser?.id)
  
    // console.log("allObjFirst",allObj)
    // get all deliverables for each objective
    const allDeliverables = allObj?.map((item: any) => {
      return allObjectiveDeliverables?.data.filter((del: any) => del.objectiveId === item.id)
    })

    // console.log("allDeliverables",allDeliverables)

    // return  deliverys whose sum of weight is !== 100
    const incompleteDeliverables = allDeliverables?.filter((item: any) => {
      return item?.map((del: any) => parseInt(del.subWeight))
      .reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0) !== 100
    })

    return incompleteDeliverables?.length
  };

  const getDeliverableStatus = (  )=>{
    const getOnlyparameters = allParameters?.data?.filter((item: any) => {
      return item.appraisalId === 12
    }
    )
    const statusAll = getOnlyparameters?.map((item: any) => {
      return weightSumDeliverables(item.id)
    })
    setDeliverableStatus(statusAll)
  }
  const getOnlyparameters = allParameters?.data?.filter((item: any) => {
      return item.appraisalId === 12
    }
  )  

  const getObjectiveStatus = ( )=>{
    const allDeliverables = getOnlyparameters?.map((pare: any) => {

      const objData = allAppraisalobjective?.data.filter((item: any) => item.parameterId === pare.id && item.employeeId === currentUser?.id)
      const objStatus = objData?.map((item: any) => {
        return item.weight
      })
      return objStatus?.reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0) === pare.weight 
    })

    console.log("allObjectives", allDeliverables)
  
    setObjectiveStatus(allDeliverables)
  }

  const getEmployeeStatus = (()=> {
    const allSubmittedObjectives = allAppraisalobjective?.data?.filter((item: any) => {
         return parseInt(item?.employeeId) === parseInt(currentUser?.id)
    })
    if (allSubmittedObjectives?.some((obj:any) => obj.status === "submitted")) {
         return  "Submitted";
     } else if (allSubmittedObjectives?.some((obj:any) => obj.status === "rejected")) {
         return  "Rejected";
     }
     else if (allSubmittedObjectives?.some((obj:any) => obj.status === "approved")) {
         return "Approved";
     }
     else if (allSubmittedObjectives?.some((obj:any) => obj.status === "amend")) {
         return "Amend";
     }
     else{
        return "Not Submitted"
     }
  })

useEffect(() => {
  getObjectiveStatus()
  getDeliverableStatus()
}
, [allParameters?.data])


// get  employee whose Id is same as the 

const currentEmployee = allEmployees?.data?.filter((item: any) => {
  return item?.id === parseInt(currentUser?.id)
})

console.log("currentEmployee", currentEmployee)

const OnSubmit = handleSubmit(async (values) => {
  if(objectiveStatus.every((item:any) => item === true)){
    if(deliverableStatus.every((item:any) => item === 0)){
      const parameterIds = getOnlyparameters?.map((item: any) => {
        return item.id
      })
      const data ={
        parameterIds: parameterIds,
        employeeId :currentUser?.id?.toString(),
        statusText: "submitted"
      }

      console.log("data",data)
      axios.post(`${Api_Endpoint}/Parameters/UpdateStatus`, data)
      .then(response => {
        message.success("You have successfully submitted your appraisal")
        console.log(response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }else{
      return message.error("You have some incomplete deliverables. Make sure all deliverables are 100%")
    }
  }
  else{
    return message.error("You have some incomplete objectives")
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
          <div className='d-flex flex-direction-row justify-content-between align-items-center align-content-center py-4'>
            <div >
              
              <p className='text-primary fs-2 fw-bold mb-4'>
                {`${appraisalData?.name}`}
              </p>
                  <span style={{ fontSize:"16px"}}> Your status:
                    <span style={{ fontSize:"16px"}} className={
                      getEmployeeStatus() === 'Amend' ?
                      'badge badge-light-info fw-bolder' :
                      getEmployeeStatus() === 'Submitted' ?
                      'badge badge-light-warning fw-bolder' :
                      getEmployeeStatus() === 'Rejected' ?
                      'badge badge-light-danger fw-bolder' :
                      getEmployeeStatus() === 'Approved' ?
                      'badge badge-light-success fw-bolder' :
                      'badge badge-light-danger fw-bolder'
                    }>
                       {getEmployeeStatus()}
                    </span>
                  </span> 
            </div>
            <div>
              {/* <span className=' me-2'>The current status of your Objectives & Deliverables:</span> */}
            </div>
            <Space size='middle'>
              <Button  disabled={
                (getEmployeeStatus() === "Approved" || 
                getEmployeeStatus() === "Amend"||
                getEmployeeStatus() === "Submitted"                 
                ) && 
                deliverableStatus} onClick={OnSubmit} type='primary' size='large'>
                Submit
              </Button>
              <Link to={`/actualpage/`}>
                <Button disabled={true} size='large'>
                  Actuals
                </Button>
              </Link>     
            </Space>
          </div> 
          {
            loading ? <Skeleton active /> :
              <Table
                columns={columns}
                dataSource={dataByIDWithKey}
                expandable={{
                  expandedRowRender: (record) =>
                    <div key={record?.id}>
                      <div className='d-flex flex-direction-row align-items-center align-content-center py-4'>
                        <div style={{borderRight:"1px solid rgba(0,0,0,0.4)", paddingRight:"50px"}} className='me-4'>
                          <span >{record?.obj}</span>
                          {
                            weightSum(record.id) === record?.weight ?
                              <Tag color='green' className='mx-2' style={{marginBottom:"10px"}}>Complete </Tag> :
                              <Tag color='red' className='mx-2' style={{marginBottom:"10px"}}>Incomplete </Tag>
                          }
                          <br></br>
                          
                            <p>
                              <span >You have done <span className='fw-bold mx-2' style={{color:"Highlight"}}>{`${weightSum(record.id)==='undefined'?0:weightSum(record.id)}%`}</span> of </span>
                              <span className='fw-bold mx-2'>{`${record?.weight}%`}</span>
                            </p>
                          
                        </div>
                        <div style={{paddingLeft:"50px"}} >
                          <span >{record?.del}</span>
                          {
                            weightSumDeliverables(record.id) !== 0 ?
                            <>
                            
                            <Tag color='red' className='mx-2' style={{marginBottom:"10px"}}>Incomplete </Tag>
                            <p>
                              <span >You have some incompleteed deliverables here.</span>
                              
                            </p>
                            
                            </>:
                            <Tag color='green' className='mx-2' style={{marginBottom:"10px"}}>Complete </Tag>
                              
                          }
                        </div>
                      </div>
                    </div>
                  ,
                }}
              />
          }
        </div>
      </KTCardBody>
    </div>
  )
}

export { ParameterEntry }
