import '../../../../../node_modules/devextreme/dist/css/dx.light.css'
import '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.common.css'
import '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-analytics.light.css'
import '../../../../../node_modules/@devexpress/analytics-core/dist/css/dx-querybuilder.css'
import '../../../../../node_modules/devexpress-dashboard/dist/css/dx-dashboard.light.css'
import {DashBoardUrl} from '../../../services/ApiCalls'
import { DashboardControl} from 'devexpress-dashboard-react';
  
const HRNewDashBoard = () => {

    return (
        <div style={{width: '100%', height: '80vh'}}> 
            <DashboardControl
                id='web-dashboard'
                style={{height: '100%'}}
                endpoint={`${DashBoardUrl}/dashboardcontrol`}
                workingMode='ViewerOnly'
                dashboardId='appraisal'
            ></DashboardControl>
        </div>  
    )
}

const EmployeeDetailReport = () => {

    return (
        <div style={{width: '100%', height: '80vh'}}>
            <DashboardControl
                id='web-dashboard'
                style={{height: '100%'}}
                endpoint='https://app.sipconsult.net/egolfdashboard/dashboardcontrol'
                workingMode='ViewerOnly'
                dashboardId='employeeDetails'
            ></DashboardControl>
        </div>  
    )
}

const EmployeeSummaryReport = () => {

    return (
        <div style={{width: '100%', height: '80vh'}}>
            <DashboardControl
                id='web-dashboard'
                style={{height: '100%'}}
                // endpoint='https://demos.devexpress.com/services/dashboard/api'
                endpoint='http://109.169.12.107/dashboard/dashboardcontrol'
                // endpoint='https://app.sipconsult.net/egolfdashboard/dashboardcontrol'
                workingMode='ViewerOnly'
                dashboardId='employeeDetails'
            ></DashboardControl>
        </div>  
    )
}

const EmpSummaryDashBoard = () => {
    return (
        <div style={{width: '100%', height: '80vh'}}>
            <DashboardControl
                id='web-dashboard'
                style={{height: '100%'}}
                // endpoint='https://demos.devexpress.com/services/dashboard/api'
                // endpoint='https ://208.117.44.15/dashboards/dashboardcontrol'
                endpoint='http://109.169.12.107/dashboard/dashboardcontrol'
                workingMode='ViewerOnly'
                dashboardId='employee_summary'
            ></DashboardControl>
        </div>  
    )
}
  export {HRNewDashBoard, EmpSummaryDashBoard, EmployeeDetailReport, EmployeeSummaryReport};