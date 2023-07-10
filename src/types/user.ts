export interface User {
    _id: string
    first_name: string
    last_name: string
    matric_number: string
    email: string
    level: number
    faculty: string
    department: string
    role: string
    isAdmin: boolean
    posts?: any[]
    tokens: any[]
}