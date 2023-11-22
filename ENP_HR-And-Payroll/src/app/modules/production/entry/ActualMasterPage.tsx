import { useQuery } from "react-query"
import { ActualPage } from "./ActualPage"
import { Api_Endpoint, fetchDocument } from "../../../services/ApiCalls"
import { useAuth } from "../../auth"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@ant-design/pro-components"
import { Button, message } from "antd"
import { useEffect } from "react"
import axios from "axios"


const ActualMasterPage = ({title, employeeId}:any) => {
    const { currentUser } = useAuth()
    const navigate = useNavigate();
    const { data: allObjectiveDeliverables } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 10000 })
    const { data: allParameters, isLoading: loading } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 10000 })
    const { data: allAppraisalobjective} = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 10000 })
    const { data: allApraisalActual } = useQuery('apraisalActuals', () => fetchDocument('ApraisalActuals'), { cacheTime: 10000 })
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })

    // const { data: allParameters } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 10000 })
    const sameParameter = allParameters?.data?.find((item: any) => item?.tag?.trim() === "same")

    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active"
    })

    console.log("title", title)
    
    if(title === "hr"){
        employeeId = employeeId
    }else{
        employeeId = (currentUser?.id)
    }

    console.log("employeeId", employeeId)

    const convertToArray = checkActive?.referenceId.split("-")
    
    const appraisalId = convertToArray?.[1]

    const activeParameterName = allParameters?.data?.filter((section: any) => 
         section.appraisalId?.toString() === appraisalId)

    const activeParameters = allParameters?.data?.filter((section: any) => 
         section.appraisalId?.toString() === appraisalId).map((param: any) => param?.id)

    const parameterIdSet = new Set(activeParameters);

    const objectivesData = allAppraisalobjective?.data.filter((obj:any) =>
        (parameterIdSet.has(obj.parameterId) && 
        obj?.employeeId === employeeId?.toString() && 
        obj?.referenceId === checkActive?.referenceId) || sameParameter?.id === obj?.parameterId
    );

  const objectiveWeights = objectivesData?.map((objective:any) => {

    const deliverablesInObjective = allObjectiveDeliverables?.data.filter(
        (deliverable:any) => deliverable?.objectiveId === objective?.id
    );

    const deliverableWeight = deliverablesInObjective?.map((deliverable:any) => {
        const actual = allApraisalActual?.data?.find((actual:any) => actual?.deliverableId === deliverable?.id)
            return actual?.id

    })
    return deliverableWeight
})

