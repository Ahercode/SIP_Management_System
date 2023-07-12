import { Button } from "antd";
import { AppraisalObjectivesComponent } from "./AppraisalObjectivesComponent"
import { FormTemplate } from "./FormTemplateComponent"


const ObjectivesForm = () => {

    return (
        <div>
            <FormTemplate
                contentComponent={AppraisalObjectivesComponent}
                footerComponent={
                    <button type='button' className='btn btn-primary me-3 mt-7' onClick={() => { }}>
                    Done
                </button>
                }
            />
        </div>
    )
}

export { ObjectivesForm }


