// app/register/page.tsx
import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-900 p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        Register
      </h1>

      <RegisterForm />

      <p className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}
