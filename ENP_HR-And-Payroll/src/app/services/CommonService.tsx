export const getFieldName = (fieldId: number, fieldData: any) => {
    const field = fieldData?.find((item: any) => {
        return item.id === fieldId
    })
    return field?.name
}