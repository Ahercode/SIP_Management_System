import { FormTemplate } from "./FormTemplateComponent"
import { ReviewFormComponent } from "./ReviewFormComponent"

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
