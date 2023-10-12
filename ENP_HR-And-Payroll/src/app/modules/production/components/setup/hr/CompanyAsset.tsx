import { SetupComponent } from "../CommonSetupComponent"

const CompanyAsset = () => {

  const data = {
    title: 'Actifs',
    url: 'CompanyAssets',
    }
  return (
    <div>
      < SetupComponent data={data} />    
    </div>
  )
}

export { CompanyAsset }

