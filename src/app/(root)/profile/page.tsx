import { fetchMe } from "@/lib/actions/user.actions";

const Page = async () => {
  const currentUser = await fetchMe();

  return (
    <section className="container mt-5 mb-10">
      <h2>Profile</h2>
      <pre>{JSON.stringify(currentUser, null, 2)}</pre>
    </section>
  );
};

export default Page;
