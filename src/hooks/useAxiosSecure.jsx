// src/hooks/useAxiosSecure.js
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    // request interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use(async (config) => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // response interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const statusCode = error.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          // redirect to login if unauthorized
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [navigate, auth]);

  return axiosSecure;
};

export default useAxiosSecure;
