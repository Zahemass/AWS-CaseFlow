import apiClient from '../api/apiClient'
import { ENDPOINTS } from '../api/endpoints'
import { setToken, clearToken } from './tokenManager'

export const login = async (credentials) => {
  const res = await apiClient.post(ENDPOINTS.LOGIN, credentials)
  setToken(res.data.token)
  return res.data
}

export const register = async (data) => {
  const res = await apiClient.post(ENDPOINTS.REGISTER, data)
  return res.data
}

export const logout = () => {
  clearToken()
}
