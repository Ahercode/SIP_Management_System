import { Space, Table } from "antd"

const EmployeeCompensation = () => {

    const compensationColumns: any = [

        {
          title: 'Period',
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
          title: 'Compensation Type',
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
            <Table columns={compensationColumns} />
        </div>
    )
}

export default EmployeeCompensation