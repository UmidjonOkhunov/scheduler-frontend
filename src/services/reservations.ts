import axios from 'axios'
const baseUrl = 'http://localhost:3001/status'

export interface ReservationsAttributes {
    id?: number;
    title: string;
    location:string;
    startDate: Date;
    endDate: Date;
    notes:string;
  }
  const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
  }
  
  const create = (newObject:ReservationsAttributes) => {
    const request = axios.post(baseUrl, newObject)
    return request.then(response => response.data)
  }
  
  const update = (id:number, newObject:ReservationsAttributes) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
  }
  
  export default { getAll, create, update }