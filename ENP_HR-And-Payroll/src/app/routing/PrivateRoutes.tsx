import { FC, Suspense } from 'react'
import { Route, Routes, Navigate} from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import { getCSSVariableValue } from '../../_metronic/assets/ts/_utils'
import { WithChildren } from '../../_metronic/helpers'
import { Audit } from '../modules/production/components/setup/administration/Audit'
import { PageLink, PageTitle } from '../../_metronic/layout/core'
import { Company } from '../modules/production/components/setup/administration/Company'
import { Configurations } from '../modules/production/components/setup/administration/Configurations'
import { UserManagement } from '../modules/production/components/setup/administration/UserManagement'
import { Department } from '../modules/production/components/setup/employee/Department'
import { JobTitle } from '../modules/production/components/setup/employee/JobTitle'
import { UnitOfMeasure } from '../modules/production/components/setup/employee/UnitOfMeasure'
import { Paygroups } from '../modules/production/components/setup/employee/Paygroups'
import { Appraisals } from '../modules/production/components/setup/hr/Appraisals'
import { ApprovalLevel } from '../modules/production/components/setup/payroll/ApprovalLevel'
import { Category } from '../modules/production/components/setup/payroll/Category'
import { Period } from '../modules/production/components/setup/payroll/Period'
import { Parameter } from '../modules/production/components/setup/hr/Parameter'
import { Employee } from '../modules/production/components/employee/Employee'
import { HRDashboardWrapper } from '../pages/dashboard/HumanResourceDashBoard'
import { MultiTabForm } from '../modules/production/components/employeeFormEntry/EmployeeFormEntry'
import { EmployeeEditForm } from '../modules/production/components/employeeFormEntry/EmployeeEditForm'
import { EmplyeeDetails } from '../modules/production/components/employeeFormEntry/EmployeeDetails'
import { EmployeeReportPage } from '../modules/production/components/report/EmployeeReportPage'
import { PayrollReportPage } from '../modules/production/components/report/PayrollReportPage'
import { HrReportPage } from '../modules/production/components/report/HrReportPage'
import EmployeeAgeRangeReport from '../modules/production/components/report/EmployeeAgeRangeReport'
import EmployeeListReport from '../modules/production/components/report/EmployeeListReport'
import EmployeeAgeSummaryReport from '../modules/production/components/report/EmployeeAgeSummaryReport'
import EmployeeFamilyReport from '../modules/production/components/report/EmployeeFamilyReport'
import EmployeeFamilySummaryReport from '../modules/production/components/report/EmployeeFamilySummaryReport'
import EmployeeDivisionReport from '../modules/production/components/report/EmployeeDivisionReport'
import EmployeeDivisionSummaryReport from '../modules/production/components/report/EmployeeDivisionSummaryReport'
import AppraisalPerformanceByAppraisalTypeReport from '../modules/production/components/report/AppraisalPerformanceByAppraisalTypeReport'
import AppraisalPerformanceByEmployeeReport from '../modules/production/components/report/AppraisalPerformanceByEmployeeReport'
import { Organogram } from '../modules/production/components/setup/hr/Organogram'
import { OrgLevel } from '../modules/production/components/setup/hr/OrgLevel'
import { AppraisalDeliverables } from '../modules/production/components/setup/hr/ObjectiveDeliverables'
import { AppraisalObjectives } from '../modules/production/components/setup/hr/ParameterObjectives'
import { NotificationsBoard } from '../modules/production/components/lineManager/NotificationsBoard'
import { PerformanceBoard } from '../modules/production/components/transactions/hr/PerformanceBoard'
import { Processes } from '../modules/production/components/setup/hr/Processes'
import {EmployeeObjectivePage} from '../modules/production/Pages/employeeObjective/EmployeeObjectivePage'
import { TestParameter } from '../modules/production/entry/TestParameter'
import { TestEmployeeObjective } from '../modules/production/entry/TestEmplyeeObjectives'
import { TestEmployeeDeliverable } from '../modules/production/entry/TestEmployeeDeliverable'

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: '',
    path: '/cycle_details/cycle-details',
    isSeparator: false,
    isActive: false,
  },
]

