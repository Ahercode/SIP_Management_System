import axios from 'axios'
import {AuthModel, UserModel} from './_models'
import { Api_Endpoint } from '../../../services/ApiCalls'

// const API_URL = "https://app.sipconsult.net/hrwebapi/api/Users"
// const API_URL = "https://app.sipconsult.net/omniappraisalapi/api/Employees"
// const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${Api_Endpoint}/verify_token`
export const LOGIN_URL = `${Api_Endpoint}/Employees/Login`
export const REGISTER_URL = `${Api_Endpoint}/register`
export const REQUEST_PASSWORD_URL = `${Api_Endpoint}/forgot_password`

// Server should return AuthModel
export function login(email: string, password: string) {
  return axios.post(LOGIN_URL, {
    email,
    password,
  })
}

// Server should return AuthModel
export function register(
  email: string,
  firstname: string,
  lastname: string,
  password: string,
  password_confirmation: string
) {
  return axios.post(REGISTER_URL, {
    email,
    first_name: firstname,
    last_name: lastname,
    password,
    password_confirmation,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

// This will get me all details of the user!
export function parseJwt(token:string) {
  if (!token) { return; }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const newOb = JSON.parse(window.atob(base64))
  return newOb
}

export function getUserByToken(token: string) {
  return axios.post<UserModel>(GET_USER_BY_ACCESSTOKEN_URL, {
    jwtToken: token,
  })
}
