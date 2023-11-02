import { useQuery } from "react-query"
import { ObjectiveMaster } from "../components/appraisalForms/ObjectiveMaster"
import { ActualPage } from "./ActualPage"
import { fetchDocument } from "../../../services/ApiCalls"
import { useAuth } from "../../auth"


const ActualMasterPage = () => {
    const { currentUser } = useAuth()
    // const { data: allAppraisalobjective} = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 10000 })
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })
    const { data: allParameters, isLoading: loading } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 10000 })
    const { data: allAppraisalobjective} = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 10000 })

    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active"
    })
    
    const convertToArray = checkActive?.referenceId.split("-")
    
    const appraisalId = convertToArray?.[1]

    const activeParameters = allParameters?.data?.filter((section: any) => {
        return section.appraisalId?.toString() === appraisalId
      })

    const objectivesData =  allAppraisalobjective?.data?.filter((item: any) => activeParameters?.map((param: any) => {
        return item?.parameterId === param?.id?.toString() &&
            item?.employeeId === currentUser?.id?.toString() &&
            item?.referenceId === checkActive?.referenceId
        }
    ))

    const test = activeParameters?.map((param: any) => 
    allAppraisalobjective?.data?.filter((item: any) => {
            return item?.parameterId === param?.id &&
            item?.employeeId === currentUser?.id &&
            item?.referenceId === checkActive?.referenceId
        })
   
    )
    //   allAppraisalobjective?.data?.filter((item: any) => 
    //     item?.parameterId.toString() === param?.parameterId && 
    //     item?.employeeId === currentUser?.id &&
    //     item?.referenceId === checkActive?.referenceId
    //     )
   console.log("activeParameters: ", activeParameters)
    console.log('objectivesData: ', objectivesData  )
    console.log('test: ', test  )


    return (
        <div>
            <ObjectiveMaster Component={ActualPage} objectiveData={objectivesData} />
        </div>
    )
}


export{ActualMasterPage}