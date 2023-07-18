import { Form, FormInput, FormLabel } from "@wasp/auth/forms/internal/Form";
import logo from "./static/zai_logo2023_wht_600px_trans.png";

function ResetPasswordPage() {
  const appearance = {
    colors: {
      brand: "#07223D", // blue
      brandAccent: "#B5D3E7", // pink
      submitButtonText: "white",
    },
  };

  return (
    <main className="bg-primary w-full h-full flex flex-col justify-start items-center gap-8 pt-8">
      <img src={logo} />
      <div className="bg-secondary h-[2px] w-full"></div>
      <h1 className="text-secondary text-4xl ">Reset Password</h1>
      <div className="text-neutral card bg-secondary p-10">
        <Form>
          <FormLabel>New Password</FormLabel>
          <FormInput />
        </Form>
      </div>
    </main>
  );
}

export default ResetPasswordPage;
