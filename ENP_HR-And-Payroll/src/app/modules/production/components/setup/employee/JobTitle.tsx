import { SetupComponent } from "../CommonSetupComponent"

const JobTitle = () => {

  const data = {
    title: 'Titre',
    url: 'JobTitles',
  }

  return (
    <div>
      < SetupComponent data={data} />    
    </div>
  )
}

export { JobTitle }

