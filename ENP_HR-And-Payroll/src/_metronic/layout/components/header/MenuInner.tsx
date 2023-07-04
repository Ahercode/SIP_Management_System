import React from 'react'
import {MenuItem} from './MenuItem'
import {useIntl} from 'react-intl'
import { fetchEmployees } from '../../../../app/services/ApiCalls'
import { useQuery } from 'react-query'

const tenantId = localStorage.getItem('tenant')


export function MenuInner() {

  const { data: allEmployees } = useQuery('employees',()=> fetchEmployees(tenantId), { cacheTime: 5000 })
  
  const intl = useIntl()
  return (
    <>
      {/* <MenuItem title={intl.formatMessage({id: 'Human Resource'})} to='/dashboard' /> */}
      <MenuItem title={"Human Resource"} to='/hr-dashboard' />
      
    </>
  )
}
