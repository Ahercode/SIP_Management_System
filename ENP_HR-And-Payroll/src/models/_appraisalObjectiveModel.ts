import { type } from "os";

export type AppraisalObjectiveModel = {
    id?: number
    objective?: string
    description?: string
    weight?: number
    dueDate?: Date
    status?: string
    progress?: number
    userId?: number
    createdAt?: Date
    updatedAt?: Date
}