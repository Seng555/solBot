// src/models/response.ts
export interface ApiResponse {
    status: number;
    message: string;
    data: any;
}