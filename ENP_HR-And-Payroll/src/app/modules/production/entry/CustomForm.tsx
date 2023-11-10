import { useEffect } from "react"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../services/ApiCalls"

export const CustomForm = ({title, rowId, onFormSubmit, activeId}: any) => {


    const { data: allApraisalActual } = useQuery('apraisalActuals', () => fetchDocument('ApraisalActuals'), { cacheTime: 10000 })

    
      const handleChange = (event:any) => {
        event.preventDefault();
        const value = event.target.value;
        // Pass the recordId and value back to the parent component
        onFormSubmit(rowId, value); 
      }
      
      const getActual = (recordId:any) => {
        // return actualValues[recordId] || "";

        const actual = allApraisalActual?.data?.find((item: any) => {
            return item?.deliverableId === recordId
        })
        return actual?.actual
      }

      useEffect(() => {

      } , [activeId, allApraisalActual?.data])

    return (
        < >
            <div className="row">
                <div >
                    <form 
                    >
                        <input
                            key={rowId}
                            disabled={title==="final"||title==="hr"?true:false}
                            value={getActual(rowId)}
                            type='number' min='0'
                            onChange={handleChange}
                            className="form-control " 
                        />
                    </form>
                </div>
            </div>
        </>
        
    )
}