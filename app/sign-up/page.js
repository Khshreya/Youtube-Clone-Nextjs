"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <SignUp
        routing="hash"
        signInUrl="/sign-in"
        afterSignUpUrl="/auth/sync"
      />
    </div>
  );
}
