import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../service/users.service';
import { Users } from '../../users/users';

// PrimeNG
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AddEditUserComponent } from '../../pages/add-edit-user/add-edit-user.component';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { error } from 'console';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    ConfirmDialogModule,
    HttpClientModule,
    TableModule,
    ToastModule,
    AddEditUserComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
  providers: [UserService, MessageService, ConfirmationService]
})
export class UsersComponent implements OnInit, OnDestroy {

  users: Users[] = [];
  displayAddEditModal = false;
  selectedUser: any = null;
  subscriptions: Subscription [] = [];
  usrSubscription: Subscription = new Subscription();

  constructor(private userService: UserService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.getUsersList();
  }

  getUsersList(){
    this.usrSubscription = this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
      }
    });
    this.subscriptions.push(this.usrSubscription)

  }


  showAdd(){
    this.displayAddEditModal = true;
    this.selectedUser = null;
  }

  hideAddModal(isClosed: boolean){
    this.displayAddEditModal = !isClosed;
  }

  saveorUpdateUser(newData: any){
    if(this.selectedUser && newData.id === this.selectedUser.id){
      const userIndex = this.users.findIndex(data => data.id === newData.id);
      this.users[userIndex] = newData;
    } else{
      this.users.unshift(newData);

    }
    // this.getUsersList();
  }

  showEditModal(users: Users){
    this.displayAddEditModal = true;
    this.selectedUser =  users
  }

  deleteUser(users: Users){
    this.confirmationService.confirm({
      message: 'Are you sure that you want to delete this user?',
      header: 'Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(users.id).subscribe({
          next: (res) =>{
            // this.getUsersList();
            this.users = this.users.filter(data => data.id !== users.id);
            this.messageService.add({severity:'success', summary:'Success', detail: 'Deleted sucessfully'});
          },
          error: (err) =>{
            this.messageService.add({severity:'error', summary:'Error', detail: err});
          }
        })
      }
  });
  }

  ngOnDestroy(): void{
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }
}
