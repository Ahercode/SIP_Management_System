import { Divider } from "antd"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../../services/ApiCalls"
import { ReviewFormComponent } from "./ReviewFormComponent"
import { FormTemplate } from "./FormTemplateComponent"

const AppraisalForm: React.FC = () => {
    return (
        <div>
            <FormTemplate contentComponent={ReviewFormComponent}
                footerComponent={
                    <button type='button' className='btn btn-primary me-3 mt-7' onClick={() => { }}>
                        Done
                    </button>
                } />
        </div>
    )
}


export { AppraisalForm }