import axios from 'axios'
import {Api_Endpoint} from './ApiCalls'
import {message} from 'antd'
import { type } from 'os'


type CommonProps = {
  objectiveData: any
  deliverableData: any
  actualData: any
  employeeId: any
  referenceId: any
}

type SendEmailProps = {
  record: any
  body: string
  subject: string
}

interface OverallAchievementProps extends CommonProps {
    parameterData: any
}

interface ParameterAchievementProps extends CommonProps {
  parameterId: any
}

export const getFieldName = (fieldId: any, fieldData: any) => {
  const field = fieldData?.find((item: any) => {
    return parseInt(item.id) === parseInt(fieldId)
  })
  return field?.name
}

export const getOverallAchievement = ({
  parameterData,
  objectiveData,
  deliverableData,
  actualData,
  employeeId,
  referenceId,
}: OverallAchievementProps) => {
  const overAllWeight = parameterData?.map((param: any) => {
    const objectivesInParameter = objectiveData?.filter(
      (obj: any) =>
        param?.id === obj?.parameterId &&
        obj?.employeeId === employeeId?.toString() &&
        obj?.referenceId === referenceId
    )

    const objectiveWeights = objectivesInParameter
      ?.map((objective: any) => {
        const deliverablesInObjective = deliverableData?.filter(
          (deliverable: any) => deliverable?.objectiveId === objective?.id
        )
        const deliverableWeight = deliverablesInObjective
          ?.map((deliverable: any) => {
            const actual = actualData?.find(
              (actual: any) =>
                actual?.deliverableId === deliverable?.id &&
                actual?.employeeId?.toString() === employeeId?.toString() &&
                actual?.referenceId === referenceId
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
      ?.reduce((a: any, b: any) => a + b, 0)
      .toFixed(2)
    return parseFloat(objectiveWeights)
  })
  const totalAchievement = overAllWeight?.reduce((a: any, b: any) => a + b, 0).toFixed(2)
  return totalAchievement
}

export const getOverallAchievementForSame = ({
  parameterData,
  objectiveData,
  deliverableData,
  actualData,
  employeeId,
  referenceId,
}: OverallAchievementProps) => {
  const overAllWeight = parameterData?.map((param: any) => {
    const objectivesInParameter = objectiveData?.filter(
      (obj: any) => param?.id === obj?.parameterId
    )

    const objectiveWeights = objectivesInParameter
      ?.map((objective: any) => {
        const deliverablesInObjective = deliverableData?.filter(
          (deliverable: any) => deliverable?.objectiveId === objective?.id
        )

        const deliverableWeight = deliverablesInObjective
          ?.map((deliverable: any) => {
            const actual = actualData?.find(
              (actual: any) =>
                actual?.deliverableId === deliverable?.id &&
                actual?.employeeId?.toString() === employeeId?.toString() &&
                actual?.referenceId === referenceId
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
      ?.reduce((a: any, b: any) => a + b, 0)
      .toFixed(2)
    return parseFloat(objectiveWeights)
  })
  const totalAchievement = overAllWeight?.reduce((a: any, b: any) => a + b, 0).toFixed(2)
  return totalAchievement
}

export const getParameterAchievement = ({
  parameterId,
  objectiveData,
  deliverableData,
  actualData,
  employeeId,
  referenceId,
}: ParameterAchievementProps) => {
  const objectivesInParameter = objectiveData?.filter(
    (obj: any) =>
      parameterId === obj?.parameterId &&
      obj?.employeeId === employeeId?.toString() &&
      obj?.referenceId === referenceId
  )
  const objectiveWeights = objectivesInParameter
    ?.map((objective: any) => {
      const deliverablesInObjective = deliverableData?.filter(
        (deliverable: any) => deliverable?.objectiveId === objective?.id
      )
      const deliverableWeight = deliverablesInObjective
        ?.map((deliverable: any) => {
          const actual = actualData?.find(
            (actual: any) =>
              actual?.deliverableId === deliverable?.id &&
              actual?.employeeId?.toString() === employeeId?.toString() &&
              actual?.referenceId === referenceId
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
    ?.reduce((a: any, b: any) => a + b, 0)
    .toFixed(2)
  return objectiveWeights
}
export const getParameterAchievementSame = ({
  parameterId,
  objectiveData,
  deliverableData,
  actualData,
  employeeId,
  referenceId,
}: ParameterAchievementProps) => {
  const objectivesInParameter = objectiveData?.filter(
    (obj: any) =>
      parameterId === obj?.parameterId
  )
  const objectiveWeights = objectivesInParameter
    ?.map((objective: any) => {
      const deliverablesInObjective = deliverableData?.filter(
        (deliverable: any) => deliverable?.objectiveId === objective?.id
      )
      const deliverableWeight = deliverablesInObjective
        ?.map((deliverable: any) => {
          const actual = actualData?.find(
            (actual: any) =>
              actual?.deliverableId === deliverable?.id &&
              actual?.employeeId?.toString() === employeeId?.toString() &&
              actual?.referenceId === referenceId
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
    ?.reduce((a: any, b: any) => a + b, 0)
    .toFixed(2)
  return objectiveWeights
}

export const sendEmail = ({record , body, subject}: SendEmailProps) => {
  console.log('record: ', record)
  const data = {
    subject: subject,
    body: body,
    email: record?.email,
    employeeName: record?.firstName + ' ' + record?.surname,
  }
  axios
    .post(`${Api_Endpoint}/Appraisalperftransactions/IndividualEmail`, data)
    .then((response) => {
      console.log(response.data)
    })
    .catch((error) => {
      console.error('Error:', error)
    })

  console.log('email sent: ', data)
}
