import { Tabs, TabsProps } from 'antd'
import { ReportCard } from './ReportCardItem'
import { EmployeeDetailReport } from '../../../../pages/dashboard/charts/HRNewDashBoard'

const EmployeeReportPage = () => {

  const tabItems: TabsProps['items'] = [
    {
        key: '1',
        label: <>
            <span>Details</span>
        </>,
        children: (
            <>
               <EmployeeDetailReport/>
            </>
        ),
    },
    {
        key: '2',
        label: <>
            <span>Summary</span>
        </>,
        children: (
            <>
                <EmployeeDetailReport/>
            </>
        ),
    },
]

  return (
       <div 
            style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
            }}
        >

          <Tabs defaultActiveKey="1"
                type="line"
                items={tabItems}

            />
      </div>
  )
}

export { EmployeeReportPage }
