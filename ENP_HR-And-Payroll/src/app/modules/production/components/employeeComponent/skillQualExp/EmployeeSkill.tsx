import { Space } from "antd"

const EmployeeSkill = () => {



    const qualificationColumns: any = [
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

    return (
        <div>
            <h1>EmployeeSkillnQualification</h1>
        </div>
    )   
}

export default EmployeeSkill