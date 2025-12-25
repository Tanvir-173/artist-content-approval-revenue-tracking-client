import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
});

const useAxiosSecure = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // request interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use((config) => {
      // If you have a token later, you can add it here
      const token = localStorage.getItem("token");
      if (token) {
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
  }, [navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
