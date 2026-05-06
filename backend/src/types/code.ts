export interface codeStatus{
    id: string,
    code: string,
    status: boolean
}

export interface searchCodeAndUpdateStatusResponse{
    success?: boolean,
    error?: string,
    data?: {
        code: string,
    }
}