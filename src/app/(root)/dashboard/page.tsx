import { fetchEmployees } from "@/lib/actions/user.actions";
import Link from "next/link";

const Page = async () => {
  const result = await fetchEmployees(1, 30);

  return (
    <section className="container mt-5 mb-10">
      <div className="flex gap-5">
        <div>
          <ul>
            <li>
              <Link href="/dashboard/manage-employee" className="link">
                Onboard New Employee
              </Link>
            </li>
          </ul>
        </div>

        <div>
          {result.employees.length < 1 ? (
            <p>No Employees Found.</p>
          ) : (
            <ul className="flex flex-col gap-5">
              {result.employees.map((employee) => (
                <li key={employee._id}>
                  <h3 className="text-xl">{employee.name}</h3>
                  <p className="dark:text-neutral-400">{employee.email}</p>
                  <p className="dark:text-neutral-400">{employee.role}</p>
                  <Link href={`/dashboard/manage-employee/${employee._id}`}>
                    Manage
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;
