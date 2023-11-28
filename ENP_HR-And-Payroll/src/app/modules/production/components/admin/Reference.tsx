import { Button, Input, Modal, Space, Table, message } from "antd"
import { KTCardBody, KTSVG } from "../../../../../_metronic/helpers"
import { useQuery, useQueryClient } from "react-query"
import { Api_Endpoint, fetchDocument } from "../../../../services/ApiCalls"
import { getFieldName } from "../ComponentsFactory"
import { useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"

const ReferencesPage = () => {
    const tenantId = localStorage.getItem('tenant')
    const [tempData, setTempData] = useState<any>()
    const queryClient = useQueryClient()
    const { reset, register, handleSubmit } = useForm()
    const { data: allAppraisalsPerfTrans } = useQuery('appraisalPerfTransactions', () => fetchDocument(`AppraisalPerfTransactions/tenant/${tenantId}`), { cacheTime: 10000 })
    const { data: allPeriods } = useQuery('periods', () => fetchDocument(`periods`), { cacheTime: 10000 })
    const { data: allPaygroups } = useQuery('paygroups', () => fetchDocument(`Paygroups/tenant/${tenantId}`), { cacheTime: 10000 })
    const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`appraisals/tenant/${tenantId}`), { cacheTime: 10000 })
    const [isModalVisible, setIsModalVisible] = useState(false);    

    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })

    const activeSchedule = allReviewdates?.data?.filter((item: any) => {
        return item?.isActive?.trim() === "active"
    })
    const checkActive = allAppraisalsPerfTrans?.data?.filter((item: any) => {
        return item?.status?.trim() === "active"
    })
    const handleModalOpen = (record: any) => {
        console.log('record: ', record) 
        setTempData(record)
        setIsModalVisible(true);
    }

    const handleChange = (event: any) => {
        event.preventDefault()
        setTempData({ ...tempData, [event.target.name]: event.target.value });
      }
    const columns: any = [
        {
            title:"Status",
            dataIndex:"status",
            key:"status",
            render: (row: any) => {
                return (
                    <>
                        {row?.trim() === "active" ? (
                            <span className='badge badge-light-success fs-7 fw-bold'>Active</span>
                        ) : (
                            <span className='badge badge-light-warning fs-7 fw-bold'>Inactive</span>)}
                    </>
                )
              },
        },
        {
            title:"Employee Group",
            dataIndex:"paygroupId",
            key:"paygroupId",
            render: (row: any) => {
                return getFieldName(row, allPaygroups?.data)
              },
        },
        {
            title:"Appraisal Type",
            dataIndex:"appraisalTypeId",
            key:"appraisalTypeId",
            render: (row: any) => {
                return getFieldName(row, allAppraisals?.data)
              },
        },
        {
            title:"Start Period",
            dataIndex:"startPeriod",
            key:"startPeriod",
            render: (row: any) => {
                return getFieldName(row, allPeriods?.data)
              },
        },
        {
            title:"End Period",
            dataIndex:"endPeriod",
            key:"endPeriod",
            render: (row: any) => {
                return getFieldName(row, allPeriods?.data)
              },
        },
        {
            title:"Action",
            render: (_:any, record: any) => (                    
                <button onClick={()=>handleModalOpen(record)} type='button' className='btn btn-light-success btn-sm' 
                >
                    Status
                </button>
            )
        },
    ]

    const changeStatus = handleSubmit(async (values) => {
        
        console.log('tempData: ', tempData)
         const  data = {
            id: tempData?.id,
            paygroupId: tempData?.paygroupId,
            appraisalTypeId:tempData?.appraisalTypeId,
            startPeriod:tempData?.startPeriod,
            endPeriod:tempData?.endPeriod,
            status: values?.status,
            tenantId: tenantId,
            referenceId: tempData?.referenceId,
        }
        console.log('data: ', data)
        // if(checkActive?.length > 0 && values?.status === "active" ) {
        //     message.error('You already have an active reference, kindly deactivate it first!')
        // }
        // else if(activeSchedule?.length > 0){
        //     message.error('You have an active schedule, kindly deactivate it first!')
        // }
        // else{
            try {
                axios.put(`${Api_Endpoint}/AppraisalPerfTransactions/${tempData?.id}`,data).then((res) => {
                    message.success('Status changed successfully')
                    setIsModalVisible(false)
                    queryClient.invalidateQueries('appraisalPerfTransactions')
                    reset()
                }
                ).catch((err) => {
                    message.error('Error changing status')
                    console.log('err: ', err)
                })
            } catch (error) {
                message.error('Internal server error')
            }
        // }
    })

    return (
    <div
        style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
    }}
    >
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
          <Table 
            columns={columns} 
            dataSource={allAppraisalsPerfTrans?.data} 
          />
          <Modal
                title='Set Status'
                closable={true}
                open={isModalVisible}
                width={300}
                onCancel={() => setIsModalVisible(false)}
                footer={[
                    <Button key='back'
                        onClick={() => setIsModalVisible(false)}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key='submit'
                        type='primary'
                        htmlType='submit'
                        onClick={changeStatus}
                    >
                        Submit
                    </Button>,
                ]}
            >
                <hr></hr>
                 <form 
                    onSubmit={changeStatus}
                 >
                    <div className=' mb-7'>
                        <label className=" form-label">Status</label>
                        <select 
                        {...register("status")} name="status"
                        value={tempData?.isActive?.trim()}
                        onChange={handleChange}
                        className="form-select form-select-solid" aria-label="Select example">
                            <option value="select">Select status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                 </form>
            </Modal>
        </div>
      </KTCardBody>
    </div>
    )
}


export { ReferencesPage }