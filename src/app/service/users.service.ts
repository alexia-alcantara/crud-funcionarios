import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Users } from '../users/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<Users[]>{
    return this.http.get<Users[]>('http://localhost:3000/users');
  }

  // saveUser(postData: any){
  //   return this.http.post('https://fakestoreapi.com/products', postData);
  // }

  addEditUser(postData: any, selectedUsr: any){
    if(!selectedUsr){
      return this.http.post('http://localhost:3000/users', postData);
    } else { 
      return this.http.put(`http://localhost:3000/users/${selectedUsr.id}`, postData);
    }
  }

  deleteUser(userId: number){
    return this.http.delete(`http://localhost:3000/users/${userId}`)
  }
}
