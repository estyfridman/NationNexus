import axios from "axios";

export const client = axios.create({
    baseURL : 'http://localhost:8000/countries',
    headers: {
        'Content-Type': 'application/json'
    }
})