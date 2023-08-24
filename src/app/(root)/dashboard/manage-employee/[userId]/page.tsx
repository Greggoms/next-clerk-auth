import ManageEmployeeForm from "@/components/forms/ManageEmployee";

const Page = ({ params: { userId } }: { params: { userId: string } }) => {
  return (
    <section className="container mt-5 mb-10">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl mb-2">Manage Employee</h2>
        <ManageEmployeeForm userId={userId} />
      </div>
    </section>
  );
};

export default Page;
