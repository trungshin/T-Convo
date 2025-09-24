"use client";
import React, { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { authActions } from "@/store/authSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormData, SignUpSchema } from "@/types/auth";
import FormField from "@/components/FormField";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import HideShowPassword from "@/components/HideShowPass";
import { toast } from "sonner";

export default function Register() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignUpSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (registrationData: FormData) => {
    try {
      const response = await api.post("/auth/register", registrationData);
      const { accessToken, user } = response.data;
      dispatch(authActions.setAccessToken(accessToken));
      dispatch(authActions.setUser(user));
      toast.success("Registration successful! Please log in to your account.");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const goToLogin = () => router.push("/login");

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "var(--bg)" }}
    >
      <div className="w-full max-w-md">
        <Card className="card w-full">
          <CardHeader className="text-center">
            <CardTitle
              className="text-lg font-extrabold"
              style={{ color: "var(--text)" }}
            >
              Sign up to see convos from your friends
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
              <div>
                <FormField
                  type="text"
                  className="input w-full"
                  placeholder="Username"
                  register={register}
                  error={errors.username}
                  name="username"
                />
              </div>
              <div>
                <FormField
                  type="email"
                  className="input w-full"
                  placeholder="Email address"
                  register={register}
                  error={errors.email}
                  name="email"
                />
              </div>
              <div className="relative">
                <FormField
                  type={showPassword ? "password" : "text"}
                  className="input w-full"
                  placeholder="Password"
                  register={register}
                  error={errors.password}
                  name="password"
                />
                <HideShowPassword
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full rounded-xl bg-white text-black py-3 font-medium hover:opacity-95 transition cursor-pointer"
                >
                  Create account
                </Button>
              </div>
              <div className="text-center">
                Have an account?{" "}
                <span
                  onClick={goToLogin}
                  className="text-blue-500 hover:underline cursor-pointer"
                >
                  Log in
                </span>
              </div>
            </form>
          </CardContent>

          <CardFooter className="p-4 justify-center">
            <div className="text-xs text-muted">
              By continuing, you agree to our Terms & Privacy Policy.
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
