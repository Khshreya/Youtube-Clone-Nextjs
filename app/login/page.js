import LoginForm from "@/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 bg-white dark:bg-gray-900 p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>

      <LoginForm />

      <p className="mt-4 text-sm text-center">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
}