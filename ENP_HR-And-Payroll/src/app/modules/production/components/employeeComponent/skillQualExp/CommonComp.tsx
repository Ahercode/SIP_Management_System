import { Button, Modal, Space, Table } from "antd"
import { KTSVG } from "../../../../../../_metronic/helpers"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { useQuery } from "react-query"
import { Api_Endpoint, fetchDocument } from "../../../../../services/ApiCalls"
import axios from "axios"

const CommonComp = (props: any) => {

    const { register, reset, handleSubmit } = useForm()
    const [modalOpen, setModalOpen] = useState(false)
    const tenantId = localStorage.getItem('tenant')

    const showModal = () => {
      setModalOpen(true)
    }
    const handleCancel = () => {
      setModalOpen(false)
    }

    const deleteQualification = async (element: any) => {
      try {
        const response = await axios.delete(`${Api_Endpoint}/EmployeeQualifications/${element.id}`)
        // update the local state so that react can refecth and re-render the table with the new data
        // const newData = qualificationData.filter((item: any) => item.id !== element.id)
        // setQualificationData(newData)
        return response.status
      } catch (e) {
        return e
      }
    }

    const columns: any = [
        {
          title: 'Nom',
          key: 'qualificationId',
          render: (row: any) => {
            // return getQualificationName(row.qualificationId)
          },
          sorter: (a: any, b: any) => {
            if (a.qualificationId > b.qualificationId) {
              return 1
            }
            if (b.qualificationId > a.qualificationId) {
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
              <a className='btn btn-light-danger btn-sm'>
                Delete
              </a>
    
            </Space>
          ),
    
        },
      ]



  
      const getSkillName = (skillId: any) => {
        let skillName = null
        props?.data.map((item: any) => {
          if (item.id === skillId) {
            skillName = item.name
          }
        })
        return skillName
      }
      const getQualificationName = (qualificationId: any) => {
        let qualificationName = null
        props.data.map((item: any) => {
          if (item.id === qualificationId) {
            qualificationName = item.name
          }
        })
        return qualificationName
      }


      const url = `${Api_Endpoint}/EmployeeSkills`
      const submitSkills = handleSubmit(async (values: any) => {
        // setLoading(true)
        const data = {
          skillId: values.skillId,
          // employeeId: parseInt(param.id),
          tenantId: tenantId,
        }
        try {
          const response = await axios.post(url, data)
          // setSubmitLoading(false)
          reset()
          // setSkillOpen(false)
         
          return response.statusText
        } catch (error: any) {
          // setSubmitLoading(false)
          return error.statusText
        }
      })

    return (
        <div >
            <button style={{ margin: "0px 0px 20px 0" }} type='button' 
            className='btn btn-primary me-3' 
            onClick={showModal}
            >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                {`Ajouter ${props?.title}`}
            </button>

            <Table  columns={columns}/>
            <Modal
                title={`Ajouter ${props?.title}`}
              open={modalOpen}
              onCancel={handleCancel}
                closable={true}
                footer={[
                <Button key='back' 
                onClick={handleCancel}
                >
                    Cancel
                </Button>,
                <Button
                    key='submit'
                    type='primary'
                    htmlType='submit'
                //   loading={submitLoading}
                //   onClick={submitQualifications}
                >
                    Submit
                </Button>,
                ]}
            >
                <form
                // onSubmit={submitQualifications}
                >
                <hr></hr>
                
                <div className=' mb-7'>
                    <label htmlFor="exampleFormControlInput1" className="form-label">{props?.title}</label>
                    <select {...register(`${props.id}`)} className="form-select form-select-solid" >
                    <option>select </option>
                    {props?.data?.map((item: any) => (
                        <option value={item.id}>{item.name}</option>
                    ))}
                    </select>
                </div>
                </form>
            </Modal>
        </div>
    )   
}

export default CommonComp