// src/services/userservice.ts
import axios from 'axios';

export interface User {
  id?: number ,
  username: string;
  fullname: string;
  email: string;
  university:string;
  degree:string;
  password: string;
}
interface UserData {
  id?: number;
  username: string;
  fullname: string;
  email: string;
  university:string;
  degree:string;
}

export const createuser = (user: User) => {
  return axios.post('http://localhost:8080/api/users', user);
};

export const getuser = async (credentials: { email: string; password: string }) => {
  return axios.post('http://localhost:8080/api/users/login', credentials);
};

export const updatepassword=async(userData: UserData ) => {
  return axios.put(`http://localhost:8080/api/users/setpassword/${userData.id}`, userData);
};

export const updateuser = async (userData: UserData) => {
  return axios.put(`http://localhost:8080/api/users/updateuser/${userData.id}`, userData);
};

export const getuser2 = async (credentials: { email: string}) => {
  return axios.post('http://localhost:8080/api/users/home', credentials);
};

export const removeuser = async (userData: UserData) => {
  return axios.post(`http://localhost:8080/api/users/removeuser`, userData);
};
