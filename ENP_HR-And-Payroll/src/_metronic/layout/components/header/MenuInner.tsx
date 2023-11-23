import { useIntl } from 'react-intl'
import { useQuery } from 'react-query'
import { fetchEmployees } from '../../../../app/services/ApiCalls'
import { MenuItem } from './MenuItem'
import { useAuth } from '../../../../app/modules/auth'

const tenantId = localStorage.getItem('tenant')


export function MenuInner() {

 const{currentUser} = useAuth()
  
  const intl = useIntl()
  return (
    <>
      <MenuItem title={currentUser?.isAdmin?.trim() === "yes"?"OMNI PMS DashBoard":"Notifications"} 
            to={currentUser?.isAdmin?.trim() === "yes"? '/hr-dashboard':'notifications-board/lineManger' }/>
    </>
  )
}
