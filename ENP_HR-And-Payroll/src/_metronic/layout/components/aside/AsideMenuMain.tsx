/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { AsideMenuItem } from './AsideMenuItem'
import { useAuth } from '../../../../app/modules/auth'
import { useQuery } from 'react-query'
import { fetchRoles, fetchUserApplications, fetchUserRoles } from '../../../../app/services/ApiCalls'

export function AsideMenuMain() {
  const intl = useIntl()
  const { currentUser } = useAuth()
  const { data: userApplications } = useQuery('userApplications', fetchUserApplications, { cacheTime: 5000 })

  const userApp = userApplications?.data.filter((item: any) => item.userId === parseInt(currentUser?.id)).map((filteredItem: any) => {
    return filteredItem?.applicationId?.toString()
  })



  const [isHR, setIsHR] = useState(false)
  const [isPayroll, setIsPayroll] = useState(false)
  const [isPayrollHR, setIsPayrollHR] = useState(true)

  const { data: allRoles } = useQuery('roles', fetchRoles, { cacheTime: 5000 })
  const { data: allUserRoles } = useQuery('user-roles', fetchUserRoles, { cacheTime: 5000 })

  // console.log("userId ",currentUser?.id)

  const currentUserRoles = allUserRoles?.data.filter((item: any) => item.userId === parseInt(currentUser?.id)).map((filteredItem: any) => {
    return filteredItem?.roleId?.toString()
  })


  return (
    <>
      <AsideMenuItemWithSub
        to='#'
        icon='/media/icons/duotune/communication/com013.svg'
        title='Employés' >
        <>

          <AsideMenuItem
            to='employee/'
            hasBullet={false}
            icon='/media/icons/duotune/general/gen005.svg'
            title='Details'
          />

          {/* Reports authorization*/}
          {
            currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
              || currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
              || currentUserRoles?.find((rolId: any) => rolId?.includes('3'))
              || currentUserRoles?.find((rolId: any) => rolId?.includes('4'))
              || currentUserRoles?.find((rolId: any) => rolId?.includes('5'))
              || currentUserRoles?.find((rolId: any) => rolId?.includes('6'))
              ? <AsideMenuItem
                to='employee-report-page/'
                hasBullet={false}
                icon='/media/icons/duotune/general/gen028.svg'
                title='Etats'
              />
              : ""
          }
          {/* Setups authorizations */}
          {
            currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
              || currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
              || currentUserRoles?.find((rolId: any) => rolId?.includes('3'))
              ? <AsideMenuItemWithSub to='#' title='Configurations' icon='/media/icons/duotune/technology/teh004.svg' hasBullet={false}>
                <AsideMenuItem to='setup/employee/paygroups' hasBullet={true} title='Groupes de paie' />
                <AsideMenuItem to='setup/employee/divisions' hasBullet={true} title='Divisions' />
                <AsideMenuItem to='setup/employee/category' hasBullet={true} title='Catégories' />
                <AsideMenuItem to='setup/employee/jobtitle' hasBullet={true} title='Titres' />
                <AsideMenuItem to='setup/employee/nationality' hasBullet={true} title='Nationalités' />
                <AsideMenuItem to='setup/employee/perks' hasBullet={true} title='Avantages' />
                <AsideMenuItem to='setup/employee/skills' hasBullet={true} title='Compétences' />
                <AsideMenuItem to='setup/employee/qualification' hasBullet={true} title='Qualifications' />
              </AsideMenuItemWithSub>
              : ""
          }
        </>
      </AsideMenuItemWithSub>

      {/* This is for only HR */}
      {
        isHR == true ?
          <AsideMenuItemWithSub
            to='#'
            title='Ressource Humaine'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen019.svg'
          >
            <AsideMenuItemWithSub to='#' title='Transactions' icon='/media/icons/duotune/ecommerce/ecm001.svg' hasBullet={false}>
              <AsideMenuItem to='transaction/hr/recruitment-selection' hasBullet={true} title='Recruitements et Selections' />
              <AsideMenuItem to='transaction/hr/compensation-benefit' hasBullet={true} title='Rémunérations et avantages' />
              <AsideMenuItem to='transaction/hr/training-development' hasBullet={true} title='Formations et Développements' />
              <AsideMenuItem to='transaction/hr/appraisal-performance' hasBullet={true} title='Évaluations et performances' />
              <AsideMenuItem to='transaction/hr/notes' hasBullet={true} title='Remarques' />
              <AsideMenuItem to='transaction/hr/leave-planning' hasBullet={true} title='Planification des congés' />
              <AsideMenuItem to='transaction/hr/medical-entries' hasBullet={true} title='Données médicales' />
            </AsideMenuItemWithSub>
            <AsideMenuItemWithSub to='#' title='Processes' icon='/media/icons/duotune/general/gen008.svg' hasBullet={false}>
              <AsideMenuItem to='#' hasBullet={true} title='Approbations' />
              <AsideMenuItem to='#' hasBullet={true} title='Promotions' />
            </AsideMenuItemWithSub>
            <AsideMenuItem
              to='hr-report-page/'
              hasBullet={false}
              icon='/media/icons/duotune/general/gen028.svg'
              title='Etats'
            />
            <AsideMenuItemWithSub to='#' title='Configurations' icon='/media/icons/duotune/technology/teh004.svg' hasBullet={false}>
              <AsideMenuItem to='setup/hr/recruitments' hasBullet={true} title='Recrutements' />
              <AsideMenuItem to='setup/hr/training' hasBullet={true} title='Formations' />
              <AsideMenuItem to='setup/hr/company-assets' hasBullet={true} title='Actifs' />
              <AsideMenuItem to='setup/hr/appraisals' hasBullet={true} title='Évaluations' />
              <AsideMenuItem to='setup/hr/leaves' hasBullet={true} title='Congés' />
              <AsideMenuItem to='setup/hr/notes' hasBullet={true} title='Catégories de notes' />
              <AsideMenuItem to='setup/hr/shifts' hasBullet={true} title='Changements' />
              <AsideMenuItemWithSub to='#' title='Médicales' hasBullet={true}>
                <AsideMenuItem to='setup/hr/medical' hasBullet={true} title='Types' />
                <AsideMenuItem to='setup/hr/service-provider' hasBullet={true} title='Fournisseurs de services' />
              </AsideMenuItemWithSub>
            </AsideMenuItemWithSub>
          </AsideMenuItemWithSub>
          : ""
      }

      {/* This is for only Payroll */}
      {
        isPayroll == true ?
          <AsideMenuItemWithSub
            to='#'
            title='Paye'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/general/gen022.svg'
          >
            <AsideMenuItemWithSub to='#' title='Transactions' icon='/media/icons/duotune/ecommerce/ecm001.svg' hasBullet={false}>
              <AsideMenuItem to='transaction/payroll/timesheet' hasBullet={true} title='Feuilles de temps' />
              <AsideMenuItem to='transaction/payroll/recurrent' hasBullet={true} title='Récurrents' />
              <AsideMenuItem to='transaction/payroll/non-recurrent' hasBullet={true} title='Non-récurrents' />
              <AsideMenuItem to='transaction/payroll/saving-schemes' hasBullet={true} title="Plans d'épargne" />
              <AsideMenuItem to='transaction/payroll/salary-upgrade' hasBullet={true} title='Augmentations de salaire' />
              <AsideMenuItem to='transaction/payroll/relief-rebate' hasBullet={true} title='Exonérations et remises' />
            </AsideMenuItemWithSub>
            <AsideMenuItemWithSub to='#' title='Processes' icon='/media/icons/duotune/general/gen008.svg' hasBullet={false}>
              <AsideMenuItem to='processes/payroll/approval' hasBullet={true} title='Approbations' />
              {/* <AsideMenuItem to='processes/payroll/check-tax' hasBullet={true} title='Check Taxes' /> */}
              <AsideMenuItem to='processes/payroll/journal' hasBullet={true} title='Journals' />
              {/* <AsideMenuItem to='processes/payroll/project-sheets-input' hasBullet={true} title='Project Sheets and Inputs' /> */}
              <AsideMenuItem to='processes/payroll/payrun' hasBullet={true} title='Payruns' />
            </AsideMenuItemWithSub>
            <AsideMenuItem
              to='payroll-report-page/'
              hasBullet={false}
              icon='/media/icons/duotune/general/gen028.svg'
              title='Etats'
            />
            <AsideMenuItemWithSub to='#' title='Configurations' icon='/media/icons/duotune/technology/teh004.svg' hasBullet={false}>
              <AsideMenuItemWithSub to='#' title='Avantages' hasBullet={true}>
                <AsideMenuItem to='setup/payroll/benefitcat' hasBullet={true} title='Catégories' />
                <AsideMenuItem to='setup/payroll/benefit' hasBullet={true} title='Détails' />
              </AsideMenuItemWithSub>
              <AsideMenuItemWithSub to='#' title='Deductions' hasBullet={true}>
                <AsideMenuItem to='setup/payroll/deductioncat' hasBullet={true} title='Catégories' />
                <AsideMenuItem to='setup/payroll/deduction' hasBullet={true} title='Détails' />
              </AsideMenuItemWithSub>
              <AsideMenuItem to='setup/payroll/saving-scheme' hasBullet={true} title="Plans d'épargne" />
              <AsideMenuItem to='setup/payroll/loan' hasBullet={true} title='Prêts' />
              <AsideMenuItem to='setup/payroll/approval-level' hasBullet={true} title="Niveaux d'approbation" />
              <AsideMenuItem to='setup/payroll/period' hasBullet={true} title='Périodes' />
              <AsideMenuItem to='setup/payroll/currency' hasBullet={true} title='Devises' />
              {/* <AsideMenuItem to='setup/payroll/overtime' hasBullet={true} title='Overtimes' /> */}

              <AsideMenuItemWithSub to='#' title='Statutories' hasBullet={true}>
                <AsideMenuItem to='setup/payroll/tax' hasBullet={true} title='Impôts' />
                <AsideMenuItem to='setup/payroll/tax-formular' hasBullet={true} title='Formule fiscale' />
                <AsideMenuItem to='setup/payroll/snnit' hasBullet={true} title='SSNIT' />
              </AsideMenuItemWithSub>
              {/* <AsideMenuItem to='setup/payroll/parameter' hasBullet={true} title='Parameters' /> */}
            </AsideMenuItemWithSub>

          </AsideMenuItemWithSub>
          : ""
      }

      {/* This is for HR and Payroll */}
      {
        isPayrollHR == true ?
          <>
            {/* HR Section */}
            <AsideMenuItemWithSub
              to='#'
              title='Ressource Humaine'
              fontIcon='bi-archive'
              icon='/media/icons/duotune/general/gen019.svg'
            >
              <>
                {/* Transactions authorization*/}
                {
                  currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('4'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('6'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('7'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('8'))
                    ? <AsideMenuItemWithSub to='#' title='Transactions' icon='/media/icons/duotune/ecommerce/ecm001.svg' hasBullet={false}>
                      <AsideMenuItem to='transaction/hr/recruitment-selection' hasBullet={true} title='Recruitements et Selections' />
                      <AsideMenuItem to='transaction/hr/compensation-benefit' hasBullet={true} title='Rémunérations et avantages' />
                      <AsideMenuItem to='transaction/hr/training-development' hasBullet={true} title='Formations et Développements' />
                      <AsideMenuItem to='transaction/hr/appraisal-performance' hasBullet={true} title='Évaluations et performances' />
                      <AsideMenuItem to='transaction/hr/notes' hasBullet={true} title='Remarques' />
                      <AsideMenuItem to='transaction/hr/leave-planning' hasBullet={true} title='Planification des congés' />
                      <AsideMenuItem to='transaction/hr/medical-entries' hasBullet={true} title='Données médicales' />
                    </AsideMenuItemWithSub>
                    : ""
                }

                {/* Processes authorization*/}
                {
                  currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('4'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('5'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('8'))
                    ? <AsideMenuItemWithSub to='#' title='Processes' icon='/media/icons/duotune/general/gen008.svg' hasBullet={false}>
                      <AsideMenuItem to='#' hasBullet={true} title='Approbations' />
                      <AsideMenuItem to='#' hasBullet={true} title='Promotions' />
                    </AsideMenuItemWithSub>
                    : ""
                }


                {/* Reports authorization*/}
                {
                  currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('3'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('4'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('5'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('6'))
                    ? <AsideMenuItem
                      to='hr-report-page/'
                      hasBullet={false}
                      icon='/media/icons/duotune/general/gen028.svg'
                      title='Etats'
                    />
                    : ""
                }

                {/* Setups authorizations */}
                {
                  currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('3'))
                    ? <AsideMenuItemWithSub to='#' title='Configurations' icon='/media/icons/duotune/technology/teh004.svg' hasBullet={false}>
                      <AsideMenuItem to='setup/hr/organogram' hasBullet={true} title='Organigramme' />
                      <AsideMenuItem to='setup/hr/recruitments' hasBullet={true} title='Recrutements' />
                      <AsideMenuItem to='setup/hr/training' hasBullet={true} title='Formations' />
                      <AsideMenuItem to='setup/hr/company-assets' hasBullet={true} title='Actifs' />
                      <AsideMenuItem to='setup/hr/appraisals' hasBullet={true} title='Évaluations' />
                      <AsideMenuItem to='setup/hr/leaves' hasBullet={true} title='Conges' />
                      <AsideMenuItem to='setup/hr/notes' hasBullet={true} title='Catégories de Remarques' />
                      <AsideMenuItem to='setup/hr/shifts' hasBullet={true} title='Shifts' />
                      <AsideMenuItemWithSub to='#' title='Donnees Medicales' hasBullet={true}>
                        <AsideMenuItem to='setup/hr/medical' hasBullet={true} title='Types' />
                        <AsideMenuItem to='setup/hr/service-provider' hasBullet={true} title='Fournisseurs de services' />
                      </AsideMenuItemWithSub>
                    </AsideMenuItemWithSub>
                    : ""
                }
              </>

            </AsideMenuItemWithSub>

            {/* Payroll Section */}
            <AsideMenuItemWithSub
              to='#'
              title='Paye'
              fontIcon='bi-archive'
              icon='/media/icons/duotune/general/gen022.svg'
            >
              <>

                {/* Transactions authorization*/}
                {
                  currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('4'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('6'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('7'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('8'))
                    ? <AsideMenuItemWithSub to='#' title='Transactions' icon='/media/icons/duotune/ecommerce/ecm001.svg' hasBullet={false}>
                      <AsideMenuItem to='transaction/payroll/timesheet' hasBullet={true} title='Feuilles de temps' />
                      <AsideMenuItem to='transaction/payroll/recurrent' hasBullet={true} title='Récurrents' />
                      <AsideMenuItem to='transaction/payroll/non-recurrent' hasBullet={true} title='Non-récurrents' />
                      <AsideMenuItem to='transaction/payroll/saving-schemes' hasBullet={true} title="Plans d'épargne" />
                      <AsideMenuItem to='transaction/payroll/salary-upgrade' hasBullet={true} title='Augmentations de salaire' />
                      <AsideMenuItem to='transaction/payroll/relief-rebate' hasBullet={true} title='Exonérations et remises' />
                      <AsideMenuItem to='transaction/payroll/loantran' hasBullet={true} title='Prêts' />
                    </AsideMenuItemWithSub>
                    : ""
                }

                {/* Processes authorization*/}
                {
                  currentUserRoles?.find((rolId: any) => rolId?.includes('5'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('6'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('7'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('28'))
                    ? <AsideMenuItemWithSub to='#' title='Processes' icon='/media/icons/duotune/general/gen008.svg' hasBullet={false}>
                      <AsideMenuItem to='processes/payroll/approval' hasBullet={true} title='Approvals' />
                      <AsideMenuItem to='processes/payroll/bonuses' hasBullet={true} title='Bonuses' />
                      <AsideMenuItem to='processes/payroll/backpay' hasBullet={true} title='Back Pays' />
                      <AsideMenuItem to='processes/payroll/journal' hasBullet={true} title='Journals' />
                      {/* <AsideMenuItem to='processes/payroll/project-sheets-input' hasBullet={true} title='Project Sheets and Inputs' /> */}
                      <AsideMenuItem to='processes/payroll/payrun' hasBullet={true} title='Payruns' />
                    </AsideMenuItemWithSub>
                    : ""
                }


                {/* Reports authorization*/}
                {
                  currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('3'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('4'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('5'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('6'))
                    ? <AsideMenuItem
                      to='payroll-report-page/'
                      hasBullet={false}
                      icon='/media/icons/duotune/general/gen028.svg'
                      title='Etats'
                    />
                    : ""
                }

                {/* Setups authorizations */}
                {
                  currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
                    || currentUserRoles?.find((rolId: any) => rolId?.includes('3'))
                    ? <AsideMenuItemWithSub to='#' title='Setups' icon='/media/icons/duotune/technology/teh004.svg' hasBullet={false}>
                      <AsideMenuItem to='setup/payroll/bank' hasBullet={true} title='Bank' />
                      {/* <AsideMenuItem to='setup/payroll/bankbranches' hasBullet={true} title='Bank Branches'/> */}
                      <AsideMenuItemWithSub to='#' title='Benefits' hasBullet={true}>
                        <AsideMenuItem to='setup/payroll/benefitcat' hasBullet={true} title='Categories' />
                        <AsideMenuItem to='setup/payroll/benefit' hasBullet={true} title='Details' />
                      </AsideMenuItemWithSub>
                      <AsideMenuItemWithSub to='#' title='Deductions' hasBullet={true}>
                        <AsideMenuItem to='setup/payroll/deductioncat' hasBullet={true} title='Categories' />
                        <AsideMenuItem to='setup/payroll/deduction' hasBullet={true} title='Details' />
                      </AsideMenuItemWithSub>
                      <AsideMenuItem to='setup/payroll/saving-scheme' hasBullet={true} title='Saving Schemes' />
                      <AsideMenuItem to='setup/payroll/approval-level' hasBullet={true} title='Approval Levels' />
                      <AsideMenuItem to='setup/payroll/period' hasBullet={true} title='Periods' />
                      <AsideMenuItem to='setup/payroll/currency' hasBullet={true} title='Currencies' />

                      <AsideMenuItemWithSub to='#' title='Statutories' hasBullet={true}>
                        <AsideMenuItem to='setup/payroll/tax' hasBullet={true} title='Taxes' />
                        <AsideMenuItem to='setup/payroll/tax-formular' hasBullet={true} title='Tax Formular' />
                        <AsideMenuItem to='setup/payroll/snnit' hasBullet={true} title='SSNIT' />
                      </AsideMenuItemWithSub>
                      <AsideMenuItem to='setup/payroll/loan' hasBullet={true} title='Loans' />
                      {/* <AsideMenuItem to='setup/payroll/parameter' hasBullet={true} title='Parameters' /> */}
                    </AsideMenuItemWithSub>
                    : ""
                }

              </>



            </AsideMenuItemWithSub>
          </>
          : ""
      }

      <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator  mx-1 my-4'></div>
        </div>
      </div>

      {/* Administration authorizations */}
      {
        currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
          ?
          <AsideMenuItemWithSub
            to='#'
            title='Administration'
            fontIcon='bi-archive'
            icon='/media/icons/duotune/coding/cod009.svg'
          >
            {/* <AsideMenuItemWithSub to='#' title='Administration' hasBullet={true}> */}
            <AsideMenuItem to='setup/administration/audit' hasBullet={true} title='Audits' />
            {/* <AsideMenuItem to='newCalender' hasBullet={true} title='Test Calendar' /> */}
            <AsideMenuItem to='setup/administration/company' hasBullet={true} title='Company Infos' />
            <AsideMenuItem to='setup/administration/configurations' hasBullet={true} title='Configurations' />
            <AsideMenuItem to='setup/administration/user-management' hasBullet={true} title='User Management' />
          </AsideMenuItemWithSub>
          : ""
      }
      {/* <AsideMenuItem to='setup/administration/appraisalForm' hasBullet={true} title='Form Page' /> */}
    </>
  )
}
