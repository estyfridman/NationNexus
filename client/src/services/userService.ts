import { client } from "../api/client";
import IUser, { IUserUpdate } from "../models/iUser";

export const getAllUsers = async () => {
    try {
    const response = await client.get<IUser[]>('/users');
    return response.data;
} catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}

export const registerUser = async (userData: IUser) => {
    try {
        const response = await client.post('/register', userData);
        return response.data;
      } catch (error) {
        console.error('Error registering user:', error);
        throw error;
      }
  };
  
  export const loginUser = async (credentials: { username: string, password: string }) => {
    try {
        const response = await client.post('/login', credentials);
        return response.data;
      } catch (error) {
        console.error('Error logging in:', error);
        throw error;
      }
  };
  
  export const updateUser = async ({ id, updatedData }: { id: string; updatedData: IUserUpdate }) => {
    try {
        const response = await client.put(`/update-user/${id}`, updatedData);
        return response.data;
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
  };
  
  export const requestPermission = async (role: 'admin' | 'user' | 'guest') => {
    try {
        const response = await client.post('/request-permission', { role });
        return response.data;
      } catch (error) {
        console.error('Error requesting permission:', error);
        throw error;
      }
  };
  
  export const grantPermission = async ({ userId, role }: { userId: string; role: 'admin' | 'user' | 'guest' }) => {
    try {
        const response = await client.patch(`/users/permission/${userId}`, role);
        return { userId, updatedUser: response.data };
    } catch (error) {
        console.error("Error granting permission:", error);
        throw error;
    }
  };
  
  export async function deleteUser(id: string): Promise<any> {
    try {
      const response = await client.delete(`/users/${id}`);
      console.log(response)
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }