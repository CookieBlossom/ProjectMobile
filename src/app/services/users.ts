export class Users {
  rut!: string;
  name!: string;
  imageuser!: any;
  genderuser!: string;
  email!: string;
  password!: string;
  phone!: number;
  idrol!: number;
  constructor(
    rut: string,
    name: string,
    imageuser: any,
    genderuser: string,
    email: string,
    password: string,
    phone: number,
    idrol: number){
    this.rut = rut;
    this.name = name;
    this.imageuser = imageuser;
    this.genderuser = genderuser;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.idrol = idrol;
  }
}
