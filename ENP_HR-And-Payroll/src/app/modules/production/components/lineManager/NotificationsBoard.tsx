import { Badge, Button, Divider, Modal, Space, Switch, Tabs, TabsProps } from "antd";
import { NotificationsComponent } from "./NotificationsComponent";
import { right } from "@popperjs/core";
import { useState } from "react";
import { DownLines } from "./DownLines";

const NotificationsBoard = () => {
    const [isDownlinesModalOpen, setIsDownlinesModalOpen] = useState(false)

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
                <Badge count={0} showZero={true} title="Awaiting approvals" size="small">
                    <span>Approvals</span>
                </Badge>
            </>,
            children: (
                <>
                    <NotificationsComponent />
                </>
            ),
        },
        {
            key: '2',
            label: <>
                <Badge count={0} showZero={true} title="Rejected objectives" size="small">
                    <span>Notifications</span>
                </Badge>
            </>,
            children: (
                <>
                    <NotificationsComponent />
                </>
            ),
        },
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
                tabBarExtraContent={slot}
            />

            <Modal
                title={'Downlines'}
                open={isDownlinesModalOpen}
                onCancel={hideDownlinesModal}
                width={1000}
                footer={[<Button onClick={hideDownlinesModal}>Close</Button>]}
                closable={true}>
                <div className="mt-7">
                    <DownLines />
                </div>
            </Modal>
        </div>
    )
}

export { NotificationsBoard }