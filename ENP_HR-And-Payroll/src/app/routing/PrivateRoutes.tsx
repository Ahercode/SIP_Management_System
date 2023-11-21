import { FC, Suspense, useEffect, useState } from 'react'
import { Route, Routes, Navigate} from 'react-router-dom'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
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
import EmployeeListReport from '../modules/production/components/report/EmployeeListReport'

import AppraisalPerformanceByAppraisalTypeReport from '../modules/production/components/report/AppraisalPerformanceByAppraisalTypeReport'
import { Organogram } from '../modules/production/components/setup/hr/Organogram'
import { OrgLevel } from '../modules/production/components/setup/hr/OrgLevel'
import { AppraisalDeliverables } from '../modules/production/components/setup/hr/ObjectiveDeliverables'
import { AppraisalObjectives } from '../modules/production/components/setup/hr/ParameterObjectives'
import { NotificationsBoard } from '../modules/production/components/lineManager/NotificationsBoard'
import { PerformanceBoard } from '../modules/production/components/transactions/hr/PerformanceBoard'
import { Processes } from '../modules/production/components/setup/hr/Processes'
import {EmployeeObjectivePage} from '../modules/production/Pages/employeeObjective/EmployeeObjectivePage'
import { useAuth } from '../modules/auth'
import { AppraisalGrade } from '../modules/production/components/setup/hr/AppraisalGrade'
import { ReferencesPage } from '../modules/production/components/admin/Reference'

export const accountBreadCrumbs: Array<PageLink> = [
  {
    title: '',
    path: '/cycle_details/cycle-details',
    isSeparator: false,
    isActive: false,
  },
]

const PrivateRoutes = () => {

  const { currentUser, tenant } = useAuth()
  const [test, setTest] = useState(false)


  useEffect(() => {
    if (currentUser?.isAdmin?.trim() === "no") {
      setTest(true)
    }else{
      setTest(false)
    }
  }, [currentUser?.isAdmin])
  
  return (
  
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
        path='admin/audit/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Audits</PageTitle>
          <Audit />
        </SuspensedView>} />
      <Route
        path='admin/references/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>References</PageTitle>
          <ReferencesPage />
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

      {/* <Route
        path='setupdepartment/:id'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Departments</PageTitle>
          <Department />
        </SuspensedView>} /> */}

      <Route
        path='appraisalGrade/:id'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Appraisal Grades</PageTitle>
          <AppraisalGrade />
        </SuspensedView>} />

      <Route
        path='setup/jobtitle/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Job Titles</PageTitle>
          <JobTitle />
        </SuspensedView>} />
      <Route
        path='setup/unitOfMeasure/*'
        element={<SuspensedView>
          <PageTitle>Units of measure</PageTitle>
          <UnitOfMeasure />
        </SuspensedView>} />

      <Route
        path='setup/paygroups/*'
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
        path='setup/appraisals/*'
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
        path='setup/organogram/*'
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
        path='setup/categories'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Categories</PageTitle>
          <Category />
        </SuspensedView>} />

      <Route
        path='setup/departments'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>Departments</PageTitle>
          <Department />
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
        path='EmployeeListReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>EmployeeListReport</PageTitle>
          <EmployeeListReport />
        </SuspensedView>} />


      <Route
        path='AppraisalPerformanceByAppraisalTypeReport/*'
        element={<SuspensedView>
          <PageTitle breadcrumbs={accountBreadCrumbs}>AppraisalPerformanceByAppraisalTypeReport</PageTitle>
          <AppraisalPerformanceByAppraisalTypeReport />
        </SuspensedView>} />

      <Route path='*' element={<Navigate to='/error/404' />} />
    </Route>
  </Routes>
) }
export const SuspensedView: FC<WithChildren> = ({ children }) => {
  // const baseColor = getCSSVariableValue('--kt-primary')

  
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
