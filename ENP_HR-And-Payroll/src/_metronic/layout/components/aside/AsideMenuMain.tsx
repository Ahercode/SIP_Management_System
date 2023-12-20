/* eslint-disable react/jsx-no-target-blank */
import { useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { useQuery } from 'react-query'
import { useAuth } from '../../../../app/modules/auth'
import { AsideMenuItem } from './AsideMenuItem'
import { AsideMenuItemWithSub } from './AsideMenuItemWithSub'
import { fetchDocument } from '../../../../app/services/ApiCalls'

export function AsideMenuMain() {
  const intl = useIntl()
  const { currentUser } = useAuth()

  // const userApp = userApplications?.data.filter((item: any) => item.userId === parseInt(currentUser?.id)).map((filteredItem: any) => {
  //   return filteredItem?.applicationId?.toString()
  // })

  const [isPayrollHR, setIsPayrollHR] = useState(true)
  const { data: allUserRoles } = useQuery('user-roles', ()=> fetchDocument("userRoles"), { cacheTime: 5000 })

  const currentUserRoles = allUserRoles?.data.filter((item: any) => item.userId === parseInt(currentUser?.id)).map((filteredItem: any) => {
    return filteredItem?.roleId?.toString()
  })

  const [test, setTest] = useState(false)
  const testValue = "yes"

  useEffect(() => { 
    if(currentUser?.isAdmin?.trim() === testValue){
      setTest(true)
      
    }else{
      setTest(false)
    }
  } , [testValue])


  return (
    <>
      <>
        

        {/* Reports authorization*/}
        {
          currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
            || currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
            || currentUserRoles?.find((rolId: any) => rolId?.includes('3'))
            || currentUserRoles?.find((rolId: any) => rolId?.includes('4'))
            || currentUserRoles?.find((rolId: any) => rolId?.includes('5'))
            || currentUserRoles?.find((rolId: any) => rolId?.includes('6'))
            ?
            <>
            
            <AsideMenuItem
                to='employee/'
                hasBullet={false}
                icon='/media/icons/duotune/communication/com013.svg'
                title='Employee Details'
              />
              <AsideMenuItem to='transaction/hr/appraisal-performance' hasBullet={false}
                icon='/media/icons/duotune/general/gen032.svg' title='Performance' />

              <AsideMenuItem to='processes' hasBullet={false}
                icon='/media/icons/duotune/general/gen022.svg' title='Processes' />

              <AsideMenuItem
                to={`notifications-board/lineManger`}
                hasBullet={false}
                icon='/media/icons/duotune/general/gen007.svg'
                title='Notifications Board'
              />
              <AsideMenuItem
                to='employee-report-page/'
                hasBullet={false}
                icon='/media/icons/duotune/general/gen028.svg'
                title='Reports'
            />
            </>
            : ""
        }

        {/* Setups authorizations */}
        {/* {
          currentUserRoles?.find((rolId: any) => rolId?.includes('1'))
            || currentUserRoles?.find((rolId: any) => rolId?.includes('2'))
            || currentUserRoles?.find((rolId: any) => rolId?.includes('3'))
            ? <AsideMenuItemWithSub to='#' title='Setups' icon='/media/icons/duotune/general/gen019.svg' hasBullet={false}>
              <AsideMenuItem to='setup/hr/appraisals' hasBullet={true} title='Appraisals' />
              <AsideMenuItem to='setup/employee/paygroups' hasBullet={true} title='Employee Groups' />
              <AsideMenuItem to='setup/employee/departments' hasBullet={true} title='Departments' />
              <AsideMenuItem to='setup/employee/categories' hasBullet={true} title='Categories' />
              <AsideMenuItem to='setup/employee/jobtitle' hasBullet={true} title='Job Titles' />
              <AsideMenuItem to='setup/hr/organogram' hasBullet={true} title='Organogram' />
              <AsideMenuItem to='setup/payroll/period' hasBullet={true} title='Periods' />
              <AsideMenuItem to='setup/employee/unitOfMeasure' hasBullet={true} title='Units of Measure' />
            </AsideMenuItemWithSub>
            : ""
        } */}
      </>


      {/* This is for HR and Payroll */}
      {
        isPayrollHR == true ?
          <>
          {
            currentUserRoles?.find((rolId: any) => rolId?.includes('7'))?
            <AsideMenuItem to='parameterEntry' icon='/media/icons/duotune/general/gen032.svg' hasBullet={false} title='Details' />:""
          }
          </>
          : ""
      }

      {
        test? 
        <>
            <AsideMenuItem
                to='employee/'
                hasBullet={false}
                icon='/media/icons/duotune/communication/com013.svg'
                title='Employee Details'
              />
              <AsideMenuItem to='transaction/hr/appraisal-performance' hasBullet={false}
                icon='/media/icons/duotune/general/gen032.svg' title='Performance' />
              {/* <AsideMenuItem to='processes' hasBullet={false}
                icon='/media/icons/duotune/general/gen022.svg' title='Processes' /> */}

          <AsideMenuItem
            to={`notifications-board/lineManger`}
            hasBullet={false}
            icon='/media/icons/duotune/general/gen007.svg'
            title='Notifications Board'
          />
          <AsideMenuItem to={`parameterEntry`} icon='/media/icons/duotune/general/gen032.svg' hasBullet={false} title='Details' />
              {/* <AsideMenuItem
                to={`notifications-board/lineManger`}
                hasBullet={false}
                icon='/media/icons/duotune/general/gen007.svg'
                title='Notifications Board'
              /> */}
              <AsideMenuItem
                to='employee-report-page/'
                hasBullet={false}
                icon='/media/icons/duotune/general/gen028.svg'
                title='Reports'
            />
            <AsideMenuItemWithSub to='#' title='Setups' icon='/media/icons/duotune/general/gen019.svg' hasBullet={false}>
              <AsideMenuItem to='setup/appraisals' hasBullet={true} title='Appraisals' />
              <AsideMenuItem to='setup/paygroups' hasBullet={true} title='Employee Groups' />
              <AsideMenuItem to='setup/departments' hasBullet={true} title='Departments' />
              <AsideMenuItem to='setup/categories' hasBullet={true} title='Categories' />
              <AsideMenuItem to='setup/jobtitle' hasBullet={true} title='Job Titles' />
              {/* <AsideMenuItem to='setup/organogram' hasBullet={true} title='Organogram' /> */}
              <AsideMenuItem to='setup/payroll/period' hasBullet={true} title='Periods' />
              <AsideMenuItem to='setup/unitOfMeasure' hasBullet={true} title='Units of Measure' />
            </AsideMenuItemWithSub>

            <div className='menu-item'>
              <div className='menu-content'>
                <div className='separator  mx-1 my-4'></div>
              </div>
            </div>
            <AsideMenuItemWithSub to='#' title='Admin' icon='/media/icons/duotune/art/art002.svg' hasBullet={false}>
              <AsideMenuItem to='admin/references' hasBullet={true} title='References' />
            </AsideMenuItemWithSub>
        </>
        :
        <>
          <AsideMenuItem
            to={`notifications-board/lineManger`}
            hasBullet={false}
            icon='/media/icons/duotune/general/gen007.svg'
            title='Notifications Board'
          />
          <AsideMenuItem to={`parameterEntry`} icon='/media/icons/duotune/general/gen032.svg' hasBullet={false} title='Details' />
        </>
      }
      {/* <AsideMenuItem to='setup/administration/audit' hasBullet={true} title='Audits' /> */}
      {/* <div className='menu-item'>
        <div className='menu-content'>
          <div className='separator  mx-1 my-4'></div>
        </div>
      </div> */}

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
            <AsideMenuItem to='setup/administration/audit' hasBullet={true} title='Audits' />
            <AsideMenuItem to='setup/administration/company' hasBullet={true} title='Company Infos' />
            <AsideMenuItem to='setup/administration/configurations' hasBullet={true} title='Configurations' />
            <AsideMenuItem to='setup/administration/user-management' hasBullet={true} title='User Management' />
          </AsideMenuItemWithSub>
          : ""
      }
    </>
  )
}
