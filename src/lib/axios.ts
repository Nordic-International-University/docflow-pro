import axios, { type AxiosInstance } from "axios";

const ApiInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

export { ApiInstance };
