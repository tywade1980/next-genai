import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { APIResponse, PaginatedResponse, LoginRequest, LoginResponse, UpdateCheckRequest, UpdateCheckResponse } from '../types/api';
import { User, CallRecord, CBMSProject, CBMSTask } from '../types';

export class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor(baseURL: string = process.env.API_BASE_URL || 'http://localhost:3001') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          // Trigger re-authentication in the app (browser only)
          try {
            if (typeof window !== 'undefined' && window.dispatchEvent) {
              window.dispatchEvent(new CustomEvent('auth:logout'));
            }
          } catch (e) {
            // Ignore window access errors in non-browser environments
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  // Authentication
  async login(credentials: LoginRequest): Promise<APIResponse<LoginResponse>> {
    const response = await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async logout(): Promise<APIResponse> {
    const response = await this.client.post('/auth/logout');
    this.clearToken();
    return response.data;
  }

  // User management
  async getCurrentUser(): Promise<APIResponse<User>> {
    const response = await this.client.get('/users/me');
    return response.data;
  }

  // Call records
  async getCallRecords(page = 1, limit = 20): Promise<PaginatedResponse<CallRecord>> {
    const response = await this.client.get(`/calls?page=${page}&limit=${limit}`);
    return response.data;
  }

  async createCallRecord(callData: Omit<CallRecord, 'id' | 'timestamp'>): Promise<APIResponse<CallRecord>> {
    const response = await this.client.post('/calls', callData);
    return response.data;
  }

  // CBMS Projects
  async getProjects(page = 1, limit = 20): Promise<PaginatedResponse<CBMSProject>> {
    const response = await this.client.get(`/projects?page=${page}&limit=${limit}`);
    return response.data;
  }

  async createProject(projectData: Omit<CBMSProject, 'id' | 'tasks'>): Promise<APIResponse<CBMSProject>> {
    const response = await this.client.post('/projects', projectData);
    return response.data;
  }

  async updateProject(id: string, projectData: Partial<CBMSProject>): Promise<APIResponse<CBMSProject>> {
    const response = await this.client.put(`/projects/${id}`, projectData);
    return response.data;
  }

  // Tasks
  async getProjectTasks(projectId: string): Promise<APIResponse<CBMSTask[]>> {
    const response = await this.client.get(`/projects/${projectId}/tasks`);
    return response.data;
  }

  async createTask(taskData: Omit<CBMSTask, 'id' | 'createdAt' | 'updatedAt'>): Promise<APIResponse<CBMSTask>> {
    const response = await this.client.post('/tasks', taskData);
    return response.data;
  }

  async updateTask(id: string, taskData: Partial<CBMSTask>): Promise<APIResponse<CBMSTask>> {
    const response = await this.client.put(`/tasks/${id}`, taskData);
    return response.data;
  }

  // Update checking
  async checkForUpdates(request: UpdateCheckRequest): Promise<APIResponse<UpdateCheckResponse>> {
    const response = await this.client.post('/updates/check', request);
    return response.data;
  }
}

export const apiClient = new APIClient();