const actualIds = objectiveWeights?.flat();


    const getOverallAchievement = () => {
        const overAllWeight = activeParameterName?.map((param: any) => {
            const objectivesInParameter = allAppraisalobjective?.data.filter((obj:any) =>
            param?.id ===obj?.parameterId && 
            obj?.employeeId === employeeId?.toString() && 
            obj?.referenceId === checkActive?.referenceId)
    
            const objectiveWeights = objectivesInParameter?.map((objective:any) => {
                const deliverablesInObjective = allObjectiveDeliverables?.data.filter(
                    (deliverable:any) => deliverable?.objectiveId === objective?.id
                );
    
                const deliverableWeight = deliverablesInObjective?.map((deliverable:any) => {
                    const actual = allApraisalActual?.data?.find((actual:any) => 
                    actual?.deliverableId === deliverable?.id && actual?.employeeId?.toString() === employeeId?.toString())
    
                    const actualValue = actual?.actual === null || actual?.actual === undefined ? 0 : 
                            Math.round((actual?.actual/deliverable?.target)*100)
                        return actualValue * (deliverable?.subWeight/100)
    
                }).reduce((a: any, b: any) => a + b, 0).toFixed(2)
                    const finalWeight = deliverableWeight > 120 ? 120 : deliverableWeight;
                return  finalWeight * (objective?.weight/100)
            })?.reduce((a: any, b: any) => a + b, 0).toFixed(2)
            return parseFloat(objectiveWeights)
        })
        const totalAchievement = overAllWeight?.reduce((a: any, b: any) => a + b, 0).toFixed(2);
        return totalAchievement
    }

        const getParameterAchievement = (parameterId:any) => {
            const objectivesInParameter = allAppraisalobjective?.data.filter((obj:any) =>
            parameterId ===obj?.parameterId && 
            obj?.employeeId === employeeId?.toString() && 
            obj?.referenceId === checkActive?.referenceId)    
            const objectiveWeights = objectivesInParameter?.map((objective:any) => {
                const deliverablesInObjective = allObjectiveDeliverables?.data.filter(
                  (deliverable:any) => deliverable?.objectiveId === objective?.id
                );
    
                const deliverableWeight = deliverablesInObjective?.map((deliverable:any) => {
                    const actual = allApraisalActual?.data?.find((actual:any) => 
                        actual?.deliverableId === deliverable?.id && actual?.employeeId?.toString() === employeeId?.toString())
    
                    const actualValue = actual?.actual === null || actual?.actual === undefined ? 0 : 
                            Math.round((actual?.actual/deliverable?.target)*100)
                        return actualValue * (deliverable?.subWeight/100)
    
                }).reduce((a: any, b: any) => a + b, 0).toFixed(2)
                    const finalWeight = deliverableWeight > 120 ? 120 : deliverableWeight;
                return  finalWeight * (objective?.weight/100)
            }).reduce((a: any, b: any) => a + b, 0).toFixed(2)
            return objectiveWeights 
        }

  const OnSubmit = () => {
   const data = {
        employeeId: employeeId,
        actualIds: actualIds,
        statusText: "submitted",
    }

    console.log("data", data)
    
    if(actualIds?.length === 0){
        message.error("You can't at this time, please contact your supervisor")
    }

    else{
        axios.post(`${Api_Endpoint}/ApraisalActuals/UpdateStatus`, data).then((res) => {
            // console.log("res", res)
            message.success("Successfully Submitted")
        }).catch((err) => {
            console.log("err", err)
        }
        )

  }
}

  useEffect(() => {
    }, [employeeId, title])

    const overallAchievement = getOverallAchievement();

    const performanceRating = overallAchievement < 50 ? 
    <span className='badge fs-4 badge-light-danger fw-bolder'>Poor</span> :
    overallAchievement >= 50 && overallAchievement < 60 ? 
    <span className='badge fs-4 badge-light-warning fw-bolder'>Unsatisfactory</span> :
    overallAchievement >= 60 && overallAchievement < 70? 
    <span className='badge fs-4 badge-light-warning fw-bolder'>Satisfactory</span>:
    overallAchievement >= 70 && overallAchievement < 80 ? 
    <span className='badge fs-4 badge-light-info fw-bolder'>Good</span>:
    overallAchievement >= 80 && overallAchievement < 90 ?
    <span className='badge fs-4 badge-light-info fw-bolder'>Very Good</span>:
    overallAchievement >= 90 ?
    <span className='badge fs-4 badge-light-success fw-bolder'>Excellent</span>: 
     "N/A"

    return (

        <div 
        
            style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: title === "final" ||
                title === "hr"? "":'2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >
        <div 
            className="d-flex flex-direction-row align-items-center justify-content-between align-content-center"
        >   {
                title === "final" ||
                title === "hr"?"":
                <div className="d-flex flex-direction-row align-items-center justify-content-between align-content-center">

                    <Button
                        onClick={() => navigate(-1)}
                        className="btn btn-light-success me-4"
                        style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        }}
                         shape="circle" icon={<ArrowLeftOutlined rev={''} />} size={'large'}
                    />
                        <span className=" text-gray-600 fw-bold d-block fs-2">Go back</span>
                </div>
            }
            {
                title === "final"|| title === "hr"?"":
                <div>
                    {/* <p className="badge badge-light-primary fw-bold fs-4">{checkActive?.description}</p> */}
                </div>
            }
            <div>{
                
                title === "final" ||
                title === "hr"? "":
                <a   
                    onClick={OnSubmit} 
                    className="btn btn-success btn-sm"
                >
                    Submit
                </a>
                }
            </div>
        </div>
        <div 
        className={
            title === "hr"|| title==="final"? "":
            `mt-8`}>
            <span className="text-gray-600 fw-bold fs-2" >Overall Achievement: <span className="badge fs-4 badge-light-primary">
                {getOverallAchievement()}
                </span> </span>
            
            <span  className="text-gray-600 ms-5 fw-bold fs-2">Performance Rate: 
            {   
                performanceRating
            }
            </span> 
        </div>
        <div>
        </div>
        {
            activeParameterName?.map((param: any) => (
                <div className="align-items-start mt-11" >
                    <div className="d-flex flex-direction-row align-items-center justify-content-start align-content-center">
                        <span className='fs-3 fw-bold '>{param?.name}: {`${param?.weight}%`}</span>                        
                    </div>
                    <p className="badge badge-light-info fw-bold fs-3 mt-2">Achievement: <span 
                        style={{color:"ActiveCaption", paddingLeft:"10px"}}> {
                            getParameterAchievement(param?.id)
                    }</span>
                </p>
                    {
                        objectivesData?.map((item: any) => (
                            item?.parameterId===param?.id ?
                            <div className="align-items-start">
                                <ErrorBoundary>
                                    <ActualPage 
                                        parameterName={param?.name} 
                                        parameterWeight={param?.weight}
                                        parameterId={param?.id} 
                                        objectiveName={item?.name} 
                                        objectiveWeight={item?.weight} 
                                        objectiveId={item?.id}
                                        employeeId={employeeId?.toString()}
                                        title={title}
                                        />
                                </ErrorBoundary>
                            </div> : null
                        ))
                    }
                </div>

            ))
        }
    </div>
    )
}


export{ActualMasterPage}