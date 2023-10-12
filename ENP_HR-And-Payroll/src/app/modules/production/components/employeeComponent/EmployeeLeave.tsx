import { Space, Table } from "antd"

const EmployeeLeave = () => {


    const leaveColumns: any = [

        {
          title: 'Code',
          dataIndex: 'code',
          sorter: (a: any, b: any) => {
            if (a.code > b.code) {
              return 1
            }
            if (b.code > a.code) {
              return -1
            }
            return 0
          },
        },
        {
          title: 'Type de Congé',
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
    
    
              <a className='btn btn-light-danger btn-sm'>
                Delete
              </a>
    
            </Space>
          ),
    
        },
      ]

    return (
        <div>
            <Table columns={leaveColumns} />
        </div>
    )   
}

export default EmployeeLeave