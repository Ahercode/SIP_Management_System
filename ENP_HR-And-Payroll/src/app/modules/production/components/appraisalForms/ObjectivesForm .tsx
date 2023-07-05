import { AppraisalObjectivesComponent } from "./AppraisalObjectivesComponent"
import { FormTemplate } from "./FormTemplateComponent"

const ObjectivesForm: React.FC  = () => {
    return (
        <div>
            <FormTemplate component={AppraisalObjectivesComponent} />
        </div>
    )
}

export { ObjectivesForm }


