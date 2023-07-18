import { UpdatePassword } from "@wasp/actions/types";
import HttpError from "@wasp/core/HttpError.js";
import { User } from "@wasp/entities";

type CreateUserArgs = Pick<User, "username" | "password">;

// export const createUser: CreateUser<CreateUserArgs, User> = (
//   { username },
//   context
// ) => {
//   if (!context.user) {
//     throw new HttpError(401);
//   }

//   return context.entities.User.create({
//     data: { username, password: "zanthic", isAdmin: false },
//   });
// };

type UpdatePasswordArgs = Pick<User, "id" | "password">;

export const updatePassword: UpdatePassword<UpdatePasswordArgs, User> = async (
  { id, password },
  context
) => {
  return context.entities.User.update({
    where: { id },
    data: { password },
  });
};
