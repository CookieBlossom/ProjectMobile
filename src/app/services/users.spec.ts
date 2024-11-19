import { Users } from './users';

describe('Users', () => {
  it('should create an instance', () => {
    const mockUser = new Users(
      '12345678-9', // rut
      'John Doe', // name
      'path/to/image.jpg', // imageuser
      'Male', // genderuser
      'john.doe@example.com', // email
      'password123', // password
      123456789, // phone
      1 // idrol
    );
    expect(mockUser).toBeTruthy();
  });
});
