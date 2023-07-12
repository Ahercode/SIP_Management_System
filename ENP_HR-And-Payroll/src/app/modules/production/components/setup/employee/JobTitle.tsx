import { SetupComponent } from "../CommonSetupComponent"

const JobTitle = () => {

  const data = {
    title: 'Job Titles',
    url: 'jobtitles',
  }

  return (
    <div>
      < SetupComponent data={data} />    
    </div>
  )
}

export { JobTitle }

