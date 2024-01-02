import { Badge, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchDocument } from "../../../../services/ApiCalls";
import { useAuth } from "../../../auth";
import { DownLines } from "./DownLines";
import { NotificationsComponent } from "./NotificationsComponent";
import { ErrorBoundary } from "@ant-design/pro-components";
import { set } from "react-hook-form";
import { getFieldName } from "../ComponentsFactory";

const NotificationsBoard = () => {
    const { currentUser } = useAuth()
    const tenantId = localStorage.getItem('tenant')
    // const [employeesWithSubmittedObjectives, setEmployeesWithSubmittedObjectives] = useState<any>([])
    const [employees, setEmployees] = useState<any>([])
    const [objectives, setObjectives] = useState<any>([])
    const [teamMembers, setTeamMembers] = useState<any>([])
    const { data: allAppraTranItems, isLoading:itemsLoading} = useQuery('appraisalPerItems', () => fetchDocument(`AppraisalPerItems`), { cacheTime: 10000 })
    const { data: allAppraisalsPerfTrans, isLoading:perLoading} = useQuery('appraisalPerfTransactions', () => fetchDocument(`AppraisalPerfTransactions/tenant/${tenantId}`), { cacheTime: 10000 })
    const { data: allPaygroups } = useQuery('paygroups', () => fetchDocument(`Paygroups/tenant/${tenantId}`), { cacheTime: 10000 })
    const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument('appraisals'), { cacheTime: 10000 })

    const employeeReferenceIds = allAppraTranItems?.data?.filter((item: any) => 
        (item?.employeeId === currentUser?.id) 
    )?.map((item: any) => item?.appraisalPerfTranId)
    
    const employeesReference = allAppraisalsPerfTrans?.data.filter((item: any) => 
         item?.status?.trim() === "active" 
    )

    // This is to get only the active reference for the current user
    // const employeesReference = allAppraisalsPerfTrans?.data.filter((item: any) => 
    //     employeeReferenceIds?.some((id: any) =>  item?.id === id && item?.status?.trim() === "active" 
    //     )
    // )

    const [selectedReference, setSelectedReference] = useState<any>(employeesReference?.[0]?.referenceId);

    const [employeeWhoSubmitted, setEmployeeWhoSubmitted] = useState<any>([])
    const { data: appraisalObjective, isLoading: objectivesLoading } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 100000 })
    // get all objectives with submitted status
    const { data: allEmployees, isLoading } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 100000 })
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })

    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active" && item?.referenceId === selectedReference
    })

    const loadData = () => {
        
        const allSubmittedApprovedObjectives = appraisalObjective?.data?.filter((item: any) => {
            return item?.status === 'submitted' || item?.status ==="approved" || item?.status ==="rejected" || item?.status ==="amend"
        }) 
        const allTeamMembers = allEmployees?.data?.filter((item: any) => (item.lineManagerId)?.toString() === currentUser?.id)
        setTeamMembers(allTeamMembers)
        setEmployees(allEmployees)
        setObjectives(appraisalObjective)
        const employeesWithSubmittedObjectives = allTeamMembers?.filter((employee:any) =>
            allSubmittedApprovedObjectives?.some((obj:any) => 
            parseInt(obj.employeeId) === employee.id && 
            (obj.status === "submitted" || obj.status === "approved"|| obj.status === "rejected" || obj.status === "amend")
            && obj?.referenceId === selectedReference
            )
        )
        // setEmployeesWithSubmittedObjectives(employeesWithSubmittedObjectives)
    }

    const allSubmittedApprovedObjectives = appraisalObjective?.data?.filter((item: any) => {
        return item?.status === 'submitted' || item?.status ==="approved" || item?.status ==="rejected" || item?.status ==="amend"
    })

    const allTeamMembers = allEmployees?.data?.filter((item: any) => (item.lineManagerId)?.toString() === currentUser?.id)

    const employeesWithSubmittedObjectives = allTeamMembers?.filter((employee:any) =>
        allSubmittedApprovedObjectives?.some((obj:any) => 
        parseInt(obj.employeeId) === employee.id && 
        (obj.status === "submitted" || obj.status === "approved"|| obj.status === "rejected" || obj.status === "amend")
        && obj?.referenceId === selectedReference
        )
    )

    useEffect(() => {
            loadData()
        }, [appraisalObjective]
    )

    const onTabsChange = (key: string) => {
        console.log(key);
    };

    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: <>
                <Badge count={teamMembers?.length} showZero={true} title="Downlines" size="small">
                    <span>Team</span>
                </Badge>
            </>,
            children: (
                <>
                <ErrorBoundary>
                    <DownLines 
                        filteredByLineManger={teamMembers} 
                        loading={isLoading} 
                        allEmployees={employees}
                        referenceId={selectedReference}
                        allAppraisalobjective={objectives}
                    />
                </ErrorBoundary>
                </>
            ),
        },
        {
            key: '2',
            label: <>
                <Badge count={employeesWithSubmittedObjectives?.length} showZero={true} title="Awaiting approval" size="small">
                    <span>
                        Approvals
                    </span>
                </Badge>
            </>,
            children: (
                <>
                    <ErrorBoundary>
                        <NotificationsComponent loading={objectivesLoading} tag={checkActive?.tag?.trim()} 
                            referenceId={selectedReference} 
                            employeeWhoSubmitted={employeesWithSubmittedObjectives} />
                    </ErrorBoundary>
                </>
            ),
        }
    ]
    return (
        <div 
        // className='card border border-gray-400 '
            style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >
            <div className="col-3 flex justify-between items-center">
                <select value={selectedReference} onChange={(e) => setSelectedReference(e.target.value)} className="form-select mb-5 form-select-solid" >
                  <option value="">Select Reference</option>
                  {
                    employeesReference?.map((item: any) => (
                      <option value={item.referenceId}>
                        {getFieldName(item?.paygroupId, allPaygroups?.data)} - {getFieldName(item?.appraisalTypeId, allAppraisals?.data)} 
                      </option>
                    ))
                  }
                </select> 
            </div>
            <Tabs defaultActiveKey="1"
                type="line"
                items={tabItems}
                onChange={onTabsChange}
            // tabBarExtraContent={slot}
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


export { NotificationsBoard };



