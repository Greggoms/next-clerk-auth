import { fetchEmployees } from "@/lib/actions/user.actions";
import Link from "next/link";

const Page = async () => {
  const result = await fetchEmployees(1, 30);
  // console.log(result);

  return (
    <section className="container mt-5 mb-10">
      <div className="flex gap-5">
        <div>
          <Link href="/dashboard/create-employee" className="link">
            Onboard New Employee
          </Link>
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
