import { SetupComponent } from '../CommonSetupComponent'

const Products = () => {

  const data = {
    title: 'Produits',
    url: 'Products',
    }
  return (
    <div>
      <SetupComponent data={data} />    
    </div>
  )
}

export { Products }

