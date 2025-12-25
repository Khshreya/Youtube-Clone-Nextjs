import RegisterForm from "@/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-900 p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Register</h1>

      <RegisterForm />

      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
}
