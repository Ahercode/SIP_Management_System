import { Space } from "antd"
import CommonComp from "./CommonComp"
import { fetchDocument } from "../../../../../services/ApiCalls"
import { useQuery } from "react-query"

const EmployeeSkill = () => {

  const tenantId = localStorage.getItem('tenant')
  const { data: allSkills } = useQuery('skill', () => fetchDocument(`Skills/tenant/${tenantId}`), { cacheTime: 5000 })
  
    return (
        <CommonComp title="Skill" data={allSkills?.data}/>
    )   
}

export default EmployeeSkill