import axios from 'axios';
// import {User} from './userservice.ts'

export interface Message{
    message:string,
    userid:number
}

export const creatmessage = (msg:Message) => {
    return axios.post('http://localhost:8080/api/messages',msg);
  };