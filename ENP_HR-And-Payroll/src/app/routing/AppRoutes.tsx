/**
 * High level router.
 *
 * Note: It's recommended to compose related routes in internal router
 * components (e.g: `src/app/modules/Auth/pages/AuthPage`, `src/app/BasePage`).
 */

import { FC, useEffect, useState } from 'react'
// import { useQuery } from 'react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { App } from '../App'
import { AuthPage, Logout, useAuth } from '../modules/auth'
import { ErrorsPage } from '../modules/errors/ErrorsPage'
import { AppraisalForm } from '../modules/production/components/appraisalForms/AppraisalForm'
import { ObjectivesForm } from '../modules/production/components/appraisalForms/ObjectivesForm '
// import { fetchDocument } from '../services/ApiCalls'
import { PrivateRoutes, SuspensedView, accountBreadCrumbs } from './PrivateRoutes'
import { ParameterEntry } from '../modules/production/entry/ParameterEntry'
import { EmployeeObjectiveEntry } from '../modules/production/entry/EmplyeeObjectiveEntry'
import { EmployeeDeliverableEntry } from '../modules/production/entry/EmployeeDeliverableEntry'
import { PageTitle } from '../../_metronic/layout/core'
import { MasterLayout } from '../../_metronic/layout/MasterLayout'
import { ActualEntry } from '../modules/production/entry/ActualEntry'
import { ActualPage } from '../modules/production/entry/ActualPage'
import { ActualMasterPage } from '../modules/production/entry/ActualMasterPage'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { PUBLIC_URL } = process.env

const AppRoutes: FC = () => {
  const { currentUser, tenant } = useAuth()
  // const { data: userApplications } = useQuery('userApplications', () => fetchDocument(`userApplications`), { cacheTime: 5000 })
  // const userApp = userApplications?.data.filter((item: any) => item.userId === parseInt(currentUser?.id)).map((filteredItem: any) => {
  //   return filteredItem?.applicationId?.toString()
  // })


 
  // console.log(currentUser?.isAdmin)
  // useEffect(() => {
  //   if (currentUser?.isAdmin?.trim() === testValue) {
  //     setTest(true)
  //   }
  // }, [testValue])
  // const hasApp = userApp?.find((applicationId: any) => applicationId === '10')

  // const expiringDate: any = currentUser?.exp
  // const dateObj: any = new Date(expiringDate * 1000);

  return (
    <BrowserRouter basename={PUBLIC_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          <Route path='appraisalReviewForm/:employeeId' element={<AppraisalForm />} />
          <Route path='appraisalObjectivesForm/:employeeId'
            element={<ObjectivesForm />}
          />

          {currentUser && tenant ? (
            <>
              <Route path='/*' element={<PrivateRoutes />} />
              
              <Route index element={<Navigate to={currentUser?.isAdmin?.trim() === "yes"? '/hr-dashboard':'parameterEntry'} />} />

              <Route element={<MasterLayout />}>
                <Route
                  path='objectiveEntry/:parameterId'
                  element={<SuspensedView>
                    <PageTitle breadcrumbs={accountBreadCrumbs}>Employee Objectives</PageTitle>
                    <EmployeeObjectiveEntry />
                  </SuspensedView>} />
                <Route
                  path='deliverableEntry/:objectiveId'
                  element={<SuspensedView>
                    <PageTitle breadcrumbs={accountBreadCrumbs}>Deliverables Entries</PageTitle>
                    <EmployeeDeliverableEntry />
                  </SuspensedView>} />
                <Route
                  path='actualpage/'
                  element={<SuspensedView>
                    <PageTitle breadcrumbs={accountBreadCrumbs}>Actuals Page</PageTitle>
                    <ActualMasterPage/>
                  </SuspensedView>} />
                <Route
                  path='actualentry/:id'
                  element={<SuspensedView>
                    <PageTitle breadcrumbs={accountBreadCrumbs}>Actuals Entries</PageTitle>
                    <ActualEntry/>
                  </SuspensedView>} />
                <Route
                  path='parameterEntry/'
                  element={<SuspensedView>
                    <PageTitle breadcrumbs={accountBreadCrumbs}>Parameter Entries</PageTitle>
                    <ParameterEntry/>
                  </SuspensedView>} />
              </Route>
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export { AppRoutes }

