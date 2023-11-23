import { Badge, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchDocument } from "../../../../services/ApiCalls";
import { useAuth } from "../../../auth";
import { DownLines } from "./DownLines";
import { NotificationsComponent } from "./NotificationsComponent";
import { ErrorBoundary } from "@ant-design/pro-components";
import { set } from "react-hook-form";

const NotificationsBoard = () => {

    
    const { currentUser } = useAuth()
    const tenantId = localStorage.getItem('tenant')
    const [employeesWithSubmittedObjectives, setEmployeesWithSubmittedObjectives] = useState<any>([])
    const [employees, setEmployees] = useState<any>([])
    const [objectives, setObjectives] = useState<any>([])
    const [teamMembers, setTeamMembers] = useState<any>([])
    // const [isLoading, setIsLoading] = useState<any>(false)
    // const [objectivesLoading, setObjectivesLoading] = useState<any>(false)
    
    
    // const { data: downlines } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 100000 })


    
   
    // const [filteredObjectives, setFilteredObjectives] = useState<any>([])
    const [employeeWhoSubmitted, setEmployeeWhoSubmitted] = useState<any>([])
    const { data: employeeObjectives, isLoading: objectivesLoading } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 100000 })
    // get all objectives with submitted status
    const { data: allEmployees, isLoading } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 100000 })
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })

    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active"
    })
    const loadData = () => {
        
        const allSubmittedApprovedObjectives = employeeObjectives?.data?.filter((item: any) => {
            return item?.status === 'submitted' || item?.status ==="approved" || item?.status ==="rejected" || item?.status ==="amend"
        }) 
        const allTeamMembers = allEmployees?.data?.filter((item: any) => (item.lineManagerId)?.toString() === currentUser?.id)
        setTeamMembers(allTeamMembers)
        setEmployees(allEmployees)
        setObjectives(employeeObjectives)
        // setIsLoading(isLoading)
        // setObjectivesLoading(objectivesLoading)
        const employeesWithSubmittedObjectives = allTeamMembers?.filter((employee:any) =>
            allSubmittedApprovedObjectives?.some((obj:any) => 
            parseInt(obj.employeeId) === employee.id && 
            (obj.status === "submitted" || obj.status === "approved"|| obj.status === "rejected" || obj.status === "amend")
            && obj?.referenceId === checkActive?.referenceId
            )
        )
        setEmployeesWithSubmittedObjectives(employeesWithSubmittedObjectives)
        
    }

    useEffect(() => {
        loadData()
    }, [employeeObjectives])

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
                    <span>Approvals</span>
                </Badge>
            </>,
            children: (
                <>
                    <NotificationsComponent loading={objectivesLoading} tag={checkActive?.tag?.trim()} employeeWhoSubmitted={employeesWithSubmittedObjectives} />
                </>
            ),
        },
        // {
        //     key: '3',
        //     label: <>
        //         <Badge count={0} showZero={true} title="Rejected objectives" size="default">
        //             <span>Notifications</span>
        //         </Badge>
        //     </>,
        //     children: (
        //         <>
        //             <NotificationsComponent />
        //         </>
        //     ),
        // },
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



