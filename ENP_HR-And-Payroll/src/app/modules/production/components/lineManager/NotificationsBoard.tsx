import { Badge, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchDocument } from "../../../../services/ApiCalls";
import { DownLines } from "./DownLines";
import { NotificationsComponent } from "./NotificationsComponent";
import { useAuth } from "../../../auth";

const NotificationsBoard = () => {

    const { currentUser } = useAuth()
    
    const { data: allEmployees, isLoading } = useQuery('employees', () => fetchDocument('employees'), { cacheTime: 5000 })
    const { data: downlines } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })


    const { data: employeeObjectives, isLoading: objectivesLoading } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    // const filteredByLineManger = downlines?.data?.filter((item: any) => item.supervisorId === '1')
    const [filteredObjectives, setFilteredObjectives] = useState<any>([])
    const [employeeWhoSubmitted, setEmployeeWhoSubmitted] = useState<any>([])

    // check get all employees with line manager id = current user id
    // console.log('currentUser: ', currentUser?.id)
    const allTeamMembers = allEmployees?.data?.filter((item: any) => (item.lineManagerId)?.toString() === (currentUser?.id)?.toString())
    // const data = employeeObjectives?.data?.filter((item: any) => allTeamMembers?.map((item: any) => (item.id)?.toString()).includes(item.employeeId))
    // console.log('allTeamMembers: ', allTeamMembers)
    // console.log('data: ', data)
    // console.log('employeeObjectives: ', employeeObjectives?.data)

    // get all objectives with submitted status
    const allSubmittedObjectives = employeeObjectives?.data?.map((item: any) => {
        if(item?.status === 'Submitted'){

            return item?.employeeId
        }
        else
        {
            return null
        }
    })
    
    // console.log('allSubmittedObjectives3: ', allSubmittedObjectives)
    // console.log('allTeamMembers: ', allTeamMembers  )
  
            // console.log('data1: ', data)

          
    const loadData = async () => {
        try {
            const data = allTeamMembers?.filter((item: any) => allSubmittedObjectives.includes(item.id.toString()))
            console.log('data2: ', data)
            setEmployeeWhoSubmitted(data)
            // setFilteredObjectives(data)
        } catch (error) {
            console.log('loadError: ', error)
        }
    }

    useEffect(() => {
        loadData()
    }, [employeeObjectives?.data, allEmployees?.data])


    const onTabsChange = (key: string) => {
        console.log(key);
    };


    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: <>
                <Badge count={allTeamMembers?.length} showZero={true} title="Downlines" size="small">
                    <span>Team</span>
                </Badge>
            </>,
            children: (
                <>
                    <DownLines filteredByLineManger={allTeamMembers} loading={isLoading} />
                </>
            ),
        },
        {
            key: '2',
            label: <>
                <Badge count={employeeWhoSubmitted?.length} showZero={true} title="Awaiting approval" size="small">
                    <span>Approvals</span>
                </Badge>
            </>,
            children: (
                <>
                    <NotificationsComponent loading={objectivesLoading} filter={'Submitted'} employeeWhoSubmitted={employeeWhoSubmitted} />
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
