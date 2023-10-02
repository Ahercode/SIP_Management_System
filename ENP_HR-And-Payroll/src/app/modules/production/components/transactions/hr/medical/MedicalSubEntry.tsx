import { useQuery } from "react-query"
import { fetchDocument } from "../../../../../../services/ApiCalls"

const MedicalSubEntry = (props: any) => {

    const tenantId = localStorage.getItem('tenant')

    const { data: allEmployee } = useQuery('employee', () => fetchDocument(`${tenantId}`), { cacheTime: 5000 })


    return (
        <h2>Medical Sub entries here</h2>
    )

}


export { MedicalSubEntry }