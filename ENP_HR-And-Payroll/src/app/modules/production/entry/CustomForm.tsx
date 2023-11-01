import { message } from "antd"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../services/ApiCalls"
import { check } from "prettier"

export const CustomForm = ({rowId, onFormSubmit, activeId}: any) => {


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
            return item?.deliverableId === recordId && item?.scheduleId === activeId
        })
        return actual?.actual
      }

      useEffect(() => {

      } , [activeId, allApraisalActual?.data])

    return (
        < >
            <div className="row">
                <div className="col-6">
                    <form 
                    >
                        <input
                        key={rowId}
                        defaultValue={getActual(rowId)}
                        type='number' min='0'
                        onChange={handleChange}
                        className="form-control form-control-solid" /> 
                    </form>
                </div>
            </div>
        </>
        
    )
}