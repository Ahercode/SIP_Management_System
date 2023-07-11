import { Badge, Button, Divider, Modal, Space, Switch, Tabs, TabsProps } from "antd";
import { DummyObjectives, NotificationsComponent } from "./NotificationsComponent";
import { right } from "@popperjs/core";
import { useState } from "react";
import { DownLines } from "./DownLines";
import { useQuery } from "react-query";
import { fetchDocument } from "../../../../services/ApiCalls";

const NotificationsBoard = () => {
    const [isDownlinesModalOpen, setIsDownlinesModalOpen] = useState(false)
    const { data: downlines, isLoading } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
    const { data: employeeObjectives, isLoading: objectivesLoading } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const filteredByLineManger = downlines?.data?.filter((item: any) => item.supervisorId === '1')

    // filter employeeObjectives by employees in the filteredByLineManger
    const filteredObjectives = employeeObjectives?.data?.filter((item: any) => filteredByLineManger?.map((item: any) => item.employeeId).includes(item.employeeId))

   

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
                <Badge count={DummyObjectives?.length} showZero={true} title="Downlines" size="small">
                    <span>Team</span>
                </Badge>
            </>,
            children: (
                <>
                    <DownLines  filteredByLineManger={DummyObjectives} loading={isLoading} />
                </>
            ),
        },
        {
            key: '2',
            label: <>
                <Badge count={DummyObjectives?.filter((item: any) => item.status === 'Awaiting approval')?.length} showZero={true} title="Awaiting approvals" size="small">
                    <span>Approvals</span>
                </Badge>
            </>,
            children: (
                <>
                    <NotificationsComponent filteredBySubmitted={DummyObjectives?.filter((item: any) => item.status === 'Awaiting approval')} loading={objectivesLoading} />
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
        <div className='card border border-gray-400 '
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


export { NotificationsBoard }