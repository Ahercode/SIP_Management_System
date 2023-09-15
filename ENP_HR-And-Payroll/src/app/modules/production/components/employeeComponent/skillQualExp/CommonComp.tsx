import { Button, Modal, Space, Table } from "antd"
import { KTSVG } from "../../../../../../_metronic/helpers"
import { useForm } from "react-hook-form"

const CommonComp = (props: any) => {

    const { register, reset, handleSubmit } = useForm()
    const columns: any = [
        {
          title: 'Name',
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
        // allSkills?.data.map((item: any) => {
        //   if (item.id === skillId) {
        //     skillName = item.name
        //   }
        // })
        return skillName
      }
      const getQualificationName = (qualificationId: any) => {
        let qualificationName = null
        // allQualifications?.data.map((item: any) => {
        //   if (item.id === qualificationId) {
        //     qualificationName = item.name
        //   }
        // })
        return qualificationName
      }

    return (
        <div >
            <button style={{ margin: "0px 0px 20px 0" }} type='button' 
            className='btn btn-primary me-3' 
            // onClick={showQualificationModal}
            >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                {props?.title}
            </button>

            <Table  />
            <Modal
                title="Add Qualification"
            //   open={qualificationOpen}
            //   onCancel={handleCancel}
                closable={true}
                footer={[
                <Button key='back' 
                // onClick={handleCancel}
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
                    <label htmlFor="exampleFormControlInput1" className="form-label">Qualification</label>
                    <select {...register(`${props.id}`)} className="form-select form-select-solid" >
                    <option>select </option>
                    {props?.data?.data.map((item: any) => (
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