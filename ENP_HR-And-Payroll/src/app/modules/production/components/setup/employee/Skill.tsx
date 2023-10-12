import { SetupComponent } from '../CommonSetupComponent'

const Skill = () => {
  const data = {
    title: 'Competences',
    url: 'Skills',
  }
  
  return (
    <div>
      < SetupComponent data={data} />    
    </div>
  )
}

export { Skill }

