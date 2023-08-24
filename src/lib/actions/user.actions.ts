"use server";

import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs";

export async function fetchMe() {
  const { userId }: { userId: string | null } = auth();

  if (!userId) throw new Error("Could not fetch profile. No user found.");

  connectToDB();
  const currentUser = await User.findOne({ authId: userId });

  if (!currentUser)
    throw new Error("Could not fetch profile. No document found.");

  return currentUser;
}

export async function manageEmployee(
  data: ManageEmployeeFormValues,
  path: string,
  userId: string
): Promise<void> {
  connectToDB();

  try {
    const conflictUser = await User.findOne({ authId: data.authId });
    if (!userId && conflictUser) {
      throw new Error(
        `The provided User ID is already taken!\n"${data.authId}"`
      );
    }

    await User.findOneAndUpdate(
      { authId: data.authId },
      {
        authId: data.authId,
        name: data.name,
        email: data.email,
        role: data.role,
      },
      { upsert: true }
    );

    if (path.startsWith("/dashboard/manage-employee")) {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to onboard employee...\n${error.message}`);
  }
}

export async function fetchEmployee(userId: string | null) {
  if (!userId) throw new Error("Could not fetch employee. No user found.");

  connectToDB();
  const userToManage = await User.findById(userId);

  if (!userToManage)
    throw new Error("Could not fetch employee. No document found.");

  // console.log("userToManage");
  // console.log(userToManage);

  /**
   * I get a lot of these warnings when trying to just `return userToManage;`.
   * The warnings only left when I manually converted every value I want to pass.
   * This concerns me for when I have much more data to return later on...
   * The weird thing is the userToManage object looks exactly like the one I converted it to.
   * I've learned to never spread `{...userToManage, _id:userToManage._id.toString()}`
   * mongoose objects becase it spreads a lot more data than expected and totally restructures
   * the data within.
   *
   * Warning: Only plain objects can be passed to Client Components from Server Components.
   * Objects with toJSON methods are not supported. Convert it manually to a simple value
   * before passing it to props.
   * {onboarded: false, _id: {}, email: ..., name: ..., role: ..., authId: ...}
   *                         ^^
   *         (complaining about the _id property?)
   */

  return {
    _id: userToManage._id.toString(),
    authId: userToManage.authId,
    email: userToManage.email,
    name: userToManage.name,
    role: userToManage.role,
    onboarded: userToManage.onboarded,
  };
}

export async function fetchEmployees(pageNumber = 1, pageSize = 20) {
  connectToDB();

  const skipAmount = (pageNumber - 1) * pageSize;

  const employeesQuery = User.find({}).skip(skipAmount).limit(pageSize);

  const employeesCount = await User.countDocuments({});

  const employees = await employeesQuery.exec();

  const isNext = employeesCount > skipAmount + employees.length;

  return { employees, isNext };
}
