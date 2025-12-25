import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase/firebase.init";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();



  const onSubmit = async (data) => {
     // make sure this is inside your component

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Save user to backend using axiosSecure
      await axiosSecure.post("/api/users", {
        uid: user.uid,
        name: "", // optional
        email: user.email,
        role: "user", // default role
      });

      navigate("/login"); // redirect to login page
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-xl">
        <div className="card-body gap-4">
          <h2 className="text-2xl font-bold text-center">Register</h2>

          {/* Email Input */}
          <div className="form-control w-full">
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-error text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input with Eye Toggle */}
          <div className="form-control w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered w-full pr-12"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm opacity-70"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Optional: Confirm Password */}
          <div className="form-control w-full relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="input input-bordered w-full pr-12"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === (document.querySelector('input[name="password"]')?.value || "")
                  || "Passwords do not match",
              })}
            />
          </div>

          {/* Display Firebase errors */}
          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          {/* Register Button */}
          <button
            onClick={handleSubmit(onSubmit)}
            className="btn btn-primary w-full"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
