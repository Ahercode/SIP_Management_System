import { Space } from "antd"
import CommonComp from "./CommonComp"
import { fetchDocument } from "../../../../../services/ApiCalls"
import { useQuery } from "react-query"

const EmployeeQualification = () => {

  const tenantId = localStorage.getItem('tenant')

  const { data: allQualifications } = useQuery('qualifications', () => fetchDocument(`Qualifications/tenant/${tenantId}`), { cacheTime: 5000 })
  
    return (
      <CommonComp title="Qualification" data={allQualifications?.data} />
    )   
}

export default EmployeeQualification