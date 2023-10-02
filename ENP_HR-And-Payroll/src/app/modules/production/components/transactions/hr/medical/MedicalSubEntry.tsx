import { useQuery } from "react-query"
import { Api_Endpoint, fetchDocument } from "../../../../../../services/ApiCalls"
import { Button, Modal, Table, message } from "antd"
import { useEffect, useState } from "react"
import axios from "axios"
import { set } from "react-hook-form"
import { get } from "jquery"
import { getFieldName } from "../../../../../../services/CommonService"

const MedicalSubEntry = (props: any) => {

    const[gridData, setGridData] = useState<any>([])
    const [isModalOpen, setIsModalOpen] = useState(false)

    const deleteData = async (element: any) => {
        try {
          const response = await axios.delete(`${Api_Endpoint}/MedicalTranItems/${element.id}`)
          const newData = gridData.filter((item: any) => item.id !== element.id)
            setGridData(newData)
          message.success('Product/Sercice deleted successfully')
          return response.status
        } catch (e) {
          message.warning('Oops! something went wrong')
          return e
        }
      }

      function handleDelete(element: any) {
        deleteData(element)
      }

      const showModal = () => {
        setIsModalOpen(true)
      }

    const handleCancel = () => {
        setIsModalOpen(false)   
    }
      const columns = [
        {
          title: 'Product/Service',
          dataIndex: 'productId',
          key: 'productId',
          render: (text: any, record: any) => {
           return getFieldName(record?.productId, products?.data)
          }
        },
        {
          title: 'Amount',
          dataIndex: 'cost',
          key: 'cost',
        },
        {
          title: 'Action',
          dataIndex: 'action',
          key: 'action',
          render: (text: any, record: any) => (
            <div className='d-flex'>
              <a
                onClick={() => {
                  handleDelete(record)
                }}
                className='btn btn-light-danger btn-sm'
              >
                Delete
              </a>
              <h2>{text}</h2>
            </div>
          ),
        },
      ]
      
      const { data: medicalTranItems } = useQuery('medicalTranItems', () => fetchDocument(`MedicalTranItems`), { cacheTime: 5000 })
      const { data: products } = useQuery('products', () => fetchDocument(`Products`), { cacheTime: 5000 })
   
      const loadData = () => {
            // const data = medicalTranItems?.data?.map((item: any) => {
                // get 
                const data = medicalTranItems?.data?.filter((item: any) => {
                    return item.medicalTranId === props?.record?.id
                }
                )
        return setGridData(data)
    }

    useEffect(() => {
        loadData()
    }, [isModalOpen])

    return (
        <>

        <a onClick={showModal} className='btn btn-light-info btn-sm'>
            Details
        </a>
            <Modal
              title="Details"
              open={isModalOpen}
              onCancel={handleCancel}
              closable={true}
              width="800px"
              footer={[
                <Button key='back' onClick={handleCancel}>
                    Cancel
                </Button>,
                
              ]}
            > 
                <Table columns={columns} dataSource={gridData}/>
            </Modal>
        </>
    )

}


export { MedicalSubEntry }