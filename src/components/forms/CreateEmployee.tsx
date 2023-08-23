"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createEmployee } from "@/lib/actions/user.actions";
import { toast } from "react-hot-toast";

type FormValues = {
  authId: string;
  name: string;
  email: string;
  role: string;
};

const formSchema = z.object({
  authId: z.string().min(1, {
    message: "Required. Find it here: https://dashboard.clerk.com/",
  }),
  name: z.string().min(3, { message: "Minimum 3 characters." }),
  email: z.string().email(),
  role: z.string().min(1, { message: "Required." }),
});

const CreateEmployeeForm = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [backendError, setBackendError] = useState("");

  const defaultValues = {
    authId: "",
    name: "",
    email: "",
    role: "",
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // console.log(data);
    setBackendError("");
    try {
      await createEmployee({ ...data, path: pathname });
      toast.success("Employee created!");

      if (pathname === "/dashboard/create-employee") {
        router.back();
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
      setBackendError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {backendError && (
        <div className="dark:bg-red-400 py-2 px-3 rounded-md my-2">
          <p>{backendError}</p>
        </div>
      )}
      <div className="flex flex-col gap-8">
        <div className="form_group">
          <label htmlFor="authId">Clerk User ID</label>
          <input
            id="authId"
            {...register("authId")}
            className={`p-2 outline-none focus:dark:outline-sky-700 ${
              errors.authId && "dark:outline-red-700"
            }`}
          />
          {errors.authId?.message && (
            <p className="form_error">{errors.authId.message}</p>
          )}
        </div>
        <div className="form_group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`p-2 outline-none focus:dark:outline-sky-700 ${
              errors.email && "dark:outline-red-700"
            }`}
          />
          {errors.email?.message && (
            <p className="form_error">{errors.email.message}</p>
          )}
        </div>
        <div className="form_group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            {...register("name")}
            className={`p-2 outline-none focus:dark:outline-sky-700 ${
              errors.name && "dark:outline-red-700"
            }`}
          />
          {errors.name?.message && (
            <p className="form_error">{errors.name.message}</p>
          )}
        </div>
        <div className="form_group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            {...register("role")}
            className={`p-2 outline-none focus:dark:outline-sky-700 ${
              errors.role && "dark:outline-red-700"
            }`}
          >
            <option value="">--Please select a role--</option>
            <option value="default">Default</option>
            <option value="admin">Admin</option>
            <option value="developer">Developer</option>
          </select>
          {errors.role?.message && (
            <p className="form_error">{errors.role.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="dark:bg-sky-600 py-1 px-2 rounded-md self-start"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default CreateEmployeeForm;
