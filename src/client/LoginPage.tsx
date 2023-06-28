import { Link } from "react-router-dom";
import { LoginForm } from "@wasp/auth/forms/Login";

export function LoginPage() {
  return (
    <main>
      <h1>Login</h1>
      <LoginForm />
    </main>
  );
}
