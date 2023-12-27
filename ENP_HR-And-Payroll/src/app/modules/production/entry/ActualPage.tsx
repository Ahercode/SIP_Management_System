import {Button, Empty, Modal, Skeleton, Table, message} from 'antd'
import {ChangeEvent, useEffect, useState} from 'react'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {Api_Endpoint, ImageBaseUrl, fetchDocument, postItem} from '../../../services/ApiCalls'
import {getFieldName} from '../components/ComponentsFactory'
import {useAuth} from '../../auth'
import {CustomForm} from './CustomForm'
import {set, useForm} from 'react-hook-form'
import axios from 'axios'
// import { SupportFile } from './SupportFile'

const ActualPage = ({
  parameterName,
  parameterWeight,
  parameterId,
  objectiveName,
  objectiveWeight,
  objectiveId,
  employeeId,
  title,
  referenceId,
}: any) => {
  const {currentUser} = useAuth()
  const queryClient = useQueryClient()
  const {register, reset, handleSubmit} = useForm()
  const [isFileModalOpen, setIsFileModalOpen] = useState(false)
  const [deliverableId, setDeliverableId] = useState<any>(null)

  const {data: allSupportFiles} = useQuery('supportFiles', () => fetchDocument(`SupportFiles`), {
    cacheTime: 10000,
  })

  const [file, setFile] = useState<any>(null)
  // const [individualComment, setIndividualComment] = useState<any>(null)
  // const [lineManagerComment, setLineManagerComment] = useState<any>(null)

  // console.log('file:', file)

  const [finalCommentModal, setFinalCommentModal] = useState<any>(false)
  // const [tempDeliverableId, setTempDeliverableId] = useState<any>(null)
  const [actualToUpdate, setActualToUpdate] = useState<any>(null)
  const {data: allObjectiveDeliverables, isLoading: loading} = useQuery(
    'appraisalDeliverables',
    () => fetchDocument('AppraisalDeliverable'),
    {cacheTime: 10000}
  )
  const {data: allUnitsOfMeasure} = useQuery(
    'unitofmeasures',
    () => fetchDocument('unitofmeasures'),
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

  const checkActive = allReviewdates?.data?.find((item: any) => {
    return item?.isActive?.trim() === 'active' && item?.referenceId === referenceId
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const fileNew = event.target.files[0]
      setFile(fileNew)
      setSelectedFile(fileNew)
    }
  }

  const handleFinalChange = (event: any) => {
    event.preventDefault()
    setActualToUpdate({...actualToUpdate, [event.target.name]: event.target.value})
  }

  const [actualValues, setActualValues] = useState<any>()
  const [isFocused, setIsFocused] = useState(false)
  // const [isFocused1, setIsFocused1] = useState(false);
  // const [isFocused2, setIsFocused2] = useState(false);
  const currentLocation = window.location.pathname.split('/')[4]

  const handleFinalComment = (record: any) => {
    const actual = allApraisalActual?.data?.find((item: any) => {
      return item?.deliverableId === record?.id
    })

    setActualToUpdate(actual)
    setFinalCommentModal(true)
  }

  const handleFinalModalClose = () => {
    setFinalCommentModal(false)
    setActualToUpdate(null)
    reset()
  }

  const showFileModal = (record: any) => {
    setDeliverableId(record?.id)
    setIsFileModalOpen(true)
    const tempFiles = allSupportFiles?.data?.find((item: any) => {
      return (
        item?.employeeId?.toString() === employeeId &&
        item?.referenceId === referenceId &&
        item?.deliverableId === record?.id
      )
      }
    )

    console.log('tempFiles:', tempFiles)

    const filePath = `${ImageBaseUrl}/omniAppraisalApi/Uploads/SupportFiles/${tempFiles?.filePath}`
    console.log('filePath:', filePath) 
    setFile(tempFiles===undefined? null:filePath)
  }

  const handleCancel = () => {
    setIsFileModalOpen(false)
    setFile(null)
    setDeliverableId(null)
  }

  const handleChange = (deliverableId: any, value: any, field: any) => {
    setActualValues((prevState: any) => {
      const newData = {...prevState}
      if (!newData[deliverableId]) {
        // Create an object if it doesn't exist
        newData[deliverableId] = {}
      }

      // Use the new value or fallback to old value
      newData[deliverableId][field] = value || newData[deliverableId][field]
      return newData
    })
  }

  const getOldActual = (deliverableId: any) => {
    const actual = allApraisalActual?.data?.find((item: any) => {
      return item?.deliverableId === parseInt(deliverableId)
    })
    return actual?.actual
  }

  const OnSubmit = () => {
    const dataArray = Object.keys(actualValues).map((recordId: any) => ({
      actual:
        actualValues[recordId].actual === undefined
          ? getOldActual(recordId)
          : actualValues[recordId].actual,
      deliverableId: recordId,
      referenceId: checkActive?.referenceId,
      employeeId: title==="linemanager" ? employeeId: parseInt(currentUser?.id),
      individualComment:
        actualValues[recordId]?.individualComment === undefined
          ? ''
          : actualValues[recordId]?.individualComment,
      lineManagerComment:
        actualValues[recordId]?.lineManagerComment === undefined
          ? ''
          : actualValues[recordId]?.lineManagerComment,
      status: 'drafted',
    }))

    const itemToPost = {
      data: dataArray,
      url: `ApraisalActuals`,
    }

    console.log('itemToPost:', itemToPost?.data)
    postData(itemToPost)
  }

  const SubmitFinalComment = handleSubmit(async (values) => {
    const itemToPost = {
      data: [
        {
          deliverableId: actualToUpdate?.deliverableId,
          actual: actualToUpdate?.actual,
          scheduleId: actualToUpdate?.scheduleId,
          employeeId: actualToUpdate?.employeeId,
          status: actualToUpdate?.status,
          individualComment: actualToUpdate?.individualComment,
          lineManagerComment: actualToUpdate?.lineManagerComment,
          referenceId: checkActive?.referenceId,
        },
      ],
      url: `ApraisalActuals`,
    }

    console.log('finalComment:', itemToPost?.data)
    postData(itemToPost)
    handleFinalModalClose()
  })

  const onFocus = () => {
    setIsFocused(true)
  }

  const onBlur = () => {
    setIsFocused(false)
    // setIsFocused1(false);
    // setIsFocused2(false);
  }

  const {mutate: postData} = useMutation(postItem, {
    onSuccess: () => {
      queryClient.invalidateQueries(`apraisalActuals`)
      message.success('Saved successfully')
    },
    onError: (error: any) => {
      console.log('post error: ', error)
      message.error('Error adding item')
    },
  })

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData()
      formData.append('ImageFile', selectedFile)
      formData.append('deliverableId', deliverableId)
      formData.append('employeeId', currentUser?.id)
      formData.append('referenceId', referenceId)

      console.log('formData:', Object.fromEntries(formData))
      axios
        .post(`${Api_Endpoint}/SupportFiles`, formData)
        .then((response) => {
          console.log('response:', response)
          message.success('File uploaded successfully')
          handleCancel()
        })
        .catch((error) => {
          // Handle error
        })
    }
  }

  function isBlobOrMediaSource(file:any) {
    return (file instanceof Blob) || (file instanceof MediaSource);
  }

  const columns: any = [
    {
      title: 'Deliverable',
      render: (record: any) => {
        const pointsArray = record?.description
          ?.trim()
          ?.split(/\n(?=\d+\.|\u2022)/)
          .filter(Boolean)
        return (
          <>
            <div className='d-flex'>
              <textarea
                readOnly={true}
                rows={3}
                cols={50}
                value={pointsArray?.join('\n')}
                className='form-control '
              />
            </div>
          </>
        )
      },
    },
    {
      title: 'Sub Weight',
      dataIndex: 'subWeight',
      width: 100,
      fixed: checkActive?.tag?.trim() === 'setting' ? 'right' : false,
      sorter: (a: any, b: any) => {
        if (a.subWeight > b.subWeight) {
          return 1
        }
        if (b.subWeight > a.subWeight) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Unit Of Measure',
      key: 'unitOfMeasureId',
      width: 130,
      fixed: checkActive?.tag?.trim() === 'setting' ? 'right' : false,
      sorter: (a: any, b: any) => {
        if (a.unitOfMeasureId > b.unitOfMeasureId) {
          return 1
        }
        if (b.unitOfMeasureId > a.unitOfMeasureId) {
          return -1
        }
        return 0
      },
      render: (record: any) => {
        return getFieldName(record.unitOfMeasureId, allUnitsOfMeasure?.data)
      },
    },
    {
      title: 'Target',
      dataIndex: 'target',
      width: 80,
      fixed: checkActive?.tag?.trim() === 'setting' ? 'right' : false,
      sorter: (a: any, b: any) => {
        if (a.target > b.target) {
          return 1
        }
        if (b.target > a.target) {
          return -1
        }
        return 0
      },
    },
    {
      title: 'Self-Assessment',
      fixed: 'right',
      width: 160,
      render: (record: any) => {
        const actual = allApraisalActual?.data?.find((item: any) => {
          return (
            item?.deliverableId === record?.id &&
            item?.employeeId?.toString()  === employeeId&&
            item?.referenceId === referenceId
          )
        })
        return (
          <>
            <input
              disabled={title === 'final' || title === 'hr' || (actual?.status?.trim() ==="submitted" && title===undefined) || title==="linemanager" ? true : false}
              onFocus={onFocus}
              onBlur={onBlur}
              type='number'
              min='0'
              value={actual?.oldActual === null || actual?.oldActual === undefined ? 
                actual?.actual: actual?.actual=== null || actual?.actual === undefined?0 : actual?.oldActual}
              onChange={(e) => handleChange(record?.id, e.target.value, 'actual')}
              className='form-control '
              style={{
                border: isFocused ? '1px solid green' : '1px solid #ccc',
              }}
            />
          </>
        )
      },
    },
    {
      title: 'Actual',
      fixed: 'right',
      width: 160,
      render: (record: any) => {
        const actual = allApraisalActual?.data?.find((item: any) => {
          return (
            item?.deliverableId === record?.id &&
            item?.employeeId?.toString()  === employeeId &&
            item?.referenceId === referenceId
          )
        })
        console.log('actual:', actual)
        return (
          <>
            <input
              disabled={title === 'final' || title === 'hr' || (actual?.status?.trim() ==="submitted" && title===undefined) ? true : false}
              onFocus={onFocus}
              onBlur={onBlur}
              type='number'
              min='0'
              defaultValue={actual?.actual===null||actual?.actual===undefined?0:actual?.actual}
              onChange={(e) => handleChange(record?.id, e.target.value, 'actual')}
              className='form-control '
              style={{
                border: isFocused ? '1px solid green' : '1px solid #ccc',
              }}
            />
          </>
        )
      },
    },
    
    // {
    //   title:"Individual Comment",
    //   fixed: 'right',
    //   width: 180,
    //   render: (record: any) => {
    //     const actual = allApraisalActual?.data?.find((item: any) => {
    //       return item?.deliverableId === record?.id &&
    //         item?.employeeId?.toString() === employeeId &&
    //         item?.referenceId === checkActive?.referenceId
    //     })

    //     const pointsArray = actual?.individualComment?.trim()?.split(/\n(?=\d+\.)/).filter(Boolean);
    //     return (
    //       <>
    //         {
    //           <textarea
    //             disabled={title==="final"|| title==="hr"?true:false}
    //             rows={1}
    //             onChange={(e)=>handleChange(record?.id, e.target.value, "individualComment")}
    //             defaultValue={pointsArray?.join('\n')}
    //             className="form-control"
    //             onFocus={onFocus1}
    //             onBlur={onBlur}
    //             style={{
    //               border: isFocused1 ? '1px solid green' : '1px solid #ccc'
    //             }}
    //           />
    //         }
    //       </>
    //     )
    //   }
    // },
    // {
    //   title:"LineManager Comments",
    //   fixed: 'right',
    //   width: 180,
    //   render: (record: any) => {
    //     const actual = allApraisalActual?.data?.find((item: any) => {
    //       return item?.deliverableId === record?.id
    //     })
    //     return (
    //       <>
    //         {/* {
    //           <textarea
    //             disabled={title!=="final" || currentLocation==="appraisal-performance"? true : false}
    //             rows={1}
    //             defaultValue={actual?.lineManagerComment}
    //             onChange={(e) => handleChange(record?.id, e.target.value, "lineManagerComment")}
    //             onFocus={onFocus2}
    //             onBlur={onBlur}
    //             key={record?.id}
    //             style={{
    //               border: isFocused2 ? '1px solid green' : '1px solid #ccc'
    //             }}
    //             className="form-control " />
    //         } */}

    //         <button
    //               onClick={()=>handleFinalComment(record)}
    //               className='btn btn-light-info me-8'
    //             >
    //               comments
    //             </button>
    //       </>
    //     )
    //   }
    // },
    {
      title: 'Supporting File',
      width: 180,
      fixed: 'right',
      render: (record: any) => {
        return (
          <>
            {/* <SupportFile title={title} deliverableId={record} /> */}
            <button onClick={() => showFileModal(record)} className='btn btn-light-info btn-sm'>
              {title === 'final' || title === 'hr' || title==='linemanager' ? 'View' : 'Upload a File'}
            </button>
          </>
        )
      },
    },
    {
      title: 'Achieved',
      align: 'right',
      fixed: 'right',
      width: 100,
      render: (record: any) => {
        const actual = allApraisalActual?.data?.find((item: any) => {
          return (
            item?.deliverableId === record?.id &&
            item?.employeeId?.toString() === employeeId &&
            item?.referenceId === referenceId
          )
        })
        return (
          <>
            {actual?.actual === null || actual?.actual === undefined
              ? 0
              : Math.round((actual?.actual / record?.target) * 100)}
          </>
        )
      },
    },
  ]

  console.log('checkActive:', checkActive?.tag?.trim())

  if (checkActive?.tag?.trim() === 'setting') {
    columns.splice(4, 4)
  } else if (checkActive?.tag?.trim() === 'actual') {
    columns.splice(6, 1)
  }

  const filteredDeliverables = allObjectiveDeliverables?.data.filter(
    (deliverable: any) => parseInt(deliverable.objectiveId) === objectiveId
  )
  
  useEffect(() => {}, [allApraisalActual?.data, actualToUpdate])

  return (
    <>
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '1px 1px 10px rgba(0,0,0,0.05)',
        }}
        className='border border-gray-400 mt-4'
      >
        <div className='mb-5 d-flex justify-content-between align-items-center align-content-center'>
          {/* {checkActive?.tag?.trim() === 'setting' ? null : ( */}
          {(
            <div>
              <span>
                <span className='text-gray-600 fw-bold fs-3' style={{color: 'ActiveCaption'}}>
                  {objectiveName}:{' '}
                  <span style={{color: 'ActiveCaption'}}>{`${objectiveWeight}`}</span>
                </span>
              </span>
              <br />
              <p style={{margin: '3px 0  0 0px'}} className='badge badge-light-info fw-bold fs-3'>
                Achievement:{' '}
                <span style={{color: 'ActiveCaption', paddingLeft: '10px'}}>
                  {(() => {
                    const total = filteredDeliverables
                      ?.map((deliverableId: any) => {
                        const actual = allApraisalActual?.data?.find((item: any) => {
                          return (
                            item?.deliverableId === deliverableId?.id &&
                            item?.employeeId?.toString() === employeeId &&
                            item?.referenceId === referenceId
                          )
                        })
                        const actualValue =
                          actual?.actual === null || actual?.actual === undefined
                            ? 0
                            : Math.round((actual?.actual / deliverableId?.target) * 100)
                        return actualValue * (deliverableId?.subWeight / 100)
                      })
                      .reduce((a: any, b: any) => a + b, 0)
                    const finalTotal = total > 120 ? 120 : total
                    return finalTotal?.toFixed(2)
                  })()}
                </span>
              </p>
            </div>
          )}
          {title === 'hr'|| checkActive?.tag?.trim() === 'setting' ? (
            ''
          ) : (
            <div>
              <button onClick={OnSubmit} className='btn btn-light-success me-3 btn-sm'>
                Save
              </button>
            </div>
          )}
        </div>
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <Table
              key={objectiveId}
              columns={columns}
              dataSource={filteredDeliverables}
              scroll={{x: 1300}}
            />
          </>
        )}
      </div>

      <Modal
        title={'Supporting Files'}
        open={isFileModalOpen}
        onCancel={handleCancel}
        closable={true}
        width={800}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key='submit'
            type='primary'
            htmlType='submit'
            onClick={handleUpload}
            disabled={!file}
          >
            Submit
          </Button>,
        ]}
      >
        <form>
          <hr></hr>
          {file === null ? (
            <Empty description={<span className='text-gray-600'>Empty </span>} className='mt-4' />
          ) : (
            <div>
              <iframe
                title='pdfViewer'
                src={isBlobOrMediaSource(file)?URL.createObjectURL(file):file}
                width='100%'
                height='600px'
              ></iframe>
            </div>
          )}
          <div className='d-flex mt-10 justify-content-center items-center'>
            {title === 'final' || title === 'linemanager' ? (
              ''
            ) : (
              <>
                <label htmlFor='fileInput' className='btn btn-light-info btn-sm'>
                  Choose File
                </label>
                <input
                  type='file'
                  id='fileInput'
                  accept='application/pdf'
                  className='visually-hidden'
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
          {/* <hr /> */}
        </form>
      </Modal>

      <Modal
        title='Final Comments'
        open={finalCommentModal}
        onCancel={handleFinalModalClose}
        // width={1000}
        footer={[
          <button onClick={handleFinalModalClose} className='btn btn-light-danger btn-sm me-6'>
            Close
          </button>,
          <button onClick={SubmitFinalComment} className='btn btn-light-success btn-sm'>
            Submit
          </button>,
        ]}
      >
        <hr></hr>
        <form
          // onSubmit={changeStatus}
          onSubmit={SubmitFinalComment}
        >
          <div className='mb-7'>
            <label className=' form-label'>Major Achievements</label>
            <textarea
              {...register('achievements')}
              value={actualToUpdate?.achievements}
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
        </form>
      </Modal>
    </>
  )
}

export {ActualPage}
