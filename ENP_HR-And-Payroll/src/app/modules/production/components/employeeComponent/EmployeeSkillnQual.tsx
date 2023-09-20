import { Space } from "antd"
import { useState } from "react";
import "./formStyle.css"
import EmployeeExperience from "./skillQualExp/EmployeeExperience";
import EmployeeSkill from "./skillQualExp/EmployeeSkill";
import EmployeeQualification from "./skillQualExp/EmployeeQualification";

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
                <EmployeeSkill/>
            }
    
            {skillTab === 'qual' &&   
                <EmployeeQualification/>
            }

            {skillTab === 'exper' && 
              <EmployeeExperience/> 
            }
        </div>
        </>
    )   
}

export default EmployeeSkillnQualification