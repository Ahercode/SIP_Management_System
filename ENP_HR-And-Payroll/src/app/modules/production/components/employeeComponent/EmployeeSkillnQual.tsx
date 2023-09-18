import { Space } from "antd"
import { useState } from "react";
import "./formStyle.css"
import EmployeeExperience from "./skillQualExp/EmployeeExperience";

const EmployeeSkillnQualification = (props:any) => {

    const [skillTab, setSkillTab] = useState('skill');

    const handleSkillTabClick = (skillTab: any) => {
        setSkillTab(skillTab);
      }

    return (
        <>
        <div className="tab2s">

            <button
                className={`tab2 ${skillTab === 'skill' ? 'active' : ''}`}
                onClick={() => handleSkillTabClick('skill')}
            >
                Skills
            </button>
            <button
                className={`tab2 ${skillTab === 'qual' ? 'active' : ''}`}
                onClick={() => handleSkillTabClick('qual')}
            >
                Qualifications
            </button>
            <button
                className={`tab2 ${skillTab === 'exper' ? 'active' : ''}`}
                onClick={() => handleSkillTabClick('exper')}
            >
                Experiences
            </button>
        </div>
        <div className="skillTab-content">
            {skillTab === 'skill' && 
                <h3>Skills</h3>
            }
    
            {skillTab === 'qual' && 
            <h3>Qualifications</h3>
            
            }

            {skillTab === 'exper' && 
              
              <EmployeeExperience/> 
            
            }
        </div>

        
        </>

        
    )   
}

export default EmployeeSkillnQualification