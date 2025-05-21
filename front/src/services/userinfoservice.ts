import axios from 'axios';
// import {User} from './userservice.ts'

export interface Userinfo{
    id?:number;
    interests:string;
    skills:string;
    userid:number;
}

export const createuserinfo = (userinfo: Userinfo) => {
    return axios.post('http://localhost:8080/api/usersinfo/adduserinfo', userinfo);
  };

 export const getuserinfo =(id:number)=>{
    return axios.get(`http://localhost:8080/api/usersinfo/getuserinfo/${id}`);
 };

 export const getrecommendedcarrer=(id:number)=>{
    return axios.get(`http://localhost:8080/api/usersinfo/recommend/${id}`);
 };