import { Badge, Tabs, TabsProps } from "antd";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchDocument } from "../../../../services/ApiCalls";
import { DownLines } from "./DownLines";
import { NotificationsComponent } from "./NotificationsComponent";

const NotificationsBoard = () => {
    const { data: downlines, isLoading } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: employeeObjectives, isLoading: objectivesLoading } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const filteredByLineManger = downlines?.data?.filter((item: any) => item.supervisorId === '1')
    const [filteredObjectives, setFilteredObjectives] = useState<any>([])


    const loadData = async () => {
        try {
            const data = employeeObjectives?.data?.filter((item: any) => filteredByLineManger?.map((item: any) => item.employeeId).includes(item.employeeId))
            setFilteredObjectives(data)
        } catch (error) {
            console.log('loadError: ', error)
        }
    }

    useEffect(() => {
        loadData()
    }, [employeeObjectives?.data])


    const onTabsChange = (key: string) => {
        console.log(key);
    };


    const tabItems: TabsProps['items'] = [
        {
            key: '1',
            label: <>
                <Badge count={filteredObjectives?.length} showZero={true} title="Downlines" size="small">
                    <span>Team</span>
                </Badge>
            </>,
            children: (
                <>
                    <DownLines filteredByLineManger={filteredObjectives} loading={isLoading} />
                </>
            ),
        },
        {
            key: '2',
            label: <>
                <Badge count={filteredObjectives?.filter((item: any) => item?.status === 'Submitted')?.length} showZero={true} title="Awaiting approval" size="small">
                    <span>Approvals</span>
                </Badge>
            </>,
            children: (
                <>
                    <NotificationsComponent loading={objectivesLoading} filter={'Submitted'} filteredByObjectives={filteredObjectives} />
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