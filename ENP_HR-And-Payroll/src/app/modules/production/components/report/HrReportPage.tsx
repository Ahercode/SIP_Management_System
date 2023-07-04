import { Link } from 'react-router-dom'
import { ReportCard } from './ReportCardItem'


const  HrReportData = [

  {
    title: "Appraisal and Performance",
    reports: [
      { title: "Employee", link: "/AppraisalPerformanceByEmployeeReport" },
      { title: "Appraisal Type", link: "/AppraisalPerformanceByAppraisalTypeReport" },
    ]
  },
  
]

const HrReportPage = () => {

  const HrReportData1 = HrReportData.slice(0, 3)
  const HrReportData2 = HrReportData.slice(3, 6)
  const HrReportData3 = HrReportData.slice(6, 9)

  return (
    <div

    >
      <div className='row col-12 mb-10'>
        {
          HrReportData1.map((report, index) => {
            return (
              <div className='col-4' key={index}>
                <ReportCard data={report} />
              </div>
            )
          })
        }
      </div>

      <div className='row col-12 mb-10'>
        {
          HrReportData2.map((report, index) => {
            return (
              <div className='col-4' key={index}>
                <ReportCard data={report} />
              </div>
            )
          })
        }
      </div>

      <div className='row col-12 mb-10'>
        {
          HrReportData3.map((report, index) => {
            return (
              <div className='col-4' key={index}>
                <ReportCard data={report} />
              </div>
            )
          })
        }
      </div>     
      
    </div>
  )
}

export { HrReportPage }
