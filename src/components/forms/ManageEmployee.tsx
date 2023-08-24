"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { fetchEmployee, manageEmployee } from "@/lib/actions/user.actions";
import { manageUserFormSchema } from "@/lib/validations/manage-user-form";

interface Props {
  userId?: string;
}

const ManageEmployeeForm = ({ userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const [backendError, setBackendError] = useState("");
  const [isSafeToReset, setIsSafeToReset] = useState(false);
  const [defaultValues, setDefaultValues] = useState({
    authId: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (isSafeToReset) {
      reset(defaultValues);
      setBackendError("");
      setIsSafeToReset(false);
      return;
    }
    // eslint-disable-next-line
  }, [isSafeToReset]);

  /**
   * For some reason typescript throws an error under each error message.
   *
   * <p className="form_error">{errors.authId.message}</p>
   *                           ^^^^^^^^^^^^^^^^^^^^^^
   * Type 'FieldError' is not assignable to type 'string' - type checking error in 7.33.0
   * https://github.com/orgs/react-hook-form/discussions/8915
   *
   * This is caused by trying to set the defaultValues conditionally
   * based on the existence of a provided userId prop.
   * The data takes a second to load in, but the error messages work just fine.
   *
   * Fixed by changing them to: {errors.authId.message as string}
   *                                                   ^^^^^^^^^
   */
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(manageUserFormSchema),
    defaultValues: userId
      ? async () => {
          const employee = await fetchEmployee(userId);
          setDefaultValues(employee);
          return employee;
        }
      : defaultValues,
  });

  const onSubmit: SubmitHandler<ManageEmployeeFormValues> = async (data) => {
    // console.log(data);
    setBackendError("");

    if (!isDirty) {
      toast("No values modified");
      return router.push("/dashboard");
    }

    try {
      await manageEmployee(data, pathname, userId as string);
      toast.success("Employee managed!");

      if (pathname.startsWith("/dashboard/manage-employee")) {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      console.error(error);
      setBackendError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {backendError && (
        <div className="dark:bg-red-400/70 py-2 px-3 rounded-md my-2">
          <p className="whitespace-pre-line">{backendError}</p>
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
            <p className="form_error">{errors.authId.message as string}</p>
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
            <p className="form_error">{errors.email.message as string}</p>
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
            <p className="form_error">{errors.name.message as string}</p>
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
            <p className="form_error">{errors.role.message as string}</p>
          )}
        </div>

        <div className="flex gap-5">
          <button
            type="submit"
            className="flex-1 dark:bg-sky-600 py-1 px-2 rounded-md"
          >
            Submit
          </button>
          <button type="button" onClick={() => setIsSafeToReset(true)}>
            Reset
          </button>
        </div>
      </div>
    </form>
  );
};

export default ManageEmployeeForm;
