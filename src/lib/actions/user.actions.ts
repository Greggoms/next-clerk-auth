"use server";

import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";

interface Params {
  authId: string;
  name: string;
  email: string;
  role: string;
  path: string;
}

export async function createEmployee(data: Params): Promise<void> {
  connectToDB();

  try {
    const conflictUser = await User.findOne({ authId: data.authId });
    if (conflictUser) {
      console.error("User already exists!");
      throw new Error("User already exists!");
    }

    await User.create({
      authId: data.authId,
      name: data.name,
      email: data.email,
      role: data.role,
    });

    if (data.path === "/dashboard/create-employee") {
      revalidatePath(data.path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create employee... ${error.message}`);
  }
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
