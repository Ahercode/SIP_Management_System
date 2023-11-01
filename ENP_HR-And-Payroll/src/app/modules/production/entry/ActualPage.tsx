import { Button, Input, Modal, Skeleton, Space, Table, message } from 'antd'
import {EditableProTable, type ProColumns} from '@ant-design/pro-components';
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers'
import { Api_Endpoint, deleteItem, fetchDocument, postItem, updateItem } from '../../../services/ApiCalls'
import { ArrowLeftOutlined } from "@ant-design/icons"
import { getFieldName } from '../components/ComponentsFactory'
import { useAuth } from '../../auth'
import { CustomForm } from './CustomForm';


const ActualPage = () => {
  const [gridData, setGridData] = useState([])
  const param: any = useParams();   
  const navigate = useNavigate();
  const [actualValues, setActualValues] = useState<any>({});

  const { currentUser } = useAuth()
  const { data: allObjectiveDeliverables, isLoading: loading } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 5000 })
  const { data: appraisalobjectives } = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 10000 })
  const { data: allUnitsOfMeasure } = useQuery('unitofmeasures', () => fetchDocument('unitofmeasures'), { cacheTime: 10000 })
  const { data: allApraisalActual } = useQuery('apraisalActuals', () => fetchDocument('ApraisalActuals'), { cacheTime: 10000 })
  const queryClient = useQueryClient()

  const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })
 const checkActive = allReviewdates?.data?.find((item: any) => {
    return item?.isActive?.trim() === "active"
})

  const tenantId = localStorage.getItem('tenant')


  const handleFormSubmit = (recordId:any, value:any) => {
    setActualValues((prevValues:any) => ({
      ...prevValues,
      [recordId]: value,
    }));
  }

  const OnSubmit = (e:any)=> {
    const dataArray = Object.keys(actualValues).map((recordId: any) => ({
      actual: actualValues[recordId],
      deliverableId: recordId,
      scheduleId: checkActive?.id,
    }));

    const itemToPost = {
      data: dataArray,
      url: `ApraisalActuals`,
    }
    postData(itemToPost)
  }

  const { mutate: postData } = useMutation(postItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`ApraisalActuals`)
      message.success('Actuals entered successfully')
    },
    onError: (error: any) => {
      console.log('post error: ', error)
      message.error('Error adding item')
    }
  })

  const columns: any = [

    {
      title: 'Objective',
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
      title: 'Deliverable',
      dataIndex: 'description',
      sorter: (a: any, b: any) => {
        if (a.description > b.description) {
          return 1
        }
        if (b.description > a.description) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Sub Weight',
      dataIndex: 'subWeight',
      sorter: (a: any, b: any) => {
        if (a.subWeight > b.subWeight) {
          return 1
        }
        if (b.subWeight > a.subWeight) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Unit Of Measure',
      key: 'unitOfMeasureId',
      sorter: (a: any, b: any) => {
        if (a.unitOfMeasureId > b.unitOfMeasureId) {
          return 1
        }
        if (b.unitOfMeasureId > a.unitOfMeasureId) {
          return -1
        }
        return 0
      },
      render: (record: any) => {
        return getFieldName(record.unitOfMeasureId, allUnitsOfMeasure?.data)
      },
    },
    {
      title: 'Target',
      dataIndex: 'target',
      sorter: (a: any, b: any) => {
        if (a.target > b.target) {
          return 1
        }
        if (b.target > a.target) {
          return -1
        }
        return 0
      },
    },
    {
      title:"Actual",
      render: (record: any) => {
        return (
          <>
            {/* {getActual(record?.id)} */}
            <CustomForm rowId={record?.id} onFormSubmit={handleFormSubmit} activeId={checkActive?.id} />
          </>
        )
      }
      
    },
    {
      title:"Achieved (%)",
      align: 'right',
      render: (record: any) => {
        const actual = allApraisalActual?.data?.find((item: any) => {
          return item?.deliverableId === record?.id && item?.scheduleId === checkActive?.id
        })
        return (
          <>
          {/* {console.log('actual', actual)}
          {console.log('record', record)} */}
            {Math.round((actual?.actual/record?.target)*100)}
          </>
        )
      }

    }
  
    // {
    //   title: 'Action',
    //   fixed: 'right',
    //   width: 100,
    //   render: (record: any) => (
    //     <Space size='middle'>
    //       <Link to={`/actualentry/${record.id}`}>
    //         <span className='btn btn-light-info btn-sm'>SetActual</span>
    //       </Link>
    //     </Space>
    //   ),
    // },
  ]

  const employObj = appraisalobjectives?.data?.filter((item: any) => 
    item?.employeeId?.toString() === currentUser?.id && item?.referenceId === checkActive?.referenceId
    ).map((item: any) => item?.id)

  const objectiveIdSet = new Set(employObj);

  const filteredDeliverables = allObjectiveDeliverables?.data.filter((deliverable:any) =>
      objectiveIdSet.has(parseInt(deliverable.objectiveId))
  );

  // const loadData = async () => {
  //   try {
  //     // const neewData = allObjectiveDeliverables?.data?.filter((item: any) => item?.objectiveId?.toString() === param.objectiveId)
  //     const employObj = appraisalobjectives?.data?.filter((item: any) => 
  //       item?.employeeId?.toString() === currentUser?.id && item?.referenceId === checkActive?.referenceId
  //       ).map((item: any) => item?.id)
  //       const objectiveIdSet = new Set(employObj);
  //       const filteredDeliverables = allObjectiveDeliverables?.data.filter((deliverable:any) =>
  //           objectiveIdSet.has(parseInt(deliverable.objectiveId))
  //       );
  //     setGridData(filteredDeliverables)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    // loadData()
  }, [])

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
          <div className="mb-5 d-flex justify-content-between align-items-center align-content-center">
            <Space className=''>
              <Button
                onClick={() => navigate(-1)}
                className="btn btn-light-primary me-4"
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                }}
                type="primary" shape="circle" icon={<ArrowLeftOutlined rev={''} />} size={'large'}
              />
              <div className="d-flex flex-direction-row align-items-center justify-content-start align-content-center text-gray-600">
                <span className="fw-bold d-block fs-2">Go back</span>
              </div>
              
            </Space>
            <p className='badge badge-light-info text-info fs-1 fw-bold mb-4'>
              {checkActive?.description}
            </p>
            <button
              onClick={OnSubmit}
              className='btn btn-primary'
            >
              Save
            </button>
          </div>
          {
            loading ? <Skeleton active /> :
            <>
              <Table columns={columns} 
                dataSource={filteredDeliverables}
              />
              </>
          }
        </div>
      </KTCardBody>
    </div>
  )
}

export { ActualPage }




