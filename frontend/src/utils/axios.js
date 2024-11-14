import axios from "axios";

export const generalAxios = axios.create({
  baseURL: "/",
});

export const apiAxios = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
