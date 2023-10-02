export const getFieldName = (fieldId: any, fieldData: any) => {
    const field = fieldData?.find((item: any) => {
        return parseInt(item.id) === parseInt(fieldId)
    })
    return field?.name
}