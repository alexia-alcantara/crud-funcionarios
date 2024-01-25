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
    return this.http.get<Users[]>('https://fakestoreapi.com/products?sort=desc');
  }

  // saveUser(postData: any){
  //   return this.http.post('https://fakestoreapi.com/products', postData);
  // }

  addEditUser(postData: any, selectedUsr: any){
    if(!selectedUsr){
      return this.http.post('https://fakestoreapi.com/products', postData);
    } else { 
      return this.http.put(`https://fakestoreapi.com/products/${selectedUsr.id}`, postData);
    }
  }

  deleteUser(userId: number){
    return this.http.delete(`https://fakestoreapi.com/products/${userId}`)
  }
}
