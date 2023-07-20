import { LoginForm } from "@wasp/auth/forms/Login";
import logo from "./static/zai_logo2023_wht_600px_trans.png";

export function LoginPage() {
  const appearance = {
    colors: {
      brand: "#07223D", // blue
      brandAccent: "#B5D3E7", // pink
      submitButtonText: "white",
    },
  };

  return (
    <main className="bg-primary w-full h-full flex flex-col justify-start items-center gap-8 pt-8">
      <img src={logo} className="w-80" />
      <div className="bg-secondary h-[2px] w-full"></div>
      <h1 className="text-secondary text-4xl ">Project Manager</h1>
      <div className="text-neutral card bg-secondary p-10">
        <LoginForm appearance={appearance} />
      </div>
    </main>
  );
}
