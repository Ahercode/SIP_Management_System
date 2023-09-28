import { Button, Form, Input, InputNumber, Modal, Skeleton, Space, Table, Tag, message } from 'antd'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { KTCardBody, KTSVG } from '../../../../_metronic/helpers'
import { Api_Endpoint, deleteItem, fetchAppraisals, fetchDocument, postItem, updateItem } from '../../../services/ApiCalls'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { set, useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'

const ParameterEntry = () => {
  const [submitLoading, setSubmitLoading] = useState(false)
  const { register, reset, handleSubmit } = useForm()
  const param: any = useParams();
  const tenantId = localStorage.getItem('tenant')
  let [appraisalName, setAppraisalName] = useState<any>("")
  const { data: allParameters, isLoading: loading } = useQuery('parameters', () => fetchDocument(`Parameters`), { cacheTime: 5000 })
  const { data: allAppraisals } = useQuery('appraisals', () => fetchDocument('appraisals'), { cacheTime: 5000 })


  const columns: any = [

    {
      title: 'Code',
      dataIndex: 'code',
      sorter: (a: any, b: any) => {
        if (a.code > b.code) {
          return 1
        }
        if (b.code > a.code) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: any, b: any) => {
        if (a.name > b.name) {
          return 1
        }
        if (b.name > a.name) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Weight per parameter (%)',
      dataIndex: 'weight',
      sorter: (a: any, b: any) => {
        if (a.status > b.status) {
          return 1
        }
        if (b.status > a.status) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Action',
      fixed: 'right',
      width: 100,
      render: (_: any, record: any) => (
        <Space size='middle'>
          <Link to={`/objectiveEntry/${record.id}`}>
            <span className='btn btn-light-info btn-sm'>Objectives</span>
          </Link>
        </Space>
      ),

    },
  ]

  const dataByID = allParameters?.data?.filter((section: any) => {
    return section.appraisalId?.toString() === '12'
  })

  //find appraisal by id
  const appraisalData = allAppraisals?.data?.find((appraisal: any) => {
    return appraisal.id === 12
  })


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
        <div className='table-responsive'>
          <div className='d-flex flex-direction-row justify-content-between align-items-center align-content-center py-4'>
            <div className='text-primary fs-2 fw-bold mb-4'>{`${appraisalData?.name}`}</div>
            <Button type='primary' disabled={true} size='large'>
              Submit
            </Button>
          </div>
          {
            loading ? <Skeleton active /> :
              <Table
                columns={columns}
                dataSource={dataByID}
                expandable={{
                  rowExpandable: (record) => record,
                  expandedRowRender: (record) =>
                    <div key={record}>
                      <div key={dataByID?.id} className='d-flex flex-direction-row align-items-center align-content-center py-4'>
                        <div className='d-flex flex-direction-row me-4'>
                          <span className=''>Objectives</span>
                          <Tag color='red' className='mx-2'>Incomplete</Tag>
                        </div>
                        <div className='d-flex flex-direction-row'>
                          <span className=''>Deliverables</span>
                          <Tag color='red' className='mx-2'>Incomplete</Tag>
                        </div>
                      </div>
                    </div>
                  ,
                }}
              />
          }
        </div>
      </KTCardBody>
    </div>
  )
}

export { ParameterEntry }