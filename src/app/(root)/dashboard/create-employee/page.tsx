import CreateEmployee from "@/components/forms/CreateEmployee";

const Page = () => {
  return (
    <section className="container mt-5 mb-10">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl mb-2">Onboard a new Employee</h2>
        <CreateEmployee />
      </div>
    </section>
  );
};

export default Page;
