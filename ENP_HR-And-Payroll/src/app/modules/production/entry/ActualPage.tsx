import { Skeleton, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { fetchDocument, postItem, } from '../../../services/ApiCalls'
import { getFieldName } from '../components/ComponentsFactory'
import { useAuth } from '../../auth'
import { CustomForm } from './CustomForm';
import { set, useForm } from 'react-hook-form'


const ActualPage = ( {
  parameterName, 
  parameterWeight,
  parameterId, 
  objectiveName, 
  objectiveWeight, 
  objectiveId,
  // getParamTotal,
  title
}:any) => {

  

  const { currentUser } = useAuth()
  const queryClient = useQueryClient()
  const { register, reset, handleSubmit } = useForm()
  const [individualComment, setIndividualComment] = useState<any>(null)
  const [lineManagerComment, setLineManagerComment] = useState<any>(null)
  const { data: allObjectiveDeliverables, isLoading: loading } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 10000 })
  const { data: appraisalobjectives } = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 10000 })
  const { data: allUnitsOfMeasure } = useQuery('unitofmeasures', () => fetchDocument('unitofmeasures'), { cacheTime: 10000 })
  const { data: allApraisalActual } = useQuery('apraisalActuals', () => fetchDocument('ApraisalActuals'), { cacheTime: 10000 })
  const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })

  const checkActive = allReviewdates?.data?.find((item: any) => {
      return item?.isActive?.trim() === "active"
  })

  const [actualValues, setActualValues] = useState<any>();
  const [isFocused, setIsFocused] = useState(false);
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);

  
  // const handleChange = (recordId:any, value:any, field:any) => {
  //   setActualValues((prevValues:any) => ({
  //     ...prevValues,
  //     [recordId]: {
  //       ...prevValues[recordId],
  //       [field]: value
  //     }
  //   }));
  // }
  const handleChange = (deliverableId:any,  value:any, field:any) => {

    setActualValues((prevState:any) => {
      const newData = { ...prevState };
      if (!newData[deliverableId]) {
        // Create an object if it doesn't exist
        newData[deliverableId] = {}; 
      }

      // Use the new value or fallback to old value 
      newData[deliverableId][field] = value || newData[deliverableId][field];      
      return newData;
    });

  }

 const getOldActual = (deliverableId:any) => {
    const actual = allApraisalActual?.data?.find((item: any) => {
      return item?.deliverableId === parseInt(deliverableId )
    })
    return actual?.actual
  }

  // console.log("actualValues:",getOldActual(110))

  const OnSubmit = ()=> {
    const dataArray = Object.keys(actualValues).map((recordId: any) => ({
      test:recordId,
      actual: actualValues[recordId].actual===undefined? getOldActual(recordId): actualValues[recordId].actual,
      deliverableId: recordId,
      scheduleId: checkActive?.id,
      individualComment: actualValues[recordId]?.individualComment===undefined? "": actualValues[recordId]?.individualComment,
      lineManagerComment: actualValues[recordId]?.lineManagerComment===undefined? "": actualValues[recordId]?.lineManagerComment,
      status: "drafted",
    }));

    // console.log("dataArray:",dataArray)

    const itemToPost = {
      data: dataArray,
      url: `ApraisalActuals`,
    }

    postData(itemToPost)
  }

  const onFocus = () => {
    setIsFocused(true);
  };
  const onFocus2 = () => {
    setIsFocused2(true);
  };
  const onFocus1 = () => {
    setIsFocused1(true);
  };

  const onBlur = () => {
    setIsFocused(false);
    setIsFocused1(false);
    setIsFocused2(false);
  };

  const { mutate: postData } = useMutation(postItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`apraisalActuals`)
      message.success('Saved successfully')
    },
    onError: (error: any) => {
      console.log('post error: ', error)
      message.error('Error adding item')
    }
  })

  const columns: any = [
    {
      title: 'Deliverable',
      dataIndex: 'description',
      width: 300,
      render: (record: any) => {
        const pointsArray = record.trim()?.split(/\n(?=\d+\.|\u2022)/).filter(Boolean);
        return (
          <>
            <textarea
              readOnly={true}
              rows={3}
              cols={50}
              value={pointsArray?.join('\n')}
              className="form-control "/>
          </>
        )
      }
    },
    {
      title: 'Sub Weight',
      dataIndex: 'subWeight',
      width: 100,
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
      width: 90,
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
      fixed: 'right',
      width: 160,
      render: (record: any) => {
        const actual = allApraisalActual?.data?.find((item: any) => {
          return item?.deliverableId === record?.id 
        })
        return (
          <>
            <input
                disabled={title==="final"||title==="hr"?true:false}
                onFocus={onFocus}
                onBlur={onBlur}
                type='number' min='0'
                defaultValue={actual?.actual}
                onChange={(e)=>handleChange(record?.id, e.target.value, "actual")}
                className="form-control " 
                style={{
                  border: isFocused ? '1px solid green' : '1px solid #ccc'
                }}
            />
          </>
        )
      }
    },
    {
      title:"Individual Comment",
      fixed: 'right',
      width: 180,
      render: (record: any) => {
        const actual = allApraisalActual?.data?.find((item: any) => {
          return item?.deliverableId === record?.id 
        })

        const pointsArray = actual?.individualComment?.trim()?.split(/\n(?=\d+\.)/).filter(Boolean);
        return (
          <>
            {
              <textarea
                disabled={title==="final"|| title==="hr"?true:false}
                rows={1}
                onChange={(e)=>handleChange(record?.id, e.target.value, "individualComment")}
                defaultValue={pointsArray?.join('\n')}
                className="form-control"
                onFocus={onFocus1}
                onBlur={onBlur}
                style={{
                  border: isFocused1 ? '1px solid green' : '1px solid #ccc'
                }}
              />
            }
          </>
        )
      }
    },
    {
      title:"LineManager Comment",
      fixed: 'right',
      width: 180,
      render: (record: any) => {
        const actual = allApraisalActual?.data?.find((item: any) => {
          return item?.deliverableId === record?.id 
        })

        return (
          <>
          
            {
              <textarea
                disabled={title!=="final"? true : false}
                rows={1}
                defaultValue={actual?.lineManagerComment}
                onChange={(e) => handleChange(record?.id, e.target.value, "lineManagerComment")}
                onFocus={onFocus2}
                onBlur={onBlur}
                style={{
                  border: isFocused2 ? '1px solid green' : '1px solid #ccc'
                }}
                className="form-control " />
            }
          </>
        )
      }
    },
    {
      title:"Achieved",
      align: 'right',
      fixed: 'right',
      width: 100,
      render: (record: any) => {
        const actual = allApraisalActual?.data?.find((item: any) => {
          return item?.deliverableId === record?.id 
        })
        return (
          <>
            {
              actual?.actual === null || actual?.actual === undefined ? 0 :
            Math.round((actual?.actual/record?.target)*100)}
          </>
        )
      }

    }
  ]

 
  if(checkActive?.tag?.trim() !== "final"){
    columns.splice(5, 2)
  }

  const employObj = appraisalobjectives?.data?.filter((item: any) => 
    item?.employeeId?.toString() === currentUser?.id && item?.referenceId === checkActive?.referenceId
    ).map((item: any) => item?.id)

  const objectiveIdSet = new Set(employObj);

  const filteredDeliverables = allObjectiveDeliverables?.data.filter((deliverable:any) =>
      parseInt(deliverable.objectiveId) === objectiveId
  );
  useEffect(() => {
  }, [allApraisalActual?.data])

  return (
      <>
        <div 
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '1px 1px 10px rgba(0,0,0,0.05)',
          }}

        className="border border-gray-400 mt-4"
        >
          <div className="mb-5 d-flex justify-content-between align-items-center align-content-center">
            <div>
              <span>
                <span className='text-gray-600 fw-bold fs-3' style={{color:"ActiveCaption"}}>{objectiveName}: <span style={{color:"ActiveCaption"}}>
                  {`${objectiveWeight}`}</span></span>
              </span>
              <br />
              <p style={{margin:"3px 0  0 0px"}} className='badge badge-light-info fw-bold fs-3'>Achievement:  <span style={{color:"ActiveCaption", paddingLeft:"10px"}}>
                {
                  (() => {
                    const total = filteredDeliverables?.map((deliverableId: any) => {
                      const actual = allApraisalActual?.data?.find((item: any) => {
                        return item?.deliverableId === deliverableId?.id 
                      })
                      const actualValue = actual?.actual === null || actual?.actual === undefined ? 0 : 
                        Math.round((actual?.actual/deliverableId?.target)*100)
                    
                        return actualValue * (deliverableId?.subWeight/100)
                      }
                    ).reduce((a: any, b: any) => a + b, 0)

                    const finalTotal = total > 120 ? 120 : total;

                    // getParamTotal(finalTotal)
                    return finalTotal?.toFixed(2);
                  })()
                }
                </span>
              </p>
             
            </div>
            {
              title==="hr"? "":
              <div>
                <button
                  onClick={
                    // checkActive?.tag?.trim()==="final"?
                    // OnFinalSubmit:
                    OnSubmit
                  }
                  className='btn btn-light-success'
                  // style={{backgroundColor:"#216741", color:"#f2f2f2"}} 
                >
                  Save
                </button>
              </div>
            }
          </div>
          {
            loading ? <Skeleton active /> :
            <>
              <Table 
                key={objectiveId} 
                columns={columns} 
                dataSource={filteredDeliverables}
                scroll={{ x: 1300 }} 
              />
              
              </>
          }
        </div>
      </>

  )
}

export { ActualPage }




