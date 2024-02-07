export type UserDto = {
    id?: number;
    username?: string;
    password?: string;
    email?: string;
    roleId?: number;
    applicationId?: number;
    status?: boolean;
    userRoles?: UserRoleDto[];
    userApplications?: UserApplicationDto[];
}

// User Role Model
export type UserRoleDto = {
    id: number;
    roleName: string;
    userId: number;
    roleId: number;
}

// User Application Model
export type UserApplicationDto = {
    id: number;
    userId: number;
    applicationId: number;
    applicationName: string;
}
