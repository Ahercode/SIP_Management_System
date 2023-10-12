import { SetupComponent } from '../CommonSetupComponent'

const Nationality = () => {

  const data = {
    title: 'Nationalités',
    url: 'Nationalities',
  }

  return (
    <div>
      < SetupComponent data={data} />    
    </div>
  )
}

export { Nationality }

