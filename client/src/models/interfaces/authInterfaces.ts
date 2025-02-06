export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    phone: string;
    profileImage: string;
    role: string;
    createdAt: string;
  };
}
