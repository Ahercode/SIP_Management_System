/* eslint-disable react-hooks/exhaustive-deps */
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { KTSVG } from '../../../helpers'
import { useLayout } from '../../core'
import { Header } from './Header'
import { Topbar } from './Topbar'
import { DefaultTitle } from './page-title/DefaultTitle'

export function HeaderWrapper() {
  const {config, classes, attributes} = useLayout()
  const {header, aside} = config

  return (
    <div
      id='kt_header'
      className={clsx('header', classes.header.join(' '), 'align-items-stretch')}
      {...attributes.headerMenu}
    >
      <div
        className={clsx(
          classes.headerContainer.join(' '),
          'd-flex align-items-stretch justify-content-between'
        )}
      >
        {/* begin::Aside mobile toggle */}
        {aside.display && (
          <div className='d-flex align-items-center d-lg-none ms-n3 me-1' title='Show aside menu'>
            <div
              className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
              id='kt_aside_mobile_toggle'
            >
              <KTSVG path='/media/icons/duotune/abstract/abs015.svg' className='svg-icon-2x mt-1' />
            </div>
          </div>
        )}
        {/* end::Aside mobile toggle */}
        {/* begin::Logo */}
        {!aside.display && (
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
            <Link to='/dashboard' className='d-lg-none'>
              <h3 style={{color:"#009EF7"}}>SIP Consult</h3>
              {/* <h3 style={{color:"#009EF7"}}>OMNI PMS</h3> */}
              {/* <img alt='Logo' src={toAbsoluteUrl('/media/logos/default-small.svg')} className='h-30px' /> */}
              {/* <img alt='Logo' src={toAbsoluteUrl('/media/logos/default-small.svg')} className='h-30px' /> */}
              {/* <h3 style={{color: "#009EF7"}}>HR - PAYROLL</h3> */}
            </Link>
          </div>
        )}
        {/* end::Logo */}

        {aside.display && (
          <div className='d-flex align-items-center flex-grow-1 flex-lg-grow-0'>
            <Link to='/' className='d-lg-none'>

            {/* <h3 style={{color:"#009EF7"}}>OMNI PMS</h3> */}
            <h3 style={{color:"#009EF7"}}>SIP Consult</h3>
              {/* <img alt='Logo' src={toAbsoluteUrl('/media/logos/default-small.svg')} className='h-30px' /> */}

              {/* <img alt='Logo' src={toAbsoluteUrl('/media/logos/default-small.svg')} className='h-30px' /> */}
              {/* <h3 style={{color: "#009EF7"}}>HR - PAYROLL</h3>  */}


            </Link>
          </div>
        )}

        {/* begin::Wrapper */}
        <div className='d-flex align-items-stretch justify-content-between flex-lg-grow-1'>
          {/* begin::Navbar */}
          {header.left === 'menu' && (
            <div className='d-flex align-items-stretch' id='kt_header_nav'>
              <Header />
            </div>
          )}

          {header.left === 'page-title' && (
            <div className='d-flex align-items-center' id='kt_header_nav'>
              <DefaultTitle />
            </div>
          )}

          <div className='d-flex align-items-stretch flex-shrink-0'>
            <Topbar />
          </div>
        </div>
        {/* end::Wrapper */}
      </div>
    </div>
  )
}
