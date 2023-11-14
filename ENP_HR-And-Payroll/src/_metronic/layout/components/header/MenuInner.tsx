import { useIntl } from 'react-intl'
import { useQuery } from 'react-query'
import { fetchEmployees } from '../../../../app/services/ApiCalls'
import { MenuItem } from './MenuItem'

const tenantId = localStorage.getItem('tenant')


export function MenuInner() {

  const { data: allEmployees } = useQuery('employees',()=> fetchEmployees(tenantId), { cacheTime: 5000 })
  
  const intl = useIntl()
  return (
    <>
      {/* <MenuItem title={intl.formatMessage({id: 'Human Resource'})} to='/dashboard' /> */}
      <MenuItem title={"DashBoard"} to='/hr-dashboard' />
      
    </>
  )
}
