

export const getFieldName = (fieldId: any, fieldData: any) => {

    console.log("fieldId", fieldId)
    const field = fieldData?.find((item: any) => {
        return parseInt(item.id) === parseInt(fieldId)
    })
    return field?.name
}