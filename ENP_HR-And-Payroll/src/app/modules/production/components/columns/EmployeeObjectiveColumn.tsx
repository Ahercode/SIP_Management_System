import { Space } from "antd"

const employeeObjectiveColumns: any = [

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
      title: 'Weight per parameter (%)',
      dataIndex: 'weight',
      sorter: (a: any, b: any) => {
        if (a.status > b.status) {
          return 1
        }
        if (b.status > a.status) {
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
          <a className='btn btn-light-warning btn-sm'>
            Update
          </a>
          <a className='btn btn-light-danger btn-sm'>
            Delete
          </a>

        </Space>
      ),

    },
  ]

  export { employeeObjectiveColumns }
