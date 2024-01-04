import { Table, message } from "antd"
import { EmployeeProfile } from "../components/employee/Employee"
import { useQuery } from "react-query"
import { fetchDocument } from "../../../services/ApiCalls"
import * as Papa from "papaparse"
import { getOverallAchievement, getOverallAchievementForSame } from "../../../services/CommonService"
import { useEffect } from "react"

const BonusComputation = ({employeeData, title}:any) => {
    const tenantId = localStorage.getItem('tenant')
    const { data: allCategories } = useQuery('categories', () => fetchDocument('Categories'), { cacheTime: 10000 })
    const { data: allDepartments} = useQuery('departments', () => fetchDocument('Departments'), { cacheTime: 10000 })
    const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees/tenant/${tenantId}`), { cacheTime: 10000 })
    const { data: allObjectiveDeliverables } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 10000 })
    const { data: allParameters, isLoading: loading } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 10000 })
    const { data: allAppraisalobjective} = useQuery('appraisalObjectives', () => fetchDocument('AppraisalObjective'), { cacheTime: 10000 })
    const { data: allApraisalActual } = useQuery('apraisalActuals', () => fetchDocument('ApraisalActuals'), { cacheTime: 10000 })
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })

    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active"
    })

    const convertToArray = checkActive?.referenceId.split("-")
    const appraisalId = convertToArray?.[1]

    const activeParameterName = allParameters?.data?.filter((item: any) => 
        item.appraisalId?.toString() === appraisalId
    )

    const sameParatmeter = allParameters?.data?.filter((item: any) => item?.tag?.trim() === 'same')

    const overAllScore = (employeeId:any) => {  
        return (parseFloat(getOverallAchievement(
             {
                 parameterData: activeParameterName,
                 objectiveData: allAppraisalobjective?.data,
                 deliverableData: allObjectiveDeliverables?.data,
                 actualData: allApraisalActual?.data,
                 referenceId: checkActive?.referenceId,
                 employeeId: employeeId,
             }
         )) + parseFloat(getOverallAchievementForSame(
             {
                 parameterData: sameParatmeter,
                 objectiveData: allAppraisalobjective?.data,
                 deliverableData: allObjectiveDeliverables?.data,
                 actualData: allApraisalActual?.data,
                 referenceId: checkActive?.referenceId,
                 employeeId: employeeId,
             }
         ))).toFixed(2)
     }

    const getPayoutRatio = (employeeId:any) => {
        const achievement = parseFloat(overAllScore(employeeId))

        const performanceRating = achievement < 50 ? 
        0 :
        achievement >= 50 && achievement < 60 ? 
        0:
        achievement >= 60 && achievement < 70? 
        80:
        achievement >= 70 && achievement < 80 ? 
        100:
        achievement >= 80 && achievement < 90 ?
        150:
        achievement >= 90 ?
        200: 
         0

        return performanceRating?.toFixed(2)
    }

    const getWeights = (categoryId:any, name:any) => {
        const empDepart = allCategories?.data?.find((item:any)=> item?.id === categoryId)
        return name ==="individual"?  
            parseFloat(empDepart?.individualWeight): 
            name ==="bonus"?
            parseFloat(empDepart?.bonusTarget): 
            parseFloat(empDepart?.grouopWeight)
    }

    const getGroupAchievement = (departmentId:any, name:any) => {
        const empDepart = allDepartments?.data?.find((item:any)=> item?.id === departmentId)
        const groupAchievement = empDepart?.threashold === null? 0: empDepart?.threashold ===undefined ? 0:parseFloat(empDepart?.threashold)
        return name ==="group"?  groupAchievement: empDepart?.name
    }

    const calculateBonus = (employeeId:any) => {
        const achievement = overAllScore(employeeId)
        const performanceRating = getPayoutRatio(employeeId)
        const emp = allEmployees?.data?.find((item:any)=> item?.id === employeeId)
        const empCat = allCategories?.data?.find((item:any)=> item?.id === emp?.categoryId)
        const empDepart = allDepartments?.data?.find((item:any)=> item?.id === emp?.departmentId)
        const groupAchievementFormat = empDepart?.threashold === null ? 0 : Number.isNaN(empDepart?.threashold)? 0: empDepart?.threashold
        const salary = emp?.annualBaseSalary === null ? 0 : emp?.annualBaseSalary
        const bonus = 
            (parseFloat(empCat?.bonusTarget)/100) * 
            (
                ((parseFloat(groupAchievementFormat)/100) * (parseFloat(empCat?.grouopWeight)/100)) + 
                ((parseFloat(empCat?.individualWeight)/100) * (parseFloat(achievement))/100)
            )*
            parseFloat(salary)
            * (parseFloat(performanceRating)/100)
         return bonus   
    }

    const columns:any = [

        {
            title:"Employee Details",
            render:(record:any)=>{
                return <EmployeeProfile employee={record} />
            }
        },
        {
            title:"Department",
            dataIndex: 'departmentId',
            render:(record:any)=>{
                const empDepart = allDepartments?.data?.find((item:any)=> item?.id === record)
                return empDepart?.name
            }
        },
        {
            title:"Bonus Target",
            dataIndex: 'categoryId',
            render:(record:any)=>{
                return getWeights(record, "bonus")?.toFixed(2)
            }
        },
        {
            title:"Group Achievement",
            dataIndex: 'departmentId',
            render:(record:any)=>{
                return Number.isNaN(getGroupAchievement(record, "group")) ? "0.00" : getGroupAchievement(record, "group")?.toFixed(2)
            }
        },
        {
            title:"Group Weight",
            width:100,
            dataIndex: 'categoryId',
            render:(record:any)=>{
                return getWeights(record, "group")?.toFixed(2)
            }
            
        },
        {
            title:"Individual Achievement",
            dataIndex: 'id',
            key:"id",
            render: (row: any) => {
                return (parseFloat(getOverallAchievement(
                    {
                        parameterData: activeParameterName,
                        objectiveData: allAppraisalobjective?.data,
                        deliverableData: allObjectiveDeliverables?.data,
                        actualData: allApraisalActual?.data,
                        referenceId: checkActive?.referenceId,
                        employeeId: row,
                    }
                )) + parseFloat(getOverallAchievementForSame(
                    {
                        parameterData: sameParatmeter,
                        objectiveData: allAppraisalobjective?.data,
                        deliverableData: allObjectiveDeliverables?.data,
                        actualData: allApraisalActual?.data,
                        referenceId: checkActive?.referenceId,
                        employeeId: row,
                    }
                ))).toFixed(2)
            },
        },
        {
            title:"Individual Weight",
            dataIndex: 'categoryId',
            fixed:"right",
            render:(record:any)=>{
                return getWeights(record, "individual")?.toFixed(2)
            }
        },
        {
            title:"Ann. Base Salary",
            dataIndex:"annualBaseSalary",
            fixed:"right",
            sorter:(a:any,b:any)=>{
                if(a.bonusYear > b.bonusYear){
                    return 1
                }
                if(b.bonusYear > a.bonusYear){
                    return -1
                }
                return 0
            },
            render:(record:any)=>{

                return record === null ? '0.00' : record+".00"
            }
        },
        {
            title:"Payout Ratio",
            dataIndex: 'id',
            key:"id",
            fixed:"right",
            render:(record:any)=>{
            return getPayoutRatio(record)
            }
        },
        {
            title:"Bonus",
            dataIndex: 'id',
            key:"id",
            fixed:"right",
            render:(record:any)=>{
                return Number.isNaN(calculateBonus(record))? "0.00" : calculateBonus(record)?.toFixed(2)
            }
        }

    ]

    const newData =  employeeData?.map((item:any)=> ({
        ...item,
        bonusTarget : getWeights(item?.categoryId, "bonus")?.toFixed(2),
        firstName: item?.firstName,
        surname: item?.surname,
        employeeId : item?.employeeId,
        groupAchievement : Number.isNaN(getGroupAchievement(item?.departmentId, "group"))?0 : getGroupAchievement(item?.departmentId, "group"),
        department:getGroupAchievement(item?.departmentId, "name"),
        groupWeight : getWeights(item?.categoryId, "group")?.toFixed(2),
        individualAchievement : overAllScore(item?.id),
        individualWeight : getWeights(item?.categoryId, "individual")?.toFixed(2),
        annualBaseSalary: item?.annualBaseSalary === null ? '0.00' : item?.annualBaseSalary?.toFixed(2),
        payoutRatio : parseFloat(getPayoutRatio(item?.id))?.toFixed(2),
        bonus: Number.isNaN(calculateBonus(item?.id))? '0.00' : calculateBonus(item?.id)?.toFixed(2)

    }))

    const convertToCSSV = (data:any) => {
        const csv =  Papa.unparse(data, {
            delimiter: ",",
            newline: "\n",
            quoteChar: '"',
            escapeChar: '"',
            header: true,
            skipEmptyLines: false,
        })

        return csv
    }

    function exportToCSV(data:any) {
        const csvData = convertToCSSV(data);
    
        const blob = new Blob([csvData], { type: 'text/csv' });
        const url = window.URL?.createObjectURL(blob);
        const a = document?.createElement('a');
        a.href = url;
        a.download = 'BonusCalculation.csv';
        document.body?.appendChild(a);
        a.click();
        document.body?.removeChild(a);
    }

    const columnsToKeep = [ 
        'employeeId', 
        'firstName', 
        'surname', 
        'department',
        'bonusTarget',
        'groupAchievement',
        'groupWeight', 
        'individualAchievement', 
        'individualWeight', 
        'annualBaseSalary',
        'payoutRatio',
        'bonus'
    ];

    const filteredData = newData?.map((item:any) => {
        const filteredItem:any = {};
        columnsToKeep?.forEach((column:any) => {
            filteredItem[column] = item[column];
        });
        return filteredItem;
    });

    const handlePrint = () => {
        exportToCSV(filteredData)
    }

    useEffect(() => {
    }
    , [employeeData])
    
    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>
                    Bonus Formular: <br></br> <span className="text-gray-600">Bonus Target * ((Group Achievement * Group Weight + Individual Achievement * Individual Weight)) *Annual Salary * Payout Ratio</span>
                    <br></br><span className="pt-6 fs-4 fw-bold text-danger">Note: no bonus for employees with achievement below 59</span>
                </h3>
                <div>
                    <button className="btn btn-light-info" onClick={handlePrint}>
                        Export
                    </button>
                </div>
            </div>
            <Table 
                columns={columns} 
                dataSource={
                    employeeData
                }
              />
        </>
    )
}

export {BonusComputation}
