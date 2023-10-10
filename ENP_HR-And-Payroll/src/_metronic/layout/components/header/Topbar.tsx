import clsx from 'clsx'
import { FC } from 'react'
import { useAuth } from '../../../../app/modules/auth'
import { KTSVG, toAbsoluteUrl } from '../../../helpers'
import {
  HeaderUserMenu,
} from '../../../partials'
import { useLayout } from '../../core'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';

const Topbar: FC = () => {
  const {config} = useLayout()
  const {currentUser} = useAuth()
  const tenantId = localStorage.getItem('tenant')
  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>
      <div style={{paddingRight: "30px"}} className='d-flex align-items-center fs-5'>
          {/* Company:  */}
          <img style={{width: "120px"}} src={toAbsoluteUrl('/media/logos/OmniGroupLogo.png')} alt='Omni Group Logo' /> 
          {/* <strong style={{borderRight:"1px solid grey", paddingLeft: "8px",paddingRight:"25px"}}>{ tenantId?.toLocaleUpperCase()}</strong> */}
      </div>
      
      <div
        className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
        id='kt_header_user_menu_toggle'
        
      >
        {/* begin::Toggle */}
        <div
          className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          {
            currentUser?.imageUrl === null || currentUser?.imageUrl ===""?
            <img style={{ borderRadius: "50%", width: "40px", height: "40px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/ahercode1.jpg`}></img>:
              <img style={{ borderRadius: "50%", width: "40px", height: "40px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${currentUser?.imageUrl}`}></img>
          }
              {/* <img style={{ borderRadius: "50%", width: "40px", height: "40px" }} src={`https://app.sipconsult.net/omniAppraisalApi/uploads/employee/${currentUser?.imageUrl}`}></img> */}
            
          {/* <img src={toAbsoluteUrl('/media/avatars/user.png')} alt='ENP user Profile' /> */}
          <p>{currentUser?.phone}</p>
        </div>
        <HeaderUserMenu />
        {/* end::Toggle */}
      </div>
      <div style={{paddingLeft: "20px"}} className='d-flex align-items-center fs-5'>
            {currentUser?.username}
      </div>
      {/* end::User */}

      {/* begin::Aside Toggler */}
      {config.header.left === 'menu' && (
        <div className='d-flex align-items-center d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
            id='kt_header_menu_mobile_toggle'
          >
            <KTSVG path='/media/icons/duotune/text/txt001.svg' className='svg-icon-1' />
          </div>
        </div>
      )}
    </div>
  )
}

export { Topbar }
