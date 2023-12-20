import { Badge, Tabs, TabsProps } from "antd";
// import { useState } from "react";
import { useQuery } from "react-query";
import { fetchDocument } from "../../../../../services/ApiCalls";
import { NotificationsComponent } from "../../lineManager/NotificationsComponent";
import { AppraisalPerformance } from "./AppraisalPerformance";
// import { PerformanceDetails } from "./PerfDetails";
// import { useAuth } from "../../../../auth";
import { BonusComputation } from "../../../entry/BonusComputation";
import { useEffect, useState } from "react";

const PerformanceBoard = () => {
    
    const { data: employeeObjectives, isLoading: objectivesLoading } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const tenantId = localStorage.getItem('tenant')
    const [referenceId, setReferenceId] = useState<any>(null)
    const appraisalReferenceId:any= localStorage.getItem('appraisalReferenceId')
 
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 100000 })
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })
    const { data: allAppraTranItems } = useQuery('appraisalPerItems', () => fetchDocument(`AppraisalPerItems`), { cacheTime: 10000 })
    const { data: allAppraisalsPerfTrans, isLoading:perLoading} = useQuery('appraisalPerfTransactions', () => fetchDocument(`AppraisalPerfTransactions/tenant/${tenantId}`), { cacheTime: 10000 })
  

    const receiveBonusData = (reference:any) => {
        console.log('Received reference:', reference);
        setReferenceId(reference); 
      };
    const allAppraisalTranItems = allAppraTranItems?.data?.filter((item: any) => {
        return item.appraisalPerfTranId === parseInt(appraisalReferenceId)
      })
    const idSet = new Set(allAppraisalTranItems?.map((item: any) => parseInt(item.employeeId)))
    
      const employeesFromTransaction = allEmployees?.data?.filter((item: any) => {
        return idSet.has(item.id)
      })

    // const allAmendObjectives = employeeObjectives?.data?.filter((item: any) => {
    //     return item?.status === 'amend'
    // })

    const reference = allAppraisalsPerfTrans?.data?.find((item: any) => {
        return item?.id === parseInt(appraisalReferenceId)
        }
    )
    
    const allSubmittedApprovedRejectedObjectives = employeeObjectives?.data?.filter((item: any) => {
        return (item?.status === 'submitted' || item?.status ==="approved" || item?.status ==="rejected") && 
        item?.referenceId === reference?.referenceId
    })


    // const employeesWithAmendObjectives = allEmployees?.data?.filter((employee:any) =>
    //     allAmendObjectives?.some((obj:any) => 
    //     parseInt(obj.employeeId) === employee.id && 
    //     (obj.status === "amend" )
    //     )
    // );
    
    const employeesWithSubmittedApprovedRejectedObjectives = allEmployees?.data?.filter((employee:any) =>
        allSubmittedApprovedRejectedObjectives?.some((obj:any) => 
        parseInt(obj.employeeId) === employee.id && 
        (obj?.status === 'submitted' || obj?.status ==="approved" || obj?.status ==="rejected")
        )
    );

    const onTabsChange = (key: string) => {
        console.log(key);
    };

    // const showDownlinesModal = () => {
    //     // setIsDownlinesModalOpen(true)
    // }

    // const hideDownlinesModal = () => {
    //     // setIsDownlinesModalOpen(false)
    // }

    // const slot = {
    //     right: <Button onClick={showDownlinesModal}>Show Downlines</Button>
    // }

    useEffect(() => {
        // loadData()
    }
    , [appraisalReferenceId])

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: <>
                {/* <Badge count={0} showZero={true} title="Entries" size="small"> */}
                <span>Entries</span>
                {/* </Badge> */}
            </>,
            children: (
                <>
                    <AppraisalPerformance />
                </>
            ),
        },
        // {
        //     key: '2',
        //     label: <>
        //         <Badge count={employeesWithAmendObjectives?.length} showZero={true} title="Requests" size="small">
        //             <span>Requests</span>
        //         </Badge>
        //     </>,
        //     children: (
        //         <>
        //             <NotificationsComponent loading={objectivesLoading} employeeWhoSubmitted={employeesWithAmendObjectives} location="Requests"/>
        //         </>
        //     ),
        // },
        {
            key: '3',
            label: <span>View details</span>,
            children: (
                <>
                    <NotificationsComponent 
                        loading={objectivesLoading} 
                        employeeWhoSubmitted={employeesWithSubmittedApprovedRejectedObjectives} 
                        location="View Details"
                    />
                </>
            ),
        },
        {
            key: '4',
            label: <span>Bonus Check</span>,
            children: (
                <>
                    <BonusComputation employeeData={employeesFromTransaction}/>
                </>
            ),
        },
    ]
    
    // if(reference === null){ 
    //     tabItems.splice(3,1)
    // }

    return (
        <div 
            style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >
            <Tabs defaultActiveKey="1"
                type="line"
                items={tabItems}
                onChange={onTabsChange}
            />

            {/* <Modal
                title={'Downlines'}
                open={isDownlinesModalOpen}
                onCancel={hideDownlinesModal}
                width={1000}
                footer={[<Button onClick={hideDownlinesModal}>Close</Button>]}
                closable={true}>
                <div className="mt-7">
                    <DownLines />
                </div>
            </Modal> */}
        </div>
    )
}

export { PerformanceBoard };

