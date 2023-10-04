import { Skeleton, Table, message } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { fetchDocument, updateItem } from '../../../../../services/ApiCalls'
import { getFieldName, getSupervisorData } from '../../ComponentsFactory'

import { useParams } from 'react-router-dom'
import "./cusStyle.css"


const PerformanceDetails = () => {
  const { data: allSubmittedObjectives } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
  const { data: allEmployees } = useQuery('employees', () => fetchDocument(`employees`), { cacheTime: 5000 })
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [employeeData, setEmployeeData] = useState<any>({})
  const [objectivesData, setObjectivesData] = useState<any>([])
  const [gridData, setGridData] = useState<any>()
  const [commentModalOpen, setCommentModalOpen] = useState(false)
  const [comment, setComment] = useState('')
  const { reset, register, handleSubmit } = useForm()
  const { data: parameters } = useQuery('parameters', () => fetchDocument(`parameters`), { cacheTime: 5000 })
  const [parametersData, setParametersData] = useState<any>([])
  const [isObjectiveDeclined, setIsObjectiveDeclined] = useState(false)

  const param: any = useParams();
  const { data: allPerfDetails, isLoading: loading } = useQuery('EmployeePerfDetails', () => fetchDocument(`EmployeePerfDetails`), { cacheTime: 5000 })
  const { data: allDepartments } = useQuery('departments', () => fetchDocument(`Departments`), { cacheTime: 5000 })
  const { data: appraisalobjective } = useQuery('appraisalobjective', () => fetchDocument(`appraisalobjective`), { cacheTime: 5000 })
  const { data: appraisaldeliverable } = useQuery('appraisaldeliverable', () => fetchDocument(`appraisaldeliverable`), { cacheTime: 5000 })
  const { data: allOrganograms } = useQuery('organograms', () => fetchDocument(`organograms`), { cacheTime: 5000 })
  const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument(`Appraisals`), { cacheTime: 5000 })

  const department = getFieldName(employeeData?.departmentId, allDepartments?.data)
  const lineManager = getSupervisorData({ employeeId: employeeData?.id, allEmployees, allOrganograms })

  const handleCommentModalCancel = () => {
    setCommentModalOpen(false)
    reset()
    setComment('')
  }

  const [textareaHeight, setTextareaHeight] = useState('auto');

  const handleCommentChange = (event: any) => {
    event.preventDefault()
    setComment(event.target.value);
    const { name, value } = event.target;
    setEmployeeData(
      (prevState: any) => ({
        ...prevState,
        [name]: value
      }));
    adjustTextareaHeight();
  }

  const adjustTextareaHeight = () => {
    const textarea: any = document.getElementById('resizable-textarea');
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;

    // Limit height to 10 lines
    if (textarea.scrollHeight > 10 * parseFloat(getComputedStyle(textarea).lineHeight)) {
      textarea.style.overflowY = 'scroll';
      textarea.style.height = `${10 * parseFloat(getComputedStyle(textarea).lineHeight)}px`;
    } else {
      textarea.style.overflowY = 'hidden';
    }

    setTextareaHeight(`${textarea.style.height}`);
  };


  const handleCommentModalOk = () => {
    const item = {
      data: {
        ...objectivesData,
        status: 'Rejected',
        comment: comment
      },
      url: 'appraisalobjective'
    }
    setIsObjectiveDeclined(true)
    updateData(item)
  }

  const showObjectivesView = (record: any) => {
    setIsModalOpen(true)
    const employee = allEmployees?.data?.find((item: any) => item.employeeId === record?.employeeId)
    setEmployeeData(employee)
    setObjectivesData(record)
  }


  const onObjectivesApproved = () => {
    const item = {
      data: {
        ...objectivesData,
        status: 'Approved'
      },
      url: 'appraisalobjective'
    }
    updateData(item)
    setIsModalOpen(false)
  }

  const loadData = () => {
    setGridData(allPerfDetails?.data)
    const parametersResponse = parameters?.data?.filter((item: any) => item?.appraisalId === 12)
    setParametersData(parametersResponse)
  }

  useEffect(() => {
    loadData()
  }, [gridData, parameters?.data, employeeData])


  const onObjectivesRejected = () => {
    setCommentModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const columns: any = [
    {
      title: 'Id',
      dataIndex: 'employeeId',
    },
    {
      title: 'Name',
      dataIndex: 'employeeId',
      render: (record: any) => {
        const employee = allEmployees?.data?.find((item: any) => item.employeeId === record)
        return employee?.firstName + ' ' + employee?.surname
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      // render: () => {
      //   return <Tag color="error">Pending</Tag>
      // }
    },
    // {
    //   title: 'Action',
    //   fixed: 'right',
    //   render: (_: any, record: any) => (
    //     <a onClick={() => showObjectivesView(record)} className='btn btn-light-info btn-sm'>
    //       View Objectives
    //     </a>

    //   ),
    // },
  ]

  const { mutate: updateData } = useMutation(updateItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('appraisalobjective')
      message.success(`Changes saved successfully`)
      reset()
      loadData()
      setEmployeeData({})
      setObjectivesData([])
      setCommentModalOpen(false)
      setIsModalOpen(false)
      setComment('')
      setIsObjectiveDeclined(false)
    },
    onError: (error) => {
      console.log('error: ', error)
      message.error(`Failed to save changes`)
    }
  })


  return (
    <>
      {
        loading ? <Skeleton active /> :
          <Table
            columns={columns}
            dataSource={gridData}
          />
      }
    </>
  )
}

export { PerformanceDetails }


