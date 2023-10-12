import { SetupComponent } from '../CommonSetupComponent'

const Trainings = () => {

  const data = {
    title: 'Formations',
    url: 'Trainings',
   }
  return (
    <div>
      < SetupComponent data={data} />    
    </div>
  )
}

export { Trainings }