const PrivateRoutes = () => (
  <Routes>
    <Route element={<MasterLayout />}>
      {/* Redirect to Dashboard after success login/registartion */}
      <Route path='auth/*' element={<Navigate to='/hr-dashboard' />} />
      {/* Pages */}
      <Route path='hr-dashboard' element={<HRDashboardWrapper />} />


      {/* Employee  */}

      <Route
        path='employee/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Details</PageTitle>
          <Employee />
        </SuspensedView>} />

      <Route
        path='notifications-board/:id'
        element={<SuspensedView>
          <PageTitle >Notifications Board</PageTitle>
          <NotificationsBoard />
        </SuspensedView>} />

      <Route
        path='employee-form/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Entries</PageTitle>
          <MultiTabForm />
        </SuspensedView>} />

      <Route
        path='employee-objective/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Entries</PageTitle>
          <EmployeeObjectivePage />
        </SuspensedView>} />
      <Route
        path='new-employee-objectives/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Objectives</PageTitle>
          <TestEmployeeObjective />
        </SuspensedView>} />
      <Route
        path='new-employee-deliverables/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Deliverables</PageTitle>
          <TestEmployeeDeliverable />
        </SuspensedView>} />
      <Route
        path='demo-parameter/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Parameters</PageTitle>
          <TestParameter />
        </SuspensedView>} />

      <Route
        path='employee-edit-form/:id'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Entries</PageTitle>
          <EmployeeEditForm />
        </SuspensedView>} />
      <Route
        path='employee-details/:id'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Details</PageTitle>
          <EmplyeeDetails />
        </SuspensedView>} />
      {/* All Reports  */}

      <Route
        path='employee-report-page/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>All Employee Reports</PageTitle>
          <EmployeeReportPage />
        </SuspensedView>} />
      <Route
        path='hr-report-page/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>All Human Resource Reports</PageTitle>
          <HrReportPage />
        </SuspensedView>} />
      <Route
        path='payroll-report-page/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>All Payroll Reports</PageTitle>
          <PayrollReportPage />
        </SuspensedView>} />
      {/* Transaction > HR Routes  */}

      <Route
        path='transaction/hr/appraisal-performance/*'
        element={<SuspensedView>
          <PageTitle>Appraisal and Performance</PageTitle>
          <PerformanceBoard />
        </SuspensedView>} />

      {/* setup routes*/}


      {/* Setup > Administration Routes  */}

      <Route
        path='setup/administration/audit/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Audits</PageTitle>
          <Audit />
        </SuspensedView>} />
      <Route
        path='setup/administration/company/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Company</PageTitle>
          <Company />
        </SuspensedView>} />
      <Route
        path='setup/administration/configurations/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Configurations</PageTitle>
          <Configurations />
        </SuspensedView>} />
      <Route
        path='setup/administration/user-management/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>User Management</PageTitle>
          <UserManagement />
        </SuspensedView>} />

      {/* Employee Routes  */}


      <Route
        path='department/:id'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Departments</PageTitle>
          <Department />
        </SuspensedView>} />

      <Route
        path='setup/employee/jobtitle/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Job Titles</PageTitle>
          <JobTitle />
        </SuspensedView>} />
      <Route
        path='setup/employee/unitOfMeasure/*'
        element={<SuspensedView>
          <PageTitle>Units of measure</PageTitle>
          <UnitOfMeasure />
        </SuspensedView>} />

      <Route
        path='setup/employee/paygroups/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Groups</PageTitle>
          <Paygroups />
        </SuspensedView>} />
        
      <Route
        path='processes'
        element={<SuspensedView>
          <PageTitle >Processes</PageTitle>   
          <Processes/>     
        </SuspensedView>} />


      {/* HR Routes  */}
      <Route
        path='setup/hr/appraisals/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Appraisals</PageTitle>
          <Appraisals />
        </SuspensedView>} />

      <Route
        path='next/:id/:level'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Organogram</PageTitle>
          <OrgLevel />
        </SuspensedView>} />
      <Route
        path='setup/hr/organogram/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Organogram</PageTitle>
          <Organogram />
        </SuspensedView>} />


      {/* Payroll Routes  */}

      <Route
        path='setup/payroll/approval-level/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Approval Levels </PageTitle>
          <ApprovalLevel />
        </SuspensedView>} />

      <Route
        path='setup/employee/categories'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Categories</PageTitle>
          <Category />
        </SuspensedView>} />

      <Route
        path='setup/payroll/period/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Periods</PageTitle>
          <Period />
        </SuspensedView>} />
      <Route
        path='parameters/:id'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Parameters</PageTitle>
          <Parameter />
        </SuspensedView>} />
      <Route
        path='objectives/:id'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Objectives</PageTitle>
          <AppraisalObjectives />
        </SuspensedView>} />
      <Route
        path='deliverables/:id'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Deliverables</PageTitle>
          <AppraisalDeliverables />
        </SuspensedView>} />

      {/* All reports routes */}

      <Route
        path='EmployeeAgeRangeReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Age Range Report</PageTitle>
          <EmployeeAgeRangeReport />
        </SuspensedView>} />
      <Route
        path='EmployeeListReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>EmployeeListReport</PageTitle>
          <EmployeeListReport />
        </SuspensedView>} />
      <Route
        path='EmployeeAgeSummaryReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>EmployeeAgeSummaryReport</PageTitle>
          <EmployeeAgeSummaryReport />
        </SuspensedView>} />

      <Route
        path='EmployeeFamilyReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>EmployeeFamilyReport</PageTitle>
          <EmployeeFamilyReport />
        </SuspensedView>} />
      <Route
        path='EmployeeFamilySummaryReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Family Member Summary Report</PageTitle>
          <EmployeeFamilySummaryReport />
        </SuspensedView>} />
      <Route
        path='EmployeeDivisionReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Division Report</PageTitle>
          <EmployeeDivisionReport />
        </SuspensedView>} />
      <Route
        path='EmployeeDivisionSummaryReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Division Summary Report</PageTitle>
          <EmployeeDivisionSummaryReport />
        </SuspensedView>} />

      <Route
        path='AppraisalPerformanceByAppraisalTypeReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>AppraisalPerformanceByAppraisalTypeReport</PageTitle>
          <AppraisalPerformanceByAppraisalTypeReport />
        </SuspensedView>} />
      <Route
        path='AppraisalPerformanceByEmployeeReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>AppraisalPerformanceByEmployeeReport</PageTitle>
          <AppraisalPerformanceByEmployeeReport />
        </SuspensedView>} />


      <Route path='*' element={<Navigate to='/error/404' />} />
    </Route>
  </Routes>
)

const SuspensedView: FC<WithChildren> = ({ children }) => {
  const baseColor = getCSSVariableValue('--kt-primary')
  // TopBarProgress.config({
  //   barColors: {
  //     '0': baseColor,
  //   },
  //   barThickness: 1,
  //   shadowBlur: 5,
  // })
  return <Suspense >{children}</Suspense>
}

export { PrivateRoutes }
