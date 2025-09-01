import { FieldError, UseFormRegister } from "react-hook-form";
 import { z, ZodType } from "zod";


export const LoginSchema: ZodType<FormData> = z.object({
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Please enter your password' })
});

export const SignUpSchema: ZodType<FormData> = z.object({
  username: z.string().min(2, { message: 'Please enter a valid username' }).max(100),
  email: z.string().email({ message: 'Please enter a valid email' }),
  password: z.string().min(6, { message: 'Please enter your password' }),
});

export type FormData = {
    email: string;
    password: string;
    username?: string;
  };

  export type FormFieldProps = {
    type: string;
    placeholder: string;
    name: ValidFieldNames;
    register: UseFormRegister<FormData>;
    error: FieldError | undefined;
    className?: string;
  };


  export type ValidFieldNames =
  | "email"
  | "password"
  | "username"