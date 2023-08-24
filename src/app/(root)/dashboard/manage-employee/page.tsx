import ManageEmployeeForm from "@/components/forms/ManageEmployee";

const Page = () => {
  return (
    <section className="container mt-5 mb-10">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl mb-2">Onboard New Employee</h2>
        <ManageEmployeeForm />
      </div>
    </section>
  );
};

export default Page;
