import { Space, Table } from 'antd'
import { KTCardBody, KTSVG, toAbsoluteUrl } from '../../../../../_metronic/helpers'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { fetchDocument } from '../../../../services/ApiCalls'
const CashFlow = () => {


  const [periodInterval, setPeriodInterval] = useState<any>("5")
  const [period, setPeriod] = useState("1")
  const [project, setProject] = useState<any>("")
//   const [finance, setPr] = useState<any>("")
  const [financeOption, setFinanceOption] = useState("")
  
  const periods: any = [
   
    {
        title: 'January',
        id:1
    },
    {
        title: 'February',
        id:2
    },
    {
        title: 'March',
        id:3
    },
    {
        title: 'April',
        id:4
    },
    {
        title: 'May',
        id:5
    },
    {
        title: 'June',
        id:6
    },
    {
        title: 'July',
        id:7
    },
    {
        title: 'August',
        id:8
    },
    {
        title: 'Septmeber',
        id:9
    },
    {
        title: 'October',
        id:10
    },
    {
        title: 'November',
        id:11
    },
    {
        title: 'December',
        id:12
    }
  ]

  const columns1: any = [
   
    {
        title: 'Jun23',
    },
    {
        title: 'Jul23',
    },
    {
        title: 'Agu23',
    },
    {
        title: 'Sep23',
    },
    {
        title: 'Oct23',
    },
    {
        title: 'Nov23',
    },
    {
        title: 'Dec23',
    }
  ]

  const columns2: any = [
   
    {
        title: 'Jun23',
        id:1
    },
    {
        title: 'Jul23',
        id:2
    },
    {
        title: 'Agu23',
        id:3
    },
    {
        title: 'Sep23',
        id:4
    },
    {
        title: 'Oct23',
        id:5
    },
    {
        title: 'Nov23',
        id:6
    },
    {
        title: 'Dec23',
        id:7
    },
    {
        title: 'Jan24',
        id:8
    },
    {
        title: 'Feb24',
        id:9
    },
    {
        title: 'Mar24',
        id:10
    },
    {
        title: 'Apr24',
        id:11
    },
    {
        title: 'May24',
        id:12
    },
   
  ]

  const columns3: any = [
   
    {
        title: 'Jun23',
    },
    {
        title: 'Jul23',
    },
    {
        title: 'Agu23',
    },
    {
        title: 'Sep23',
    },
    {
        title: 'Oct23',
    },
    {
        title: 'Nov23',
    },
    {
        title: 'Dec23',
    },
    {
        title: 'Jan24',
    },
    {
        title: 'Feb24',
    },
    {
        title: 'Mar24',
    },
    {
        title: 'Apr24',
    },
    {
        title: 'May24',
    },
    {
        title: 'Jun24',
    },
    {
        title: 'Jul24',
    },
    {
        title: 'Agu24',
    },
    {
        title: 'Sep24',
    },
    {
        title: 'Oct24',
    },
    {
        title: 'Nov24',
    },
      
  ]

  const columns4: any = [
   
    {
        title: 'Jan23',
        dataIndex:"jan23",
        align:"right",
        id:1
    },
    {
        title: 'Feb23',
        dataIndex:"feb23",
        align:"right",
        id:2
    },
    {
        title: 'Mar23',
        align:"right",
        dataIndex:"",
        id:3
    },
    {
        title: 'Apr23',
        dataIndex:"apr23",
        align:"right",
        id:4
    },
    {
        title: 'May23',
        dataIndex:"may23",
        align:"right",
        id:5
    },
    {
        title: 'Jun23',
        dataIndex:"jun23",
        align:"right",
        id:6
    },
    {
        title: 'Jul23',
        dataIndex:"jul23",
        align:"right",
        id:7
    },
    {
        title: 'Aug23',
        dataIndex:"aug23",
        align:"right",
        id:8
    },
    {
        title: 'Sep23',
        dataIndex:"sep23",
        align:"right",
        id:9
    },
    {
        title: 'Oct23',
        dataIndex:"oct23",
        align:"right",
        id:10
    },
    {
        title: 'Nov23',
        dataIndex:"nov23",
        align:"right",
        id:11
    },
    {
        title: 'Dec23',
        dataIndex:"dec23",
        align:"right",
        id:12
    },
    {
        title: 'Jan24',
        dataIndex:"jan24",
        align:"right",
        id:13
    },
    {
        title: 'Feb24',
        dataIndex:"feb24",
        align:"right",
        id:14
    },
    {
        title: 'Mar24',
        dataIndex:"mar24",
        align:"right",
        id:15
    },
    {
        title: 'Apr24',
        dataIndex:"apr24",
        align:"right",
        id:16
    },
    {
        title: 'May24',
        dataIndex:"may24",
        align:"right",
        id:17
    },
    {
        title: 'Jun24',
        dataIndex:"jun24",
        align:"right",
        id:18
    },
    {
        title: 'Jul24',
        dataIndex:"jul24",
        align:"right",
        id:19
    },
    {
        title: 'Aug24',
        dataIndex:"aug24",
        align:"right",
        id:20
    },
    {
        title: 'Sep24',
        dataIndex:"sep24",
        align:"right",
        id:21
    },
    {
        title: 'Oct24',
        dataIndex:"oct24",
        align:"right",
        id:22
    },
    {
        title: 'Nov24',
        dataIndex:"nov24",
        align:"right",
        id:23
    },
    {
        title: 'Dec24',
        dataIndex:"dec24",
        align:"right",
        id:24
    },
    {
        title: 'Jan25',
        dataIndex:"jan25",
        align:"right",
        id:25
    },
    {
        title: 'Feb25',
        dataIndex:"feb25",
        align:"right",
        id:26
    },
    {
        title: 'Mar25',
        dataIndex:"mar25",
        align:"right",
        id:27
    },
    {
        title: 'Apr25',
        dataIndex:"apr25",
        align:"right",
        id:28
    },
    {
        title: 'May25',
        dataIndex:"may25",
        align:"right",
        id:29
    },
    {
        title: 'Jun25',
        dataIndex:"jun25",
        align:"right",
        id:30
    },
    {
        title: 'Jul25',
        dataIndex:"jul25",
        align:"right",
        id:31
    },
    {
        title: 'Aug25',
        dataIndex:"aug25",
        align:"right",
        id:32
    },
    {
        title: 'Sep25',
        dataIndex:"sep25",
        align:"right",
        id:33
    },
    {
        title: 'Oct25',
        dataIndex:"oct25",
        align:"right",
        id:34
    },
    {
        title: 'Nov25',
        dataIndex:"nov25",
        align:"right",
        id:35
    },
    {
        title: 'Dec25',
        dataIndex:"dec25",
        align:"right",
        id:36
    },
    {
        title: 'Jan26',
        align:"right",
        dataIndex:"",
        id:37
    },
    {
        title: 'Feb26',
        align:"right",
        dataIndex:"",
        id:38
    },
    {
        title: 'Mar26',
        align:"right",
        dataIndex:"",
        id:39
    },
    {
        title: 'Apr26',
        align:"right",
        dataIndex:"",
        id:40
    },
    {
        title: 'May26',
        align:"right",
        dataIndex:"",
        id:41
    },
    {
        title: 'Jun26',
        align:"right",
        dataIndex:"",
        id:42
    },
    {
        title: 'Jul26',
        align:"right",
        dataIndex:"",
        id:43
    },
    {
        title: 'Agu26',
        align:"right",
        dataIndex:"",
        id:44
    },
    {
        title: 'Sep26',
        align:"right",
        dataIndex:"",
        id:45
    },
    {
        title: 'Oct26',
        align:"right",
        dataIndex:"",
        id:46
    },
    {
        title: 'Nov26',
        align:"right",
        dataIndex:"",
        id:47
    },
    {
        title: 'Dec26',
        align:"right",
        dataIndex:"",
        id:48
    },
    {
        title: 'Jan27',
        align:"right",
        dataIndex:"",
        id:49
    },
    {
        title: 'Feb27',
        dataIndex:"",
        id:50
    },
    {
        title: 'Mar27',
        dataIndex:"",
        id:51
    },
    {
        title: 'Apr27',
        dataIndex:"",
        id:52
    },
    {
        title: 'May27',
        dataIndex:"",
        id:53
    },
    {
        title: 'Jun27',
        dataIndex:"",
        id:54
    },
    {
        title: 'Jul27',
        dataIndex:"",
        id:55
    },
    {
        title: 'Agu27',
        dataIndex:"",
        id:56
    },
    {
        title: 'Sep27',
        dataIndex:"",
        id:57
    },
    {
        title: 'Oct27',
        dataIndex:"",
        id:58
    },
    {
        title: 'Nov27',
        dataIndex:"",
        id:59
    },
    {
        title: 'Dec27',
        dataIndex:"",
        id:60
    },
        
  ]

  const dummyData: any = [
    {
        decs:'Warehouse Building',
        jan23: '600.00',
        feb23: '',
        mar23: '',
        apr23: '53,273.00',
        may23: '7,930.00',
        jun23: '',
        jul23: '',
        aug23: '4,567.00',
        sep23: '',
        oct23: '',
        nov23: '3,456.00',
        dec23: '2,447.00',
        id:1
    },
    // {
    //     description: 'Feb23',
    //     amount: 'Feb23',
    //     id:2
    // },
    // {
    //     description: 'Mar23',
    //     amount: 'Mar23',
    //     id:3
    // },
    // {
    //     description: 'Apr23',
    //     amount: 'Apr23',
    //     id:4
    // },
    // {
    //     description: 'May23',
    //     amount: 'May23',
    //     id:5
    // },
    // {
    //     description: 'Jun23',
    //     amount: 'Jun23',
    //     id:6
    // },
    // {
    //     description: 'Jul23',
    //     amount: 'Jul23',
    //     id:7
    // },
    // {
    //     description: 'Aug23',
    //     amount: 'Aug23',
    //     id:8
    // },
    // {
    //     description: 'Sep23',
    //     amount: 'Sep23',
    //     id:9
    // },
    // {
    //     description: 'Oct23',
    //     amount: 'Oct23',
    //     id:10
    // },
    // {
    //     description: 'Nov23',
    //     amount: 'Nov23',
    //     id:11
    // },
    // {
    //     description: 'Dec23',
    //     amount: 'Dec23',
    //     id:12
    // },
    // {
    //     description: 'Jan24',
    //     amount: 'Jan24',
    //     id:13
    // },
    // {
    //     description: 'Feb24',
    //     amount: 'Feb24',
    //     id:14
    // },
    // {
    //     description: 'Mar24',
    //     amount: 'Mar24',
    //     id:15
    // },
    // {
    //     description: 'Apr24',
    //     amount: 'Apr24',
    //     id:16
    // },
    // {
    //     description: 'May24',
    //     amount: 'May24',
    //     id:17
    // },
    // {
    //     description: 'Jun24',
    //     amount: 'Jun24',
    //     id:18
    // },
    // {
    //     description: 'Jul24',
    //     amount: 'Jul24',
    //     id:19
    // },
    // {
    //     description: 'Agu24',
    //     amount: 'Agu24',
    //     id:20
    // },
    // {
    //     description: 'Sep24',
    //     amount: 'Sep24',
    //     id:21
    // },
    // {
    //     description: 'Oct24',
    //     amount: 'Oct24',
    //     id:22
    // },
    // {
    //     description: 'Nov24',
    //     amount: 'Nov24',
    //     id:23
    // },
    // {
    //     description: 'Dec24',
    //     amount: 'Dec24',
    //     id:24
    // },
    // {
    //     description: 'Jan25',
    //     amount: 'Jan25',
    //     id:25
    // },
    // {
    //     description: 'Feb25',
    //     amount: 'Feb25',
    //     id:26
    // },
    // {
    //     description: 'Mar25',
    //     amount: 'Mar25',
    //     id:27
    // },
    // {
    //     description: 'Apr25',
    //     amount: 'Apr25',
    //     id:28
    // },
    // {
    //     description: 'May25',
    //     amount: 'May25',
    //     id:29
    // },
    // {
    //     description: 'Jun25',
    //     amount: 'Jun25',
    //     id:30
    // },
    // {
    //     description: 'Jul25',
    //     amount: 'Jul25',
    //     id:31
    // },
    // {
    //     description: 'Agu25',
    //     amount: 'Agu25',
    //     id:32
    // },
    // {
    //     description: 'Sep25',
    //     amount: 'Sep25',
    //     id:33
    // },
    // {
    //     description: 'Oct25',
    //     amount: 'Oct25',
    //     id:34
    // },
    // {
    //     description: 'Nov25',
    //     amount: 'Nov25',
    //     id:35
    // },
    // {
    //     description: 'Dec25',
    //     amount: 'Dec25',
    //     id:36
    // },
    // {
    //     description: 'Jan26',
    //     amount: 'Jan26',
    //     id:37
    // },
    // {
    //     description: 'Feb26',
    //     amount: 'Feb26',
    //     id:38
    // },
    // {
    //     description: 'Mar26',
    //     amount: 'Mar26',
    //     id:39
    // },
    // {
    //     description: 'Apr26',
    //     amount: 'Apr26',
    //     id:40
    // },
    // {
    //     description: 'May26',
    //     amount: 'May26',
    //     id:41
    // },
    // {
    //     description: 'Jun26',
    //     amount: 'Jun26',
    //     id:42
    // },
    // {
    //     description: 'Jul26',
    //     amount: 'Jul26',
    //     id:43
    // },
    // {
    //     description: 'Agu26',
    //     amount: 'Agu26',
    //     id:44
    // },
    // {
    //     description: 'Sep26',
    //     amount: 'Sep26',
    //     id:45
    // },
    // {
    //     description: 'Oct26',
    //     amount: 'Oct26',
    //     id:46
    // },
    // {
    //     description: 'Nov26',
    //     amount: 'Nov26',
    //     id:47
    // },
    // {
    //     description: 'Dec26',
    //     amount: 'Dec26',
    //     id:48
    // },
    // {
    //     description: 'Jan27',
    //     amount: 'Jan27',
    //     id:49
    // },
    // {
    //     description: 'Feb27',
    //     amount: 'Feb27',
    //     id:50
    // },
    // {
    //     description: 'Mar27',
    //     amount: 'Mar27',
    //     id:51
    // },
    // {
    //     description: 'Apr27',
    //     amount: 'Apr27',
    //     id:52
    // },
    // {
    //     description: 'May27',
    //     amount: 'May27',
    //     id:53
    // },
    // {
    //     description: 'Jun27',
    //     amount: 'Jun27',
    //     id:54
    // },
    // {
    //     description: 'Jul27',
    //     amount: 'Jul27',
    //     id:55
    // },
    // {
    //     description: 'Agu27',
    //     amount: 'Agu27',
    //     id:56
    // },
    // {
    //     description: 'Sep27',
    //     amount: 'Sep27',
    //     id:57
    // },
    // {
    //     description: 'Oct27',
    //     amount: 'Oct27',
    //     id:58
    // },
    // {
    //     description: 'Nov27',
    //     amount: 'Nov27',
    //     id:59
    // },
    // {
    //     description: 'Dec27',
    //     amount: 'Dec27',
    //     id:60
    // },
    
       
  ]

  const PeriodData: any = [
   
    {
        title: 'Jun2023',
    },
    {
        title: 'Jul2023',
    },
    {
        title: 'Agu2023',
    },
    {
        title: 'Sep2023',
    },
    {
        title: 'Oct2023',
    },
    {
        title: 'Nov2023',
    },
    {
        title: 'Dec2023',
    },
    {
        title: 'Jan2024',
    },
    {
        title: 'Feb2024',
    },
    {
        title: 'Mar2024',
    },
    {
        title: 'Apr2024',
    },
    {
        title: 'May2024',
    },
    {
        title: 'Jun2024',
    },
    {
        title: 'Jul2024',
    },
    {
        title: 'Agu2024',
    },
    {
        title: 'Sep2024',
    },
    {
        title: 'Oct2024',
    },
    {
        title: 'Nov2024',
    },
    {
        title: 'Dec2024',
    },
    {
        title: 'Jan2025',
    },
    {
        title: 'Feb2025',
    },
    {
        title: 'Mar2025',
    },
    {
        title: 'Apr2025',
    },
    {
        title: 'May2025',
    },
    {
        title: 'Jun2025',
    },
    {
        title: 'Jul2025',
    },
    {
        title: 'Agu2025',
    },
    {
        title: 'Sep2025',
    },
    {
        title: 'Oct2025',
    },
    {
        title: 'Nov2025',
    },
    {
        title: 'Dec2025',
    },
   
  ]

  const PeriodInterval: any = [
   
    {
        title: '6 Months',
        id: 5,
    },
    {
        title: '12 Months',
        id: 11,
    },
    {
        title: '18 Months',
        id: 17,
    },
    {
        title: '24 Months',
        id: 23,
    },
    {
        title: '30 Months',
        id: 29,
    },
    {
        title: '36 Months',
        id: 35,
    },
    {
        title: '42 Months',
        id: 41,
    },
    {
        title: '48 Months',
        id: 47,
    },
    {
        title: '54 Months',
        id: 53,
    },
    {
        title: '60 Months',
        id: 59,
    },
   
  ]

  const { data: Projects } = useQuery('projects', ()=> fetchDocument('Projects'), { cacheTime: 5000 })
  const { data: Clients } = useQuery('clients', ()=> fetchDocument('Clients'), { cacheTime: 5000 })
  const { data: FinanceOptions } = useQuery('financeOptions', ()=> fetchDocument('FinanceOptions'), { cacheTime: 5000 })

  
const getColumnsByPeriod = columns4.slice(parseInt(period)-1, parseInt(periodInterval) + parseInt(period))

const newObj = 
    {
        title: 'Description',
        dataIndex:"decs",
        align:"left",
        id:0
    }

const newItem = [newObj, ...getColumnsByPeriod]

console.log(newItem);

// getColumnsByPeriod.push(newObj)



// const numDescending = [...getColumnsByPeriod].sort((a, b) => a.id - b.id);

// console.log(numDescending);

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
        <div className='table-responsive'>
         
          <div className='d-flex justify-content-between'>
            <div className='d-flex'>
            
            <div style={{marginRight: "20px"}}>
                <label className="form-label">Period</label>
                    <select 
                        onChange={(e:any)=>setPeriod(e.target.value)}
                        className="form-select form-select-solid" aria-label="Select example">
                        {
                            periods.map((item:any)=>(
                                <option value={item.id}>{item.title}</option>
                            ))
                        }
                    </select>
            </div>
            <div style={{marginRight: "20px"}}>
                <label className="form-label">Range</label>
                    <select 
                        onChange={(e:any)=>setPeriodInterval(e.target.value)}
                        className="form-select form-select-solid" aria-label="Select example">
                        {
                            PeriodInterval.map((item:any)=>(
                                <option value={item.id}>{item.title}</option>
                            ))
                        }
                    </select>
            </div>
            <div style={{marginRight: "20px"}}>
                <label className="form-label">Project</label>
                    <select 
                        onChange={(e:any)=>setProject(e.target.value)}
                        className="form-select form-select-solid" aria-label="Select example">
                            <option value="all"> All</option>
                            <option value="client"> Client</option>
                            <option value="project"> Project</option>
                         
                    </select>
            </div>
            {/* render by selected item */}
            {
                project ==="project"?
                <>
                    <div style={{marginRight: "20px"}}>
                        <label className="form-label">Projects</label>
                            <select 
                                // onChange={(e:any)=>setProject(e.target.value)}
                                className="form-select form-select-solid" aria-label="Select example">
                                    {
                                    Projects?.data.map((item:any)=>(
                                        <option value={item.id}>{item.name}</option>
                                    ))}
                            </select>
                    </div>
                </>:""
            }
            {
                project ==="client"?
                <>
                    <div style={{marginRight: "20px"}}>
                        <label className="form-label">Clients</label>
                            <select 
                                className="form-select form-select-solid" aria-label="Select example">
                                    {
                                        Clients?.data.map((item:any)=>(
                                            <option value={item.id}>{item.name}</option>
                                        ))}
                            </select>
                    </div>
                </>:""
            }
            <div >
                <label className="form-label">Financce Option</label>
                    <select 
                        onChange={(e:any)=>setFinanceOption(e.target.value)}
                        className="form-select form-select-solid" aria-label="Select example">
                            <option value="all"> All</option>
                            <option value="client"> Client</option>
                            <option value="none"> None</option>
                    </select>
            </div>
            </div>
            {/* <img width={200} src={toAbsoluteUrl('/media/omnilogo.png')} alt="" /> */}
            <div>
            <Space style={{ marginBottom: 16 }}>
              <button type='button' className='btn btn-primary me-3' >
                {/* <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' /> */}
                Export
              </button>
            </Space>
            <Space style={{ marginBottom: 16 }}>
              <button type='button' className='btn btn-primary me-3' >
                {/* <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-2' /> */}
                Print
              </button>
            </Space>
            </div>
          </div>
          <br></br>
          <br></br>

          <h1>Invoices</h1>
          
          <Table 
            dataSource={dummyData}
            columns={
                newItem
            } 
          />
          
          <br></br>
          <br></br>
          <h1>Inflows</h1>
         
          <Table />
          <br></br>
          <br></br>
          <h1>Outflows</h1>
         
          <Table />

          <br></br>
          <br></br>
          <h1>Opening Balance</h1>
         
          <Table />
          <br></br>
          <br></br>
          <h1>Closing Balance</h1>
         
          <Table />
         
        </div>
      </KTCardBody>
    </div>
  )
}

export { CashFlow }

