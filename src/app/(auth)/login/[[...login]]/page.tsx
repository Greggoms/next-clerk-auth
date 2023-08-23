import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="container mt-5 mb-10">
      <div className="flex justify-center">
        <SignIn />
      </div>
    </section>
  );
}
