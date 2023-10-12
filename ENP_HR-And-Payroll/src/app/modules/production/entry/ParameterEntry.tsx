import { Button, Skeleton, Space, Table, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { KTCardBody } from '../../../../_metronic/helpers'
import { fetchDocument } from '../../../services/ApiCalls'
import { useAuth } from '../../auth'

const ParameterEntry = () => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const tenantId = localStorage.getItem('tenant')
  const { currentUser } = useAuth()
  let [appraisalName, setAppraisalName] = useState<any>("")
const [objectiveStatus, setObjectiveStatus] = useState<any>("")

const [deliverableStatus, setDeliverableStatus] = useState<any>("")
  const { data: appraisalObjectives} = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 5000 })
  const { data: allParameters, isLoading: loading } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 5000 })
  const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument('appraisals'), { cacheTime: 5000 })
  const { data: allObjectiveDeliverables } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 5000 })


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

  //find appraisal by id
  const appraisalData = allAppraisals?.data?.find((appraisal: any) => {
    return appraisal.id === 12
  })

  // add a key to dataByID
  const dataByIDWithKey = dataByID?.map((item: any) => {
    return { ...item, key: item.id, obj: "Objectives", del: "Deliverables" }
  })

  const weightSum = (id: any) => {

    return appraisalObjectives?.data.filter((item: any) => item.parameterId === id && item.employeeId === currentUser?.id)
      .map((item: any) => item.weight)
      .reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0)
  };

  // get weight of deliverables from each objective
  const weightSumDeliverables = (id: any) => {
    const allObj= appraisalObjectives?.data.filter((item: any) => item.parameterId === id && item.employeeId === currentUser?.id)
  
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

  // const weightSumStatus = (id: any) => {

  //   console.log("para",id)
  //   const allObj = appraisalObjectives?.data.filter((item: any) => item.parameterId === id && item.employeeId === currentUser?.id)

  //   const allDeliverables = allObj?.map((item: any) => {
  //     return appraisalObjectives?.data.filter((del: any) => del.id === item.id)
  //   })

  // };

  const getDeliverableStatus = (  )=>{
    const getOnlyparameters = allParameters?.data?.filter((item: any) => {
      return item.appraisalId === 12
    }
    )
    const statusAll = getOnlyparameters?.map((item: any) => {
      return weightSumDeliverables(item.id)
    })

    setDeliverableStatus(statusAll)
    // console.log("deliverableStatus",statusAll)
  }


  const getObjectiveStatus = (  )=>{

    const getOnlyparameters = allParameters?.data?.filter((item: any) => {
      return item.appraisalId === 12
    }
  )   
    const allDeliverables = getOnlyparameters?.map((pare: any) => {

      const objData = appraisalObjectives?.data.filter((item: any) => item.parameterId === pare.id && item.employeeId === currentUser?.id)
      const objStatus = objData?.map((item: any) => {
        return item.weight
      })

      console.log("objData",objData)
      console.log("objStatus",objStatus)
      return objStatus?.reduce((a: any, b: any) => parseInt(a) + parseInt(b), 0) === pare.weight 
    })

    console.log("allObjectives",allDeliverables)
  
    setObjectiveStatus(allDeliverables)
  }

useEffect(() => {
  getObjectiveStatus()
  getDeliverableStatus()
}
, [allParameters?.data])
  

const OnSubmit = handleSubmit(async (values) => {

  
  
  if(objectiveStatus.every((item:any) => item === true)){
    if(deliverableStatus.every((item:any) => item === 0)){
      message.success("You have successfully submitted your appraisal")
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
            <div className='text-primary fs-2 fw-bold mb-4'>{`${appraisalData?.name}`}</div>
            <Button disabled={objectiveStatus===true && deliverableStatus} onClick={OnSubmit} type='primary' size='large'>
              Submit
            </Button>
          </div> 
          {
            loading ? <Skeleton active /> :
              <Table
                columns={columns}
                dataSource={dataByIDWithKey}
                expandable={{
                  // rowExpandable: (record1) => record1,
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
