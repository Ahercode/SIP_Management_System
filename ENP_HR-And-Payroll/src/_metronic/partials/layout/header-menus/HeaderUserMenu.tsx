/* eslint-disable jsx-a11y/anchor-is-valid */
import {FC} from 'react'
import {useAuth} from '../../../../app/modules/auth'

const HeaderUserMenu: FC = () => {
  const {currentUser, logout} = useAuth()
  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      data-kt-menu='true'
    >
      <div className='menu-item px-3'>
        <div className='menu-content d-flex align-items-center px-3'>
          <div className='symbol symbol-50px me-5'>
            {/* <img alt='Logo' src={toAbsoluteUrl('/media/avatars/user.png')} /> */}
            {
            currentUser?.imageUrl === null || currentUser?.imageUrl ===""|| currentUser?.imageUrl ==="No file was selected"?
            <img style={{ borderRadius: "50%", width: "40px", height: "40px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`}></img>:
              <img style={{ borderRadius: "50%", width: "40px", height: "40px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${currentUser?.imageUrl}`}></img>
          }
           
          </div>
          <div className='d-flex flex-column'>
            <div className='fw-bolder d-flex align-items-center fs-5'>
              {currentUser?.firstName} {currentUser?.surname}
              {/*<span className='badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2'>Pro</span>*/}
            </div>
            <a style={{maxWidth:"160px", overflow:"auto"}} href='#' className='fw-bold text-muted text-hover-primary fs-7'>
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>
      <div className='separator my-2'></div>

      {/*<div className='menu-item px-5'>*/}
      {/*  <Link to={'/crafted/pages/profile'} className='menu-link px-5'>*/}
      {/*    My Profile*/}
      {/*  </Link>*/}
      {/*</div>*/}

      <div className='menu-item px-5'>
        <a onClick={logout} className='menu-link px-5'>
          Sign Out
        </a>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
