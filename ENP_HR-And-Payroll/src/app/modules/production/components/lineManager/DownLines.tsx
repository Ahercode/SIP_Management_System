import { Button, Modal, Skeleton, Table, Tag, message } from "antd"
import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "react-query"
import { Api_Endpoint, fetchDocument } from "../../../../services/ApiCalls"
import { getEmployeeProperty, getEmployeePropertyName,  getFieldName, getSupervisorData } from "../ComponentsFactory"
import { AppraisalObjectivesComponent } from "../appraisalForms/AppraisalObjectivesComponent"
import { AppraisalFormContent, AppraisalFormHeader } from "../appraisalForms/FormTemplateComponent"
import { ErrorBoundary } from "@ant-design/pro-components"
import axios from "axios"

const DownLines = ({ filteredByLineManger, loading, allEmployees, allAppraisalobjective}: any) => {

    const { data: allDepartments } = useQuery('departments', () => fetchDocument(`departments`), { cacheTime: 10000 })
    const { data: allJobTitles } = useQuery('jobTitles', () => fetchDocument(`jobTitles`), { cacheTime: 10000 })
    const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 10000 })
    const [isModalOpen, setIsModalOpen] = useState(false)

    const [employeeData, setEmployeeData] = useState<any>({})
    const [objectivesData, setObjectivesData] = useState<any>([])
    const queryClient = useQueryClient()

    const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
    const parametersData = parameters?.data?.filter((item: any) => item?.appraisalId === 12)


    const showObjectivesView = (record: any) => {
        setIsModalOpen(true)
        const employee = allEmployees?.data?.find((item: any) => item.employeeId === record?.employeeId)
        const objectiveByEMployee = allAppraisalobjective?.data?.filter((item: any) => (item.employeeId) === record?.id.toString())
        setObjectivesData(objectiveByEMployee)
        setEmployeeData(employee)
   
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const getEmployeeStatus = ((employeeId:any)=> {
        const allSubmittedObjectives = allAppraisalobjective?.data?.filter((item: any) => {
             return parseInt(item?.employeeId) === employeeId?.id
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
        // {
        //     title: 'Action',
        //     fixed: 'right',
        //     width: 100,
        //     render: (record: any) => (
        //         <button disabled={
        //             getEmployeeStatus(record).props.children === "Submitted for Amendment"||
        //             getEmployeeStatus(record).props.children === "Not Started"
        //             } onClick={() => showObjectivesView(record)} 
        //             className={record?.status === "amend" ? 'btn btn-bg-secondary btn-sm' : 'btn btn-light-info btn-sm'}>
        //             Amend
        //         </button>
        //     ),
        // },
    ]

    // add a key to dataByID
    const allDownlines = filteredByLineManger?.map((item: any) => {
        return {
            ...item,
            key: item?.employeeId,
        }
    })

    useEffect(() => {

    }, [])

    const getOnlyparameters = parameters?.data?.filter((item: any) => {
        return item.appraisalId === 12
      }
    )

    const OnSubmit =(statusText:any)  => {
        const parameterIds = getOnlyparameters?.map((item: any) => {
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
                        expandable={{
                            // rowExpandable: (record) => record?.id,
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
