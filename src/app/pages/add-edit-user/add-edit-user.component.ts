import { Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';


// PrimeNg
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserService } from '../../service/users.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-add-edit-user',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule
  ],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.scss'
})
export class AddEditUserComponent implements OnInit, OnChanges{

  @Input() displayAddEditModal: boolean = true;
  @Input() selectedUser: any = null;
  @Output() clickClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() clickAddEdit: EventEmitter<any> = new EventEmitter<any>();
  modalType = "Add";

  userForm = this.fb.group({
    title: ["", Validators.required],
    category: ["", Validators.required],
  })
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService){}

  ngOnInit():void{

  }

  ngOnChanges():void{
    if(this.selectedUser) {
      this.modalType = 'Edit';
      this.userForm.patchValue(this.selectedUser);
    } else{
      this.userForm.reset();
      this.modalType = 'Add';
    }
  }

  showAdd(){
    this.displayAddEditModal = true;
  }

  closeModal(){
    this.userForm.reset();
    this.clickClose.emit(true);
  }


  addEditUser(){
    this.userService.addEditUser(this.userForm.value, this.selectedUser).subscribe({
      next: (res) => {
        this.clickAddEdit.emit(res);
        this.closeModal();
        const msg = this.modalType == 'Add' ? 'User Added' : 'User updated';
        this.messageService.add({severity:'success', summary:'Success', detail: msg});
      },
      error: (err) =>{
        this.messageService.add({severity:'error', summary: 'Error', detail: err});
        console.log('error occured');
      }
    })
  }

}
