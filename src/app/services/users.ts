export class Users {
  rut!: string;
  firstname!: string;
  secondname!: string;
  firstlastname!: string;
  secondlastname!: string;
  imageuser!: any;
  genderuser!: string;
  email!: string;
  password!: string;
  phone!: number;
  idrol!: number;
  constructor(
    rut: string,
    firstname: string,
    secondname: string,
    firstlastname: string,
    secondlastname: string,
    imageuser: any,
    genderuser: string,
    email: string,
    password: string,
    phone: number,
    idrol: number){
    this.rut = rut;
    this.firstname = firstname;
    this.secondname = secondname;
    this.firstlastname = firstlastname;
    this.secondlastname = secondlastname;
    this.imageuser = imageuser;
    this.genderuser = genderuser;
    this.email = email;
    this.password = password;
    this.phone = phone;
    this.idrol = idrol;
  }
}
