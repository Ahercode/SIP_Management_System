import { Button, Modal, Skeleton, Table, Tag, message } from "antd"
import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { Api_Endpoint, fetchDocument } from "../../../../services/ApiCalls"
import { getEmployeeProperty, getEmployeePropertyName,  getFieldName, getSupervisorData } from "../ComponentsFactory"
import { AppraisalObjectivesComponent } from "../appraisalForms/AppraisalObjectivesComponent"
import { AppraisalFormContent, AppraisalFormHeader } from "../appraisalForms/FormTemplateComponent"
import { ErrorBoundary } from "@ant-design/pro-components"
import axios from "axios"
import { check } from "prettier"
import { getOverallAchievement, getOverallAchievementForSame } from "../../../../services/CommonService"

const DownLines = ({ filteredByLineManger, referenceId, loading, allEmployees, allAppraisalobjective}: any) => {

    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`departments`), { cacheTime: 10000 })
    const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument(`jobTitles`), { cacheTime: 10000 })
    const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 10000 })
    const { data: allReviewdates } = useQuery('reviewDates', () => fetchDocument(`AppraisalReviewDates`), { cacheTime: 10000 })
    const { data: allObjectiveDeliverables } = useQuery('appraisalDeliverables', () => fetchDocument('AppraisalDeliverable'), { cacheTime: 10000 })
    const { data: allParameters } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 10000 })
    const { data: allApraisalActual } = useQuery('apraisalActuals', () => fetchDocument('ApraisalActuals'), { cacheTime: 10000 })
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [employeeData, setEmployeeData] = useState<any>({})
    const queryClient = useQueryClient()
    const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
    
    const checkActive = allReviewdates?.data?.find((item: any) => {
        return item?.isActive?.trim() === "active" && item?.referenceId === referenceId
    })
    
    const convertToArray = checkActive?.referenceId.split("-")
    
    const appraisalId = convertToArray?.[1]

    const activeParameterName = parameters?.data?.filter((item: any) => {
        return item?.appraisalId?.toString() === appraisalId
    })

    const parametersData = parameters?.data?.filter((item: any) => item?.appraisalId === appraisalId)

    const sameParameter = allParameters?.data?.filter((item: any) => item?.tag?.trim() === 'same')
    

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const getEmployeeStatus = ((employeeId:any)=> {
        const allSubmittedObjectives = allAppraisalobjective?.data?.filter((item: any) => {
             return parseInt(item?.employeeId) === employeeId?.id && item?.referenceId === checkActive?.referenceId
        })
        if (allSubmittedObjectives?.some((obj:any) => obj.status === "submitted")) {
            return  <Tag color="warning">Submitted</Tag>;
        } else if (allSubmittedObjectives?.some((obj:any) => obj.status === "rejected")) {
            return  <Tag color="error">Rejected</Tag>;
        }
        else if (allSubmittedObjectives?.some((obj:any) => obj.status === "approved")) {
            return <Tag color="success">Approved</Tag>;
        }
        else if (allSubmittedObjectives?.some((obj:any) => obj.status === "drafted")) {
            return <Tag color="warning">Drafted</Tag>;
        }
        else if (allSubmittedObjectives?.some((obj:any) => obj.status === "amend")) {
            return <Tag color="warning">Submitted for Amendment</Tag>;
        }
        else{
            return <Tag color="pink">Not Started</Tag>;
        }
    })

    const columns: any = [
        {
            title: 'Id',
            dataIndex: 'employeeId',
            key: "employeeId",
        },
        {
            title: 'Name',
            dataIndex: 'employeeId',
            key: "employeeId",
            render: (record: any) => {
                const employee = allEmployees?.data?.find((item: any) => item.employeeId === record)

                
                return employee?.firstName + ' ' + employee?.surname
            }
        },
        {
            title: 'Department',
            dataIndex: 'employeeId',
            render: (record: any) => {
                return getEmployeePropertyName({ employeeId: `${record}`, employeeProperty: 'departmentId', allEmployees: allEmployees?.data, OtherData: allDepartments?.data })
            }
        },
        {
            title: 'Job Title',
            dataIndex: 'employeeId',
            render: (record: any) => {
                return getEmployeePropertyName({ employeeId: `${record}`, employeeProperty: 'jobTitleId', allEmployees: allEmployees?.data, OtherData: allJobTitles?.data })
            }
        },
        {
            title: 'Email',
            dataIndex: 'employeeId',
            render: (record: any) => {
                return getEmployeeProperty({ employeeId: `${record}`, fieldName: 'email', allEmployees: allEmployees?.data })
            }
        },
        {
            title: 'Approval Status',
            dataIndex: 'status',
            key:"status",
            render: (_:any, record: any) => {
                return getEmployeeStatus(record)
            }
        },
        {
            title: 'Overall Achievement',
            dataIndex: 'employeeId',
            render: (_:any, record:any) => {
                return (
                    <>
                    <p>
                        {
                            (parseFloat(getOverallAchievement(
                                {
                                    parameterData: activeParameterName,
                                    objectiveData: allAppraisalobjective?.data,
                                    deliverableData: allObjectiveDeliverables?.data,
                                    actualData: allApraisalActual?.data,
                                    employeeId: record?.id,
                                    referenceId: checkActive?.referenceId
                                })) + parseFloat(getOverallAchievementForSame(
                                    {
                                        parameterData: sameParameter,
                                        objectiveData: allAppraisalobjective?.data,
                                        deliverableData: allObjectiveDeliverables?.data,
                                        actualData: allApraisalActual?.data,
                                        employeeId: record?.id,
                                        referenceId: checkActive?.referenceId
                                    }
                                )
                            ))?.toFixed(2)
                        }
                        </p>
                    </>
                )
            }
        },
        {
            title: "Performance Rating",
            render: (_:any, record:any) => {
                const overallAchievement = parseFloat(
                    getOverallAchievement(
                        {
                            parameterData: activeParameterName,
                            objectiveData: allAppraisalobjective?.data,
                            deliverableData: allObjectiveDeliverables?.data,
                            actualData: allApraisalActual?.data,
                            employeeId: record?.id,
                            referenceId: checkActive?.referenceId
                        }
                    )
                )+ parseFloat(
                    getOverallAchievementForSame(
                        {
                            parameterData: sameParameter,
                            objectiveData: allAppraisalobjective?.data,
                            deliverableData: allObjectiveDeliverables?.data,
                            actualData: allApraisalActual?.data,
                            employeeId: record?.id,
                            referenceId: checkActive?.referenceId
                        }
                    )
                )
                if(overallAchievement >= 90){
                    return <Tag color="success">Excellent</Tag>
                }
                else if(overallAchievement >= 80 && overallAchievement < 90){
                    return <Tag color="purple">Very Good</Tag>
                }
                else if(overallAchievement >= 70 && overallAchievement < 80){
                    return <Tag color="purple">Good</Tag>
                }
                else if(overallAchievement >= 60 && overallAchievement < 70){
                    return <Tag color="warning">Satisfactory</Tag>
                }
                else if(overallAchievement >= 50 && overallAchievement < 60){
                    return <Tag color="warning">Unsatisfactory</Tag>
                }
                else if(overallAchievement < 50){
                    return <Tag color="error">Poor</Tag>
                }
                else{
                    return <Tag color="pink">Very Poor</Tag>
                }
            }
        }
    ]

    const allDownlines = filteredByLineManger?.map((item: any) => {
        return {
            ...item,
            key: item?.employeeId,
        }
    })

    useEffect(() => {

    }, [])

    const OnSubmit =(statusText:any)  => {
        const parameterIds = activeParameterName?.map((item: any) => {
          return item.id
        })
        const data ={
          parameterIds: parameterIds,
          employeeId : employeeData?.id?.toString(),
          statusText: statusText
        }
        
        axios.post(`${Api_Endpoint}/Parameters/UpdateStatus`, data)
        .then(response => {
            message.success('Amendment Submitted Successfully');
          queryClient.invalidateQueries('appraisalobjective')
          setIsModalOpen(false)
          console.log(response.data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      
  }


    return (
        <>
            {
                loading ? <Skeleton active /> :
                    <Table
                        columns={columns}
                        dataSource={allDownlines}
                        scroll={{ y: `calc(100vh - 250px)` }}
                        expandable={{
                            expandedRowRender: (record) => <p key={record?.id} style={{ margin: 0 }}>{record.comment}
                            </p>,
                        }}
                    />
            }

            <Modal
                open={isModalOpen}
                width={1000}
                onCancel={handleCancel}
                onOk={handleCancel}
                closable={true}
                footer={<>
                    <button style={{ marginRight: 28,  }}
                        className="btn btn-info mb-2"
                        onClick={()=>OnSubmit("amend")}>
                            Amend
                    </button>
                </>
                }
                >
                <div className="py-9 px-9">
                    <AppraisalFormHeader employeeData={employeeData} department={department} lineManager={{}}/>
                    <ErrorBoundary>
                        <AppraisalFormContent component={AppraisalObjectivesComponent} employeeId={employeeData?.id} parametersData={parametersData} />
                    </ErrorBoundary>
                </div>
            </Modal>
        </>
    )
}

export { DownLines }
