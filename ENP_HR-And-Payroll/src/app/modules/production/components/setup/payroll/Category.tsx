import { SetupComponent } from '../CommonSetupComponent'

const Category = () => {
  
  const data = {
    title: 'Category',
    url: `Categories`,
    }
  return (
    <div>
      < SetupComponent data={data} />    
    </div>
  )
}

export { Category }

