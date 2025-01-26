import { client } from "../api/client";
import { ICountry, ICountryUpdate } from '../models/iCountry';


export async function getAllCountries(): Promise<ICountry[]>{
    try {
        const response = await client.get("/api/countries");
        return  response.data;
    } catch (error) {
        console.error("Error fetching countries:", error);
        throw error;
    }
}

export async function getCountryById(id: string): Promise<ICountry> {
    try {
      const response = await client.post("/api/countries/findById", { id });
      return response.data.documents;
    } catch (error) {
      console.error("Error fetching countries by ID:", error);
      throw error;
    }
};

export async function updateCountry({ id, updatedData }: { id: string; updatedData: ICountryUpdate }): Promise<ICountry>{
    try {
        const response = await client.post(`/api/countries/${id}`, updatedData);
        return response.data; 
    } catch (error) {
        console.error("Error updating the Country:", error);
        throw error; 
    }
}

export async function createCountry(newCountry: ICountry): Promise<ICountry> {
    try {
      const response = await client.post("/api/countries", newCountry);
      return response.data;
    } catch (error) {
      console.error("Error creating country:", error);
      throw error;
    }
  }
  
  export async function deleteCountry(id: string): Promise<void> {
    try {
      await client.delete(`/api/countries/${id}`);
    } catch (error) {
      console.error("Error deleting country:", error);
      throw error;
    }
  }