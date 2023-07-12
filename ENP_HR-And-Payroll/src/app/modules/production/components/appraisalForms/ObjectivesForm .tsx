import { AppraisalObjectivesComponent } from "./AppraisalObjectivesComponent"
import { FormTemplate } from "./FormTemplateComponent"

interface ObjectivesWrapperProps {
    onObjectiveApproved?: any;
    onObjectiveRejected?: any;
}

const ObjectivesForm: React.FC<ObjectivesWrapperProps> = ({ onObjectiveApproved, onObjectiveRejected }) => {
    return (
        <div>
            <FormTemplate
                component={AppraisalObjectivesComponent}
                onObjectiveApproved={onObjectiveApproved}
                onObjectiveRejected={onObjectiveRejected}
            />
        </div>
    )
}

export { ObjectivesForm }


