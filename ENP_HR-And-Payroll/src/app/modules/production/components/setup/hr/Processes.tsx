import { Table } from "antd"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../../../services/ApiCalls"

const Processes = () => {
    const { register, reset, handleSubmit } = useForm()
    const [gridData, setGridData] = useState([])
    const { data: allEmployees } = useQuery('employees', () => fetchDocument('employees'), { cacheTime: 5000 })
    const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument('appraisals'), { cacheTime: 5000 })
    const { data: allPaygroups } = useQuery('paygroups', () => fetchDocument('Paygroups'), { cacheTime: 5000 })
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    //


    const yearsList = [
        '2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030'
    ]

    const columns: any = [
        {
            title: 'Appraisals',
            dataIndex: 'appraisal',
            render: (record: any) => {
                return record?.name
            }
        },
        {
            title: 'Number of Employees',
            dataIndex: 'count',
            render: (record: any) => {
                return record?.count
            }
        },
    ]

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
        console.log('selectedRowKeys changed: ', newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
      };
    
      const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
      };

    return (
        <div style={{
            backgroundColor: 'white',
            padding: '40px',
            borderRadius: '5px',
            boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            margin: '10px'
        }}>
            <div className="d-flex flex-direction-row row">
                <form className='col-3 mb-7' >
                    <div className='mb-7'>
                        <label htmlFor="exampleFormControlInput1" className=" form-label">Year</label>
                        <select className="form-select form-select-solid" aria-label="Select example">
                            <option value="select year">select year</option>
                            {yearsList.map((item: any) => (
                                <option value={item}>{item}</option>
                            ))}
                        </select>
                    </div>
                    <div className='mb-7'>
                        <label htmlFor="exampleFormControlInput1" className="form-label">Group Achievement</label>
                        <input
                            {...register("groupAchievement")}
                            defaultValue={0}
                            type="number"
                            className="form-control form-control-solid" />
                    </div>
                    {/* <div className='mb-7'>
                        <label htmlFor="exampleFormControlInput1" className="form-label">Weight</label>
                        <input
                            {...register("weight")}
                            defaultValue={0}
                            type="number"
                            className="form-control form-control-solid" />
                    </div> */}
                </form>
                <div className="col-9 mb-7">
                    <Table rowSelection={rowSelection} columns={columns} dataSource={[]} />
                </div>
            </div>

        </div>
    )
}

export { Processes }
