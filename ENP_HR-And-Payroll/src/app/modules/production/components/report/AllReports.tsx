import { Link } from 'react-router-dom'
import {KTCardBody, KTSVG} from '../../../../../_metronic/helpers'


const AllReports = () => {

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <KTCardBody className='py-4 '>
      
          <div className='row mb-10'>
            <div className='col-4'>
              <h2>
                Employees Reports
              </h2>
              <br />
              <ul>
                <li><h4><Link to="/report/payrollPAYEReport">List</Link></h4></li>
                <li><h4><Link to="">Age Profile</Link></h4></li>
                <li><h4><Link to="#">Staff Movement</Link></h4></li>
                <li><h4><Link to="#">History</Link></h4></li>
                <li><h4><Link to="#">Status</Link></h4></li>
              </ul>
            </div>
            <div className='col-4'>
              <h2>
                Human Resource Reports
              </h2>
              <br />
              <ul>
                <li><h4><Link to="#">Recruitement et Selections</Link></h4></li>
                <li><h4><Link to="#">Compensations et Avantages</Link></h4></li>
                <li><h4><Link to="#">Formation et developpement</Link></h4></li>
                <li><h4><Link to="#">Evaluation  et  Performance</Link></h4></li>
                <li><h4><Link to="#">Actions Disciplinaires</Link></h4></li>
                <li><h4><Link to="#">Plannification congés</Link></h4></li>
                <li><h4><Link to="#">Médical</Link></h4></li>
              </ul>
            </div>
            <div className='col-4'>
              <h2>
                Payroll Reports 
              </h2>
              <br />
              <ul>
                <li><h4><Link to="#">Historique Transaction</Link></h4></li>
                <li><h4><Link to="#">Fiche de paie</Link></h4></li>
                <li><h4><Link to="#">Journal</Link></h4></li>
                <li><h4><Link to="#">Basic Pay Reconciliation</Link></h4></li>
                <li><h4><Link to="#">Bank Summary</Link></h4></li>
                <li><h4><Link to="#">Analysis</Link></h4></li>
                <li><h4><Link to="#">Statutory  Reports</Link></h4></li>
                <li><h4><Link to="#">Loans</Link></h4></li>
              </ul>
            </div>
            
          </div>
          
    
      </KTCardBody>
    </div>
  )
}

export {AllReports}
