import { Badge, Button, Tabs, TabsProps } from "antd";
import { useState } from "react";
import { useQuery } from "react-query";
import { fetchDocument } from "../../../../../services/ApiCalls";
import { NotificationsComponent } from "../../lineManager/NotificationsComponent";
import { AppraisalPerformance } from "./AppraisalPerformance";
import { PerformanceDetails } from "./PerfDetails";
import { useAuth } from "../../../../auth";

const PerformanceBoard = () => {
    const [isDownlinesModalOpen, setIsDownlinesModalOpen] = useState(false)
    const { data: downlines, isLoading } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: employeeObjectives, isLoading: objectivesLoading } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const filteredByLineManger = downlines?.data?.filter((item: any) => item.supervisorId === '1')

    const { currentUser } = useAuth()
    const tenantId = localStorage.getItem('tenant')
    
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 100000 })
    // filter employeeObjectives by employees in the filteredByLineManger
    const filteredObjectives = employeeObjectives?.data?.filter((item: any) => filteredByLineManger?.map((item: any) => item.employeeId).includes(item.employeeId))

    // filter objectives by status === 'Awaiting HR Approval'
    // const filteredObjectivesByStatus = filteredObjectives?.filter((item: any) => item.status === 'Awaiting HR Approval')

    // const { data: employeeObjectives, isLoading: objectivesLoading } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 100000 })
   
    // const [filteredObjectives, setFilteredObjectives] = useState<any>([])
    // const [employeeWhoSubmitted, setEmployeeWhoSubmitted] = useState<any>([])
    const allTeamMembers = allEmployees?.data?.filter((item: any) => (item.lineManagerId)?.toString() === (currentUser?.id)?.toString())
    const allAmendObjectives = employeeObjectives?.data?.filter((item: any) => {
        return item?.status === 'amend'
    })

    const allSubmittedApprovedRejectedObjectives = employeeObjectives?.data?.filter((item: any) => {
        return item?.status === 'submitted' || item?.status ==="approved" || item?.status ==="rejected"
    })

    const employeesWithAmendObjectives = allEmployees?.data?.filter((employee:any) =>
    allAmendObjectives?.some((obj:any) => 
    parseInt(obj.employeeId) === employee.id && 
    (obj.status === "amend" )
    )
    );

    
    const employeesWithSubmittedApprovedRejectedObjectives = allEmployees?.data?.filter((employee:any) =>
    allSubmittedApprovedRejectedObjectives?.some((obj:any) => 
    parseInt(obj.employeeId) === employee.id && 
    (obj?.status === 'submitted' || obj?.status ==="approved" || obj?.status ==="rejected")
    )
    );

    const onTabsChange = (key: string) => {
        console.log(key);
    };

    const showDownlinesModal = () => {
        setIsDownlinesModalOpen(true)
    }

    const hideDownlinesModal = () => {
        setIsDownlinesModalOpen(false)
    }

    const slot = {
        right: <Button onClick={showDownlinesModal}>Show Downlines</Button>
    }

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
        {
            key: '2',
            label: <>
                <Badge count={employeesWithAmendObjectives?.length} showZero={true} title="Requests" size="small">
                    <span>Requests</span>
                </Badge>
            </>,
            children: (
                <>
                    <NotificationsComponent loading={objectivesLoading} employeeWhoSubmitted={employeesWithAmendObjectives} location="Requests"/>
                </>
            ),
        },
        {
            key: '3',
            label: <span>View details</span>,
            children: (
                <>
                    {/* <PerformanceDetails /> */}
                    <NotificationsComponent loading={objectivesLoading} employeeWhoSubmitted={employeesWithSubmittedApprovedRejectedObjectives} location="View Details"/>
                </>
            ),
        },
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

export { PerformanceBoard };

