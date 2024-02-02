import { Component, EventEmitter, Input, Output, OnChanges, OnInit } from '@angular/core';


// PrimeNg
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { UserService } from '../../service/users.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { error } from 'console';

@Component({
  selector: 'app-add-edit-user',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule
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
  typeUser: any [] = [];

  userForm = this.fb.group({
    name: ["", Validators.required],
    email: ["", Validators.required],
    typeUser: ["", Validators.required]
  })
  
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private http: HttpClient){}

  ngOnInit():void{
    this.fetchDataFromApi();
  }

  fetchDataFromApi(){
    this.http.get<any[]>('http://localhost:3000/users').subscribe({
      next: (res) => {
        this.typeUser = res;
      },
      error: (err) => {
        console.log('Erro ao buscar dados da Api', err);
      }
    })
  }

  ngOnChanges():void{
    if(this.selectedUser) {
      this.modalType = 'Editar';
      this.userForm.patchValue(this.selectedUser);
    } else{
      this.userForm.reset();
      this.modalType = 'Adicionar';
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
        this.messageService.add({severity:'danger', summary:'Success', detail: msg});
      },
      error: (err) =>{
        this.messageService.add({severity:'success', summary: 'Error', detail: err});
        console.log('error occured');
      }
    })
  }

}
