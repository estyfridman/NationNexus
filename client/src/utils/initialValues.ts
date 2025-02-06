export const initialUser = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  profileImage: null as File | null,
  role: 'guest' as 'admin' | 'user' | 'guest',
  createdAt: new Date(),
};
