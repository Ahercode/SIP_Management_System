import { SetupComponent } from '../CommonSetupComponent'

const SalaryUpgrade = () => {

  const data = {
    title: 'Augmentation de Salaire',
    url: 'SalaryUpgrades',
  }
  return (
    <div>
      < SetupComponent data={data} />    
    </div>
  )
}

export { SalaryUpgrade }

