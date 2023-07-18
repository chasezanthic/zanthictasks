import { FormInput, FormLabel } from "@wasp/auth/forms/internal/Form";
import useAuth from "@wasp/auth/useAuth";
import updatePassword from "@wasp/actions/updatePassword";
import React from "react";

export const ChangePasswordModal = () => {
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmNewPassword, setConfirmNewPassword] = React.useState("");

  const { data: user } = useAuth();

  const validForm =
    user &&
    newPassword &&
    confirmNewPassword &&
    newPassword === confirmNewPassword &&
    newPassword.length > 7;

  const tryUpdatePassword = async () => {
    if (validForm) {
      await updatePassword({ id: user?.id, password: newPassword });
    }
  };

  return (
    <form method="dialog" className="modal-box bg-secondary">
      <h3 className="font-bold text-lg">Reset Password</h3>
      <div className="w-full flex flex-col justify-end gap-5 mt-5">
        <div>
          <FormLabel>New password</FormLabel>
          <FormInput
            type="password"
            value={newPassword}
            onChange={async (e) => await setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <FormLabel>Confirm new password</FormLabel>
          <FormInput
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        {!validForm && <span>Password must be at least 8 characters</span>}
        <div className="w-full flex gap-5">
          <button
            disabled={!validForm}
            className="btn btn-info flex-1 disabled:text-neutral disabled:opacity-50"
            onClick={(e) => tryUpdatePassword()}
          >
            Confirm
          </button>
          <button className="btn flex-1">Cancel</button>
        </div>
      </div>
    </form>
  );
};
