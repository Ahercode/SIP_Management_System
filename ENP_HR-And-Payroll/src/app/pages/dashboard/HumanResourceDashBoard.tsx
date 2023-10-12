
import react, {FC} from 'react'
import {PageTitle} from '../../../_metronic/layout/core'
// import { HRChart } from './charts/HRChart'
// import { TestChart } from './charts/TestChart'
import { useQuery } from 'react-query'
import {  fetchDashBoardData } from '../../services/ApiCalls'
import { Table } from 'antd'
import { HRNewDashBoard } from './charts/HRNewDashBoard'

const columns: any = [
  {
    title: 'Groupe de paie',
    dataIndex: 'paygroupName',
    sorter: (a: any, b: any) => {
      if (a.paygroupName > b.paygroupName) {
        return 1
      }
      if (b.paygroupName > a.paygroupName) {
        return -1
      }
      return 0
    },
  },
  {
    title: 'Division',
    dataIndex: 'divisionName',
    sorter: (a: any, b: any) => {
      if (a.divisionName > b.divisionName) {
        return 1
      }
      if (b.divisionName > a.divisionName) {
        return -1
      }
      return 0
    },
  },
  {
    title: 'Departement',
    dataIndex: 'departmentName',
    sorter: (a: any, b: any) => {
      if (a.departmentName > b.departmentName) {
        return 1
      }
      if (b.departmentName > a.departmentName) {
        return -1
      }
      return 0
    },
  },
  {
    title: 'Unité',
    dataIndex: 'unitName',
    sorter: (a: any, b: any) => {
      if (a.unitName > b.unitName) {
        return 1
      }
      if (b.unitName > a.unitName) {
        return -1
      }
      return 0
    },
  },
  {
    title: "Nombre d'employés",
    dataIndex: 'employeeCount',
    sorter: (a: any, b: any) => {
      if (a.employeeCount > b.employeeCount) {
        return 1
      }
      if (b.employeeCount > a.employeeCount) {
        return -1
      }
      return 0
    },
  },
  {
    title: "Nombre d'hommes",
    dataIndex: 'countMale',
    sorter: (a: any, b: any) => {
      if (a.countMale > b.countMale) {
        return 1
      }
      if (b.countMale > a.countMale) {
        return -1
      }
      return 0
    },
  },
  {
    title: "Nombres de femmes",
    dataIndex: 'countFemale',
    sorter: (a: any, b: any) => {
      if (a.countFemale > b.countFemale) {
        return 1
      }
      if (b.countFemale > a.countFemale) {
        return -1
      }
      return 0
    },
  },
]

const HRDashboardPage = () => {
  const tenantId = localStorage.getItem('tenant')
  const { data: dashboardData } = useQuery('dashboarddata',()=> fetchDashBoardData(tenantId), { cacheTime: 5000 })
  
  

  return(
    <div
      
    >
    {/* begin::Row */}
    <div className='row gy-5 g-xl-8 mb-7'>
      
      {/* <div className='col-xxl-6'>
      <HRChart className='mb-xl-8'
          chartColor='primary'
          chartHeight='350px'/>
      </div> */}
      {/* <div className='col-xxl-6'>
      <TestChart className='mb-xl-8'
          chartColor='primary'
          chartHeight='350px'/>
      </div> */}

      <div className='col-12 row mt-7'
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '5px',
          margin:"5px",
          boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
        }} 
      >
          
        <Table columns={columns} dataSource={dashboardData?.data} />
      </div>
    </div>

  </div>
  )
}


export {HRDashboardPage}

const HRDashboardWrapper = () => {
  // const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{"Tableau de bord"}</PageTitle>
      <HRNewDashBoard/>
    </>
  )
}

export {HRDashboardWrapper}