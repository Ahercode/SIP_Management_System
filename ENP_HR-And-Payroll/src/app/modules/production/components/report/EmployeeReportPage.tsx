import { ReportCard } from './ReportCardItem'

const EmployeeReportPage = () => {

  const EmployeeReportData = [
    {
      title: "List",
      reports: [
        { title: "Paygroup", link: "/EmployeeListReport" },
        { title: "Division", link: "/EmployeeDivisionReport" },
        { title: "Summary", link: "/EmployeeDivisionSummaryReport" },
      ]
    },
    {
      title: "Age Profile",
      reports: [
        { title: "Detail", link: "/EmployeeAgeRangeReport" },
        { title: "Summary", link: "/EmployeeAgeSummaryReport" },
      ]
    },
    {
      title: "Family Profile",
      reports: [
        { title: "Employee", link: "/EmployeeFamilyReport" },
        { title: "Summary", link: "/EmployeeFamilySummaryReport" },
      ]
    },
    {
      title: "Appraisal and Performance",
      reports: [
        { title: "Employee", link: "/AppraisalPerformanceByEmployeeReport" },
        { title: "Appraisal Type", link: "/AppraisalPerformanceByAppraisalTypeReport" },
      ]
    },
  ]

  return (
    <div>
      <div className='row col-12 mb-10'>
        {
          EmployeeReportData.map((report, index) => {
            return (
              <div className='col-4 mt-7' key={index}>
                <ReportCard data={report} />
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export { EmployeeReportPage }
