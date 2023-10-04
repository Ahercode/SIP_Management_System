import { Button, Input, Space } from "antd"
import { KTSVG } from "../../../../../_metronic/helpers"



const EmployeeObjectiveHeaders = ()=>{


    return (

        <div className='d-flex justify-content-between'>
            <Space style={{ marginBottom: 16 }}>
                <Input
                placeholder='Enter Search Text'
                type='text'
                allowClear
                />
                <Button type='primary'>
                    Search
                </Button>
            </Space>
            <Space style={{ marginBottom: 16 }}>
                <button type='button' className='btn btn-primary me-3' >
                <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' />
                    Add
                </button>
            </Space>
        </div>
    )
}

export { EmployeeObjectiveHeaders }
