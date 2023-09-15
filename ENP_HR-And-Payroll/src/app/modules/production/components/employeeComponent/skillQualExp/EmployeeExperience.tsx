import { Button, Modal, Space, Table } from "antd"
import { Api_Endpoint } from "../../../../../services/ApiCalls"
import axios from "axios"
import { useState } from "react"
import { KTSVG } from "../../../../../../_metronic/helpers"
import { useForm } from "react-hook-form"

const EmployeeExperience = () => {

    const [experienceData, setExperienceData] = useState([])
    const [experienceOpen, setExperienceOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const { register, reset, handleSubmit } = useForm()
    const showExperienceModal = () => {
        setExperienceOpen(true)
      }

    const deleteExperience = async (element: any) => {
        try {
          const response = await axios.delete(`${Api_Endpoint}/Experiences/${element.id}`)
          // update the local state so that react can refecth and re-render the table with the new data
          const newData = experienceData.filter((item: any) => item.id !== element.id)
          setExperienceData(newData)
          return response.status
        } catch (e) {
          return e
        }
      }
      
    function handleExperienceDelete(element: any) {
        deleteExperience(element)
      }

    const experienceColumns: any = [
        {
          title: 'Name',
          dataIndex: 'name',
          sorter: (a: any, b: any) => {
            if (a.name > b.name) {
              return 1
            }
            if (b.name > a.name) {
              return -1
            }
            return 0
          },
        },
    
        {
          title: 'Action',
          fixed: 'right',
          width: 100,
          render: (_: any, record: any) => (
            <Space size='middle'>
              <a onClick={() => handleExperienceDelete(record)} className='btn btn-light-danger btn-sm'>
                Delete
              </a>
    
            </Space>
          ),
    
        },
      ]

      const handleCancel = () => {
        setExperienceOpen(false)
    
      }

      const url1 = `${Api_Endpoint}/Experiences`
      const submitExperiences = handleSubmit(async (values: any) => {
        setLoading(true)
        const data = {
          name: values.name,
        //   employeeId: parseInt(param.id),
        //   tenantId: tenantId,
        }
        try {
          const response = await axios.post(url1, data)
          setSubmitLoading(false)
          reset()
          setExperienceOpen(false)
        //   loadExperiences()
          return response.statusText
        } catch (error: any) {
          setSubmitLoading(false)
          return error.statusText
        }
      })

    return (
        <div >
        <button style={{ margin: "0px 0px 20px 0" }} type='button' className='btn btn-primary me-3' onClick={showExperienceModal}>
          <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
          Add Experience
        </button>

        <Table columns={experienceColumns} />
        <Modal
          title="Add Experience"
          open={experienceOpen}
          onCancel={handleCancel}
          closable={true}
          footer={[
            <Button key='back' onClick={handleCancel}>
              Cancel
            </Button>,
            <Button
              key='submit'
              type='primary'
              htmlType='submit'
            //   loading={submitLoading}
              onClick={submitExperiences}
            >
              Submit
            </Button>,
          ]}
        >
          <form
            onSubmit={submitExperiences}

          >
            <hr></hr>
            <div style={{ padding: "20px 20px 20px 20px" }} className='row mb-0 '>
              <div className=' mb-7'>
                <label htmlFor="exampleFormControlInput1" className="form-label">Name</label>
                <input type="text" {...register("name")} className="form-control form-control-solid" />
              </div>

            </div>
          </form>
        </Modal>
      </div>
    )   
}

export default EmployeeExperience