import { Collapse, CollapseProps, Skeleton, Space, Table } from "antd"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"

const ReviewFormComponent: React.FC = ({ parameterId }: any) => {

    const [objectivesData, setObjectivesData] = useState<any>([])

    const [itemsData, setItemsData] = useState<CollapseProps['items']>([])
    const [loading, setLoading] = useState(false)

    const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })
    const { data: appraisalobjective } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
    const { data: appraisaldeliverable } = useQuery('appraisaldeliverable', () => fetchDocument(`appraisaldeliverable`), { cacheTime: 5000 })

    const onChange = (key: string | string[]) => {
        console.log(key);
    };


    const loadData = async () => {
        setLoading(true)
        try {
            const objectivesResponse = appraisalobjective?.data.filter((item: any) => item.parameterId === parameterId)
            setObjectivesData(objectivesResponse)

            const itemData = objectivesResponse?.map((item: any) => ({
                key: item?.id,
                label: item?.name,
                children: <AppraisalFormDeliverableComponent appraisalObjectivesData={item} />
            }
            ))
            setItemsData(itemData)
            console.log('itemsData', itemData)
            setLoading(false)

        } catch (error) {
            console.log('loadError: ', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()

    }, [parameters?.data, appraisalobjective?.data, appraisaldeliverable?.data])

    return (
        <div >
            <Collapse size="large" items={itemsData} onChange={onChange} />
        </div>
    )
}

const AppraisalFormObjectiveComponent = ({ appraisalParameterData }: any) => {

    const [objectivesData, setObjectivesData] = useState<any>([])
    const tenantId = localStorage.getItem('tenant')

    const { data: appraisalobjective } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective/tenant/test`), { cacheTime: 5000 })
    const { data: appraisaldeliverable } = useQuery('appraisaldeliverable', () => fetchDocument(`appraisaldeliverable/tenant/test`), { cacheTime: 5000 })

    const loadData = async () => {
        try {
            const objectivesResponse = appraisalobjective?.data?.filter((item: any) => item.objectiveId === appraisalParameterData.id)
            setObjectivesData(objectivesResponse)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        loadData()
    })

    return (
        <div>
            {
                objectivesData?.map((item: any) => (
                    <AppraisalFormDeliverableComponent appraisalObjectivesData={item} />
                ))
            }
        </div>
    )
}

const AppraisalFormDeliverableComponent = ({ appraisalObjectivesData }: any) => {

    const [deliverablesData, setDeliverablesData] = useState<any>([])
    const { register, reset, handleSubmit } = useForm()
    const [loading, setLoading] = useState(false)

    const tenantId = localStorage.getItem('tenant')

    const { data: appraisalobjective } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective/tenant/test`), { cacheTime: 5000 })
    const { data: appraisaldeliverable } = useQuery('appraisaldeliverable', () => fetchDocument(`appraisaldeliverable/tenant/test`), { cacheTime: 5000 })

    const loadData = async () => {
        setLoading(true)
        try {
            const deliverablesResponse = appraisaldeliverable?.data?.filter((item: any) => item.objectiveId === appraisalObjectivesData.id)
            setDeliverablesData(deliverablesResponse)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    }

    useEffect(() => {
        loadData()
    })


    const deliverableColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
        },
        {
            title: 'Sub weight',
            dataIndex: 'subWeight',
        },
        {
            title: 'Unit of measure',
            dataIndex: 'unitOfMeasure',
        },
        {
            title: 'Target',
            dataIndex: 'target',
        },
        {
            title: 'Actual',
            width: 200,
            render: (text: any, record: any) => (
                <div className="d-flex align-items-center">
                    <input type="number" {...register('actualValue')} className="form-control" placeholder="Enter actual here" required />
                </div>
            )
        },
    ]

    return (
        <div className="d-flex flex-column align-items-start mt-7 col-12" >
            <div className="col-12">
                <Space className="mb-5 align-content-center align-items-center d-flex">
                    <span className='fs-3 fw-bold mb-2'>{appraisalObjectivesData?.name}</span>
                    <div className="bullet"></div>
                    <span className=' fs-3 fw-bold mb-2 text-primary'>{appraisalObjectivesData?.description}</span>
                </Space>
                {
                    loading ? <Skeleton active /> :
                        <Table columns={deliverableColumns} dataSource={deliverablesData} loading={loading} />
                }
            </div>
        </div>
    )
}





export { AppraisalFormDeliverableComponent, AppraisalFormObjectiveComponent, ReviewFormComponent }
