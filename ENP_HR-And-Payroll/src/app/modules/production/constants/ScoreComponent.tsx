import { useQuery } from "react-query"
import { fetchDocument } from "../../../services/ApiCalls"
import { useEffect } from "react"

const ScoreComponent = ({employeeId, sendAchievement}: any) => {

    const { data: allObjectiveDeliverables } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 10000 })
    const { data: allParameters, isLoading: loading } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 10000 })
    const { data: allAppraisalobjective} = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 10000 })
    const { data: allApraisalActual } = useQuery('apraisalActuals', () => fetchDocument('ApraisalActuals'), { cacheTime: 10000 })
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })

    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active"
    })

    const convertToArray = checkActive?.referenceId.split("-")
    const appraisalId = convertToArray?.[1]

    const activeParameterName = allParameters?.data?.filter((section: any) => section.appraisalId?.toString() === appraisalId)

    const activeParameters = allParameters?.data?.filter((section: any) => 
         section.appraisalId?.toString() === appraisalId).map((param: any) => param?.id)

    const parameterIdSet = new Set(activeParameters);

    const objectivesData = allAppraisalobjective?.data.filter((deliverable:any) =>
        parameterIdSet.has(deliverable.parameterId) && 
        deliverable?.employeeId === employeeId?.toString() && 
        deliverable?.referenceId === checkActive?.referenceId
    )

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
                    const actual = allApraisalActual?.data?.find((actual:any) => actual?.deliverableId === deliverable?.id)
    
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

    return (
        <>
            {getOverallAchievement()}
        </>
       
    )
}

export { ScoreComponent}