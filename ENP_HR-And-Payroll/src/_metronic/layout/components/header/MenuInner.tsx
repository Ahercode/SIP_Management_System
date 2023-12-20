import { useIntl } from 'react-intl'
import { MenuItem } from './MenuItem'
import { useAuth } from '../../../../app/modules/auth'

const tenantId = localStorage.getItem('tenant')


export function MenuInner() {

 const{currentUser} = useAuth()
  
  const intl = useIntl()
  return (
    <>
      <MenuItem title={currentUser?.isAdmin?.trim() === "yes"?"DashBoard":"Notifications"} 
            to={currentUser?.isAdmin?.trim() === "yes"? '/hr-dashboard':'notifications-board/lineManger' }/>
    </>
  )
}
