import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-adminusers',
  templateUrl: './adminusers.component.html',
  styleUrls: ['./adminusers.component.css']
})
export class AdminusersComponent {
  public name: string;
  public surname: string;
  public number: number|undefined;
  public email: string;
  public gender: string;
  public password: string;
  public confirm_pass: string;
  public document_type: string;
  public rol: string;
  public document: number|undefined;
  public birthdate: string;
  public usuarios: Iterable<any> | null | undefined;

  constructor(private router: Router, private http: HttpClient){
    this.name = '';
    this.surname = '';
    this.number = undefined;
    this.email = '';
    this.gender = 'Masculino';
    this.password = '';
    this.confirm_pass= '';
    this.document_type = 'Cédula de Ciudadanía';
    this.document = undefined;
    this.birthdate = '';
    this.rol = 'Cliente';
    this.usuarios = undefined;
  }

  ngOnInit() {
    this.loadUserList();
  }

  public loadUserList(){
    const url = 'http://localhost:3005/api/user/list';
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    });

    this.http.get(url, { headers }).subscribe((data) => {
      this.usuarios = data as Iterable<any>;
      console.log(this.usuarios);

    });

  }

  public changeOption(option: number){
    const div_create = document.querySelector('#create-user') as HTMLElement;
    const div_list = document.querySelector('#table-list') as HTMLElement;
    if(option==0){
      div_create.style.display = 'block';
      div_list.style.display = 'none';
    }else{
      div_create.style.display = 'none';
      div_list.style.display = 'block';
    }
  }

  changeGender(value:string): void {
		this.gender = value;
	}

  changeRol(value:string): void {
		this.rol = value;
	}

  changeDocType(value:string): void {
		this.document_type = value;
	}

  public httpPostRequest(){
    const url = 'http://localhost:3005/api/user/register';
    const data = {
      nombres: this.name,
      apellidos: this.surname,
      fecha_nacimiento: this.birthdate,
      email: this.email,
      genero: this.gender,
      tipo_documento: this.document_type,
      identificacion: this.document,
      telefono: this.number,
      rol: this.rol,
      password: this.password
    };

    if(data.tipo_documento == 'Cédula de Ciudadanía'){
      data.tipo_documento = 'C.C';
    }else if(data.tipo_documento == 'Tarjeta de Identidad'){
      data.tipo_documento = 'T.I';
    }else{
      data.tipo_documento = 'C.E';
    }
    this.http.post(url, data).subscribe(response => {
      if('message' in response){
        if(response.message == '0'){
          this.cleanData();
          this.changeOption(1);
        }else if(response.message == '1'){
          alert("El email ya se encuentra registrado");
        }else{
          alert("Error");
        }
      }
    });
  }

  public cleanData(){
    this.name = '';
    this.surname = '';
    this.number = undefined;
    this.email = '';
    this.gender = 'Masculino';
    this.password = '';
    this.confirm_pass= '';
    this.document_type = 'Cédula de Ciudadanía';
    this.document = undefined;
    this.birthdate = '';
    this.rol = 'Cliente';
  }

  public registerUser() {
    this.validations();
  }

  public validations(){
    const v_email = this.validationEmail();
    const v_pass = this.validationPass();
    const v_birthdate = this.validationBirthdate();
    const v_data_empty = this.validateInputs();
    if(v_email && v_pass && v_birthdate && v_data_empty){
      this.httpPostRequest();
    }
  }

  public validateInputs(){
    const warn_name = document.querySelector('.warn_name') as HTMLElement;
    const warn_surname = document.querySelector('.warn_surname') as HTMLElement;
    const warn_phone = document.querySelector('.warn_phone') as HTMLElement;
    const warn_doc = document.querySelector('.warn_doc') as HTMLElement;
    if(this.name == ''){
      warn_name.style.display = 'flex';
    }else{
      warn_name.style.display = 'none';
      if(this.surname == ''){
        warn_surname.style.display = 'flex';
      }else{
        warn_surname.style.display = 'none';
        if(this.number == undefined){
          warn_phone.style.display = 'flex';
        }else{
          warn_phone.style.display = 'none';
          if(this.document == undefined){
            warn_doc.style.display = 'flex';
          }else{
            warn_doc.style.display = 'none';
            return true;
          }
        }
      }
    }
    return false;
  }

  public validationBirthdate(){
    const warn_birth = document.querySelector('.warn_birth') as HTMLElement;
    const warn_birth_more = document.querySelector('.warn_birth_more') as HTMLElement;
    if(this.birthdate == ''){
      warn_birth.style.display = 'flex';
      return false;
    }else{
      warn_birth.style.display = 'none';
      const actualDate: Date = new Date();
      actualDate.setFullYear(actualDate.getFullYear() - 16 );
      if(new Date(this.birthdate).getTime() <= actualDate.getTime()){
        warn_birth_more.style.display = 'none';
        return true;
      }else{
        warn_birth_more.style.display = 'flex';
      }
    }
    return false;
  }

  public validationEmail(){
    const warn_email = document.querySelector('.warn_email') as HTMLElement;
    const email_test = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email_test.test(this.email)){
      warn_email.style.display = 'none';
      return true;
    }else{
      warn_email.style.display = 'flex';
      return false;
    }
  }

  public validationPass(){
    const warn_pass = document.querySelector('.warn_pass') as HTMLElement;
    const warn_con_pass = document.querySelector('.warn_con_pass') as HTMLElement;
    if(this.password.length < 8){
      warn_pass.style.display = 'flex';
    }else{
      warn_pass.style.display = 'none';
      if(this.password != this.confirm_pass){
        warn_con_pass.style.display = 'flex';
      }else{
        warn_con_pass.style.display = 'none';
        return true;
      }
    }
    return false;
  }

}
