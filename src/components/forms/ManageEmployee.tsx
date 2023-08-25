"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import Select, { MultiValue, SingleValue } from "react-select";

import { fetchEmployee, manageEmployee } from "@/lib/actions/user.actions";
import { manageUserFormSchema } from "@/lib/validations/manage-user-form";
import { roles } from "@/lib/constants";

interface Props {
  userId?: string;
}

interface IRoleOptions {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  options: [{ label: string; value: string }];
  value: string[] | string;
  onChange: Function;
  isMulti: boolean;
  isError: boolean;
  placeholder: string;
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
    control,
    formState: { errors, isDirty },
  } = useForm<ManageEmployeeFormValues>({
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

  const roleOptions: IRoleOptions[] = roles.map((role) => {
    return { value: role, label: role };
  });

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
          <label htmlFor="name">Full Name</label>
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
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value, ref } }) => {
              const currentSelection = roleOptions.find(
                (c) => c.value === value
              );

              const handleSelectChange = (
                selectedOption: MultiValue<IRoleOptions> | null
              ) => {
                console.log(selectedOption);
                onChange(selectedOption?.values);
              };

              return (
                <CustomSelect
                  id="role"
                  placeholder="--Select Role--"
                  options={roleOptions}
                  value={currentSelection}
                  isMulti
                  onChange={handleSelectChange}
                />

                // // Define each at a time if I can't figure out the typescript..
                // // This has the downfall of repeating the same custom classeNames
                // // on every Select input.
                // // I think the error only occurs when attempting to configure isMulti.
                // <Select
                //   ref={ref}
                //   id="role"
                //   placeholder="--Select Role--"
                //   options={roleOptions}
                //   value={currentSelection}
                //   onChange={handleSelectChange}
                //   unstyled
                //   // https://react-select.com/styles#inner-components
                //   classNames={{
                //     container: () =>
                //       `${errors.role && "outline outline-1 outline-red-600"}`,
                //     valueContainer: () => "flex flex-col",
                //     multiValue: () => "self-start",
                //     multiValueRemove: () =>
                //       "text-amber-500 hover:bg-amber-500/50",
                //     control: () => "px-2 bg-neutral-50 dark:bg-neutral-700",
                //     indicatorSeparator: () => "bg-neutral-500 mx-2",
                //     menu: () => "bg-neutral-200 dark:bg-neutral-800",
                //     input: () => "self-start",
                //     option: ({ data, isDisabled, isFocused, isSelected }) =>
                //       `p-2 hover:bg-neutral-300 dark:hover:bg-neutral-500 ${
                //         isFocused ? "bg-neutral-300 dark:bg-neutral-500" : ""
                //       }`,
                //   }}
                // />
              );
            }}
          />

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

function CustomSelect({
  id,
  options,
  value,
  onChange,
  isMulti,
  isError,
  placeholder,
}: SelectProps) {
  return (
    <Select
      id={id}
      options={options}
      value={
        isMulti
          ? options.filter((el) => value?.includes(el.value))
          : options.find((c) => c.value === value)
      }
      onChange={(val) =>
        isMulti && Array.isArray(val)
          ? onChange(val.map((c) => c.value))
          : onChange(val)
      }
      isMulti={isMulti}
      placeholder={placeholder}
      unstyled
      // https://react-select.com/styles#inner-components
      classNames={{
        container: () => `${isError && "outline outline-1 outline-red-600"}`,
        valueContainer: () => "flex flex-col",
        multiValue: () => "self-start",
        multiValueRemove: () => "text-amber-500 hover:bg-amber-500/50",
        control: () => "px-2 bg-neutral-50 dark:bg-neutral-700",
        indicatorSeparator: () => "bg-neutral-500 mx-2",
        menu: () => "bg-neutral-200 dark:bg-neutral-800",
        input: () => "self-start",
        option: ({ data, isDisabled, isFocused, isSelected }) =>
          `p-2 hover:bg-neutral-300 dark:hover:bg-neutral-500 ${
            isFocused ? "bg-neutral-300 dark:bg-neutral-500" : ""
          }`,
      }}
    />
  );
}
