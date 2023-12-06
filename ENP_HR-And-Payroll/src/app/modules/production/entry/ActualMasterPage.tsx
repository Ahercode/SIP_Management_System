import {useQuery} from 'react-query'
import {ActualPage} from './ActualPage'
import {Api_Endpoint, fetchDocument} from '../../../services/ApiCalls'
import {useAuth} from '../../auth'
import {ArrowLeftOutlined} from '@ant-design/icons'
import {useNavigate} from 'react-router-dom'
import {ErrorBoundary} from '@ant-design/pro-components'
import {Button, Modal, message} from 'antd'
import {useEffect, useState} from 'react'
import axios from 'axios'
import {useForm} from 'react-hook-form'
import {send} from 'process'
import {getOverallAchievement, getOverallAchievementForSame, sendEmail} from '../../../services/CommonService'

const ActualMasterPage = ({employeeId, title, referenceId}: any) => {
  const {currentUser} = useAuth()
  const navigate = useNavigate()
  const tenantId = localStorage.getItem('tenant')
  const {register, reset, handleSubmit} = useForm()
  const currentLocation = window.location.pathname.split('/')[4]
  const [actualToUpdate, setActualToUpdate] = useState<any>(null)
  const [finalCommentModal, setFinalCommentModal] = useState<any>(false)

  const {data: allObjectiveDeliverables} = useQuery(
    'appraisalDeliverables',
    () => fetchDocument('AppraisalDeliverable'),
    {cacheTime: 10000}
  )
  const {data: allParameters, isLoading: loading} = useQuery(
    'parameters',
    () => fetchDocument(`Parameters`),
    {cacheTime: 10000}
  )
  const {data: allAppraisalobjective} = useQuery(
    'appraisalObjectives',
    () => fetchDocument('AppraisalObjective'),
    {cacheTime: 10000}
  )
  const {data: allApraisalActual} = useQuery(
    'apraisalActuals',
    () => fetchDocument('ApraisalActuals'),
    {cacheTime: 10000}
  )
  const {data: allReviewdates} = useQuery(
    'reviewDates',
    () => fetchDocument(`AppraisalReviewDates`),
    {cacheTime: 10000}
  )
  const {data: allEmployees} = useQuery(
    'employees',
    () => fetchDocument(`employees/tenant/${tenantId}`),
    {cacheTime: 10000}
  )
  const {data: finalComment} = useQuery('finalComments', () => fetchDocument('FinalComment'), {
    cacheTime: 10000,
  })

  const sameParameter = allParameters?.data?.filter((item: any) => item?.tag?.trim() === 'same')

//   const [selectedOption, setSelectedOption] = useState('')

//   const handleChange = (event: any) => {
//     setSelectedOption(event.target.value)
//   }

  if (title === 'hr') {
    referenceId = referenceId
    employeeId = employeeId
  } else {
    referenceId = localStorage.getItem('actualReferenceId')
    employeeId = currentUser?.id
  }

  const checkActive = allReviewdates?.data?.find((item: any) => {
    return item?.isActive?.trim() === 'active' && item?.referenceId === referenceId
  })

  const finalCommentByEmployee = finalComment?.data?.find((item: any) => {
    return item?.employeeId === parseInt(employeeId) && item?.referenceId === referenceId
  })

  const currentEmployee = allEmployees?.data?.find((item: any) => {
    return item?.id === parseInt(currentUser?.id)
  })

  const currentUserLineManager = allEmployees?.data?.find((item: any) => {
    return item?.id === currentEmployee?.lineManagerId
  })

  const handleFinalModalClose = () => {
    setFinalCommentModal(false)
    setActualToUpdate(null)
    reset()
  }

  const handleFinalComment = () => {
    setFinalCommentModal(true)
  }

  const handleFinalChange = (event: any) => {
    event.preventDefault()
    setActualToUpdate({...actualToUpdate, [event.target.name]: event.target.value})
  }

  const convertToArray = referenceId?.split('-')

  const appraisalId = convertToArray?.[1]

  const activeParameterName = allParameters?.data?.filter(
    (item: any) => item.appraisalId?.toString() === appraisalId
  )
  const allActiveParameters = allParameters?.data?.filter(
    (item: any) => item.appraisalId?.toString() === appraisalId || item?.tag?.trim() === 'same'
  )
  const sameParatmeter = allParameters?.data?.filter((item: any) => item?.tag?.trim() === 'same')

  const activeParameters = allParameters?.data
    ?.filter(
      (item: any) => item.appraisalId?.toString() === appraisalId || item?.tag?.trim() === 'same'
    )
    .map((param: any) => param?.id)

    

  const parameterIdSet = new Set(activeParameters)
  const sameParameterIdSet = new Set(sameParatmeter?.map((param: any) => param?.id))

  const objectivesData = allAppraisalobjective?.data.filter(
    (obj: any) =>
      (parameterIdSet.has(obj.parameterId) &&
        obj?.employeeId === employeeId?.toString() &&
        obj?.referenceId === checkActive?.referenceId) ||
        sameParameterIdSet?.has(obj.parameterId)
  )

  const objectiveWeights = objectivesData?.map((objective: any) => {
    const deliverablesInObjective = allObjectiveDeliverables?.data.filter(
      (deliverable: any) => deliverable?.objectiveId === objective?.id
    )

    const deliverableWeight = deliverablesInObjective?.map((deliverable: any) => {
      const actual = allApraisalActual?.data?.find(
        (actual: any) => actual?.deliverableId === deliverable?.id
      )
      return actual?.id
    })
    return deliverableWeight
  })

  const actualIds = objectiveWeights?.flat()

  const getParameterAchievement = (parameterId: any) => {
    const objectivesInParameter = allAppraisalobjective?.data.filter(
      (obj: any) =>
        parameterId === obj?.parameterId &&
        obj?.employeeId === employeeId?.toString() &&
        obj?.referenceId === checkActive?.referenceId
    )
    const objectivesInSameParameter = allAppraisalobjective?.data.filter(
      (obj: any) => sameParameter?.id === obj?.parameterId
    )
    const objectiveWeights = (
      sameParameter?.id === parameterId ? objectivesInSameParameter : objectivesInParameter
    )
      ?.map((objective: any) => {
        const deliverablesInObjective = allObjectiveDeliverables?.data.filter(
          (deliverable: any) => deliverable?.objectiveId === objective?.id
        )

        const deliverableWeight = deliverablesInObjective
          ?.map((deliverable: any) => {
            const actual = allApraisalActual?.data?.find(
              (actual: any) =>
                actual?.deliverableId === deliverable?.id &&
                actual?.employeeId?.toString() === employeeId?.toString() &&
                actual?.referenceId === checkActive?.referenceId
            )

            const actualValue =
              actual?.actual === null || actual?.actual === undefined
                ? 0
                : Math.round((actual?.actual / deliverable?.target) * 100)
            return actualValue * (deliverable?.subWeight / 100)
          })
          .reduce((a: any, b: any) => a + b, 0)
          .toFixed(2)
        const finalWeight = deliverableWeight > 120 ? 120 : deliverableWeight
        return finalWeight * (objective?.weight / 100)
      })
      .reduce((a: any, b: any) => a + b, 0)
      .toFixed(2)
    return objectiveWeights
  }

  const OnSubmit = () => {
    const data = {
      employeeId: employeeId,
      actualIds: actualIds,
      statusText: 'submitted',
    }

    if (actualIds?.length === 0) {
      message.error("You can't at this time, please contact your supervisor")
    } else {
      axios
        .post(`${Api_Endpoint}/ApraisalActuals/UpdateStatus`, data)
        .then((res) => {
          message.success('Successfully Submitted')
          sendEmail(
            currentUserLineManager,
            `your direct report ${currentUser?.firstName} ${currentUser?.surname} has submitted their self evaluation`
          )
        })
        .catch((err) => {
          console.log('err', err)
        })
    }
  }

  const saveEmployeeComment = handleSubmit(async (values) => {
    const data = [
      {
        employeeId: employeeId,
        finalComment1: values?.finalComment1 === undefined ? '' : values?.finalComment1,
        achievement: values?.achievement === undefined ? '' : values?.achievement,
        strength: values?.strength === undefined ? '' : values?.strength,
        weakness: values?.weakness === undefined ? '' : values?.weakness,
        improvement: values?.improvement === undefined ? '' : values?.improvement,
        hodcomment: values?.hodcomment === undefined ? '' : values?.hodcomment,
        referenceId: referenceId,
      },
    ]
    console.log('data', data)
    axios
      .post(`${Api_Endpoint}/FinalComment/`, data)
      .then((res) => {
        setFinalCommentModal(false)
        message.success('Comment Saved Successfully!')
      })
      .catch((err) => {
        console.log('err', err)
      })
  })

  useEffect(() => {}, [employeeId, title])

  const overallAchievement = getOverallAchievement(
    {
      parameterData: activeParameterName,
      objectiveData: allAppraisalobjective?.data,
      deliverableData: allObjectiveDeliverables?.data,
      actualData: allApraisalActual?.data,
      employeeId: employeeId,
      referenceId: referenceId,
    }
  )

  const performanceRating =
    overallAchievement < 50 ? (
      <span className='badge fs-4 badge-light-danger fw-bolder'>Poor</span>
    ) : overallAchievement >= 50 && overallAchievement < 60 ? (
      <span className='badge fs-4 badge-light-warning fw-bolder'>Unsatisfactory</span>
    ) : overallAchievement >= 60 && overallAchievement < 70 ? (
      <span className='badge fs-4 badge-light-warning fw-bolder'>Satisfactory</span>
    ) : overallAchievement >= 70 && overallAchievement < 80 ? (
      <span className='badge fs-4 badge-light-info fw-bolder'>Good</span>
    ) : overallAchievement >= 80 && overallAchievement < 90 ? (
      <span className='badge fs-4 badge-light-info fw-bolder'>Very Good</span>
    ) : overallAchievement >= 90 ? (
      <span className='badge fs-4 badge-light-success fw-bolder'>Excellent</span>
    ) : (
      'N/A'
    )

  return (
    <div
      style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: title === 'final' || title === 'hr' ? '' : '2px 2px 15px rgba(0,0,0,0.08)',
      }}
    >
      <div className='d-flex flex-direction-row align-items-center justify-content-between align-content-center'>
        {title === 'final' || title === 'hr' ? (
          ''
        ) : (
          <div className='d-flex flex-direction-row align-items-center justify-content-between align-content-center'>
            <Button
              onClick={() => navigate(-1)}
              className='btn btn-light-success me-4'
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
              }}
              shape='circle'
              icon={<ArrowLeftOutlined rev={''} />}
              size={'large'}
            />
            <span className=' text-gray-600 fw-bold d-block fs-2'>Go back</span>
          </div>
        )}
        <div>
          {title === 'final' || title === 'hr' ? (
            ''
          ) : (
            <a onClick={OnSubmit} className='btn btn-success btn-sm'>
              Submit
            </a>
          )}
        </div>
      </div>
      <div className={title === 'hr' || title === 'final' ? '' : `mt-8`}>
        <span className='text-gray-600 fw-bold fs-2'>
          Overall Achievement:{' '}
          <span className='badge fs-4 badge-light-primary'>{parseFloat(getOverallAchievement(
            {
              parameterData: activeParameterName,
              objectiveData: allAppraisalobjective?.data,
              deliverableData: allObjectiveDeliverables?.data,
              actualData: allApraisalActual?.data,
              employeeId: employeeId,
              referenceId: referenceId,
            }
          )) + 
          
          parseFloat(getOverallAchievementForSame(
            {
              parameterData: sameParatmeter,
              objectiveData: allAppraisalobjective?.data,
              deliverableData: allObjectiveDeliverables?.data,
              actualData: allApraisalActual?.data,
              employeeId: employeeId,
              referenceId: referenceId,
            }
          ))}</span>{' '}
        </span>

        <span className='text-gray-600 ms-5 fw-bold fs-2'>
          Performance Rate:
          {performanceRating}
        </span>
      </div>
      <div></div>
      {allActiveParameters?.map((param: any) => (
        <div className='align-items-start mt-11'>
          <div className='d-flex flex-direction-row align-items-center justify-content-start align-content-center'>
            <span className='fs-3 fw-bold '>
              {param?.name}: {`${param?.weight}%`}
            </span>
          </div>

          {checkActive?.tag?.trim() === 'settings' ? null : (
            <p className='badge badge-light-info fw-bold fs-3 mt-2'>
              Achievement:{' '}
              <span style={{color: 'ActiveCaption', paddingLeft: '10px'}}>
                {' '}
                {getParameterAchievement(param?.id)}
              </span>
            </p>
          )}
          {objectivesData?.map((item: any) =>
            item?.parameterId === param?.id ? (
              <div className='align-items-start'>
                <ErrorBoundary>
                  <ActualPage
                    parameterName={param?.name}
                    parameterWeight={param?.weight}
                    parameterId={param?.id}
                    objectiveName={item?.name}
                    objectiveWeight={item?.weight}
                    objectiveId={item?.id}
                    employeeId={employeeId?.toString()}
                    title={title}
                    referenceId={referenceId}
                  />
                </ErrorBoundary>
              </div>
            ) : null
          )}
        </div>
      ))}
      <br />
      <hr />

      <div className='mb-10 mt-10'>
        <div>
          <label className='fs-3 fw-bold form-label'>Employee's comments</label>
          <textarea
            disabled={title === 'final' || title === 'hr' ? true : false}
            rows={1}
            {...register('finalComment1')}
            className='form-control'
            defaultValue={finalCommentByEmployee?.finalComment1}
          />
          {title === 'final' || title === 'hr' ? (
            ''
          ) : (
            <button onClick={saveEmployeeComment} className='mt-3 btn btn-light-success btn-sm'>
              Save
            </button>
          )}
        </div>
        <div>
          <p className='fs-3 mt-10 fw-bold form-label'>Line Manager's comments</p>
          <button onClick={handleFinalComment} className=' btn btn-light-info btn-sm'>
            {title === 'final' || title === 'hr' ? 'Your final comments' : 'View comments'}
          </button>
        </div>
        <Modal
          title='Final Comments'
          open={finalCommentModal}
          onCancel={handleFinalModalClose}
          footer={[
            <button onClick={handleFinalModalClose} className='btn btn-light-danger btn-sm me-6'>
              Close
            </button>,
            <button onClick={saveEmployeeComment} className='btn btn-light-success btn-sm'>
              Submit
            </button>,
          ]}
        >
          <hr></hr>
          <form onSubmit={saveEmployeeComment}>
            <div className='mb-7'>
              <label className=' form-label'>Major Achievements</label>
              <textarea
                {...register('achievement')}
                value={actualToUpdate?.achievement}
                onChange={handleFinalChange}
                disabled={
                  title !== 'hr' || currentLocation === 'appraisal-performance' ? true : false
                }
                rows={1}
                className='form-control '
              />
            </div>
            <div className='mb-7'>
              <label className=' form-label'>
                What activities does this Appraisee do especially well (Major Strengths)
              </label>
              <textarea
                {...register('strength')}
                value={actualToUpdate?.strength}
                onChange={handleFinalChange}
                disabled={
                  title !== 'hr' || currentLocation === 'appraisal-performance' ? true : false
                }
                rows={1}
                className='form-control '
              />
            </div>
            <div className='mb-7'>
              <label className=' form-label'>
                In what aspects does this Appraisee need to improve (Weakness)
              </label>
              <textarea
                {...register('weakness')}
                value={actualToUpdate?.weakness}
                onChange={handleFinalChange}
                disabled={
                  title !== 'hr' || currentLocation === 'appraisal-performance' ? true : false
                }
                rows={1}
                className='form-control '
              />
            </div>
            <div className='mb-7'>
              <label className=' form-label'>
                Areas for Improvement / Development – Based on current job performance and the
                requirement of the Appraisee’s job position, in order of priority, list areas of
                training need/recommended.
              </label>
              <textarea
                {...register('improvement')}
                value={actualToUpdate?.improvement}
                onChange={handleFinalChange}
                disabled={
                  title !== 'hr' || currentLocation === 'appraisal-performance' ? true : false
                }
                rows={1}
                className='form-control '
              />
            </div>
            {title !== 'hr' || currentLocation === 'appraisal-performance' ? (
              ''
            ) : (
              <>
                <div className='mb-7'>
                  <label className=' form-label'>HODs / Supervisor’s Final Comments</label>
                  <textarea
                    {...register('hodcomment')}
                    value={actualToUpdate?.hodcomment}
                    onChange={handleFinalChange}
                    disabled={
                      title !== 'hr' || currentLocation === 'appraisal-performance' ? true : false
                    }
                    rows={1}
                    className='form-control '
                  />
                </div>
              </>
            )}
            <hr />
          </form>
        </Modal>
      </div>
    </div>
  )
}

export {ActualMasterPage}
