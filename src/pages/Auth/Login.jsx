import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { loginUser } from "../../firebase/auth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const userCredential = await loginUser(data.email, data.password);
      const user = userCredential.user;

      // Save user to backend using axiosSecure
      await axiosSecure.post("/api/users", {
        uid: user.uid,
        name: user.displayName || "",
        email: user.email,
        role: "user",
      });

      toast.success("Logged in successfully!");
      navigate("/"); // redirect after login
    } catch (error) {
      console.error("Login failed:", error.message);
      toast.error(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <h2 className="text-2xl font-bold text-center">Login</h2>

          {/* Email */}
          <div className="form-control w-full">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && <p className="text-error text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="form-control w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full pr-12"
              {...register("password", { required: "Password is required" })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-70"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && <p className="text-error text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Login Button */}
          <button onClick={handleSubmit(onSubmit)} className="btn btn-primary w-full">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
