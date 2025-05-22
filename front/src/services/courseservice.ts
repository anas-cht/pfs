import axios from 'axios';
// import {User} from './userservice.ts'

export interface Course{
    title:string,
    editeur:string,
    rating:number,
    userid:number
}

export interface Userinfo{
  id?:number;
  interests:string;
  skills:string;
  userid:number;
}

export const addcourse = (course:Course) => {
    return axios.post('http://localhost:8080/api/course/addcourse',course);
  };

  export const getallcourses =(userid:number)=> {
    return axios.get(`http://localhost:8080/api/course/allcourses/${userid}`);
  };

  export const getcoursesrecommandation = (userinfo:Userinfo) => {
    return axios.post('http://localhost:8080/api/recommendations/hybrid',userinfo);
  };