import AppError from "./AppError";

export default class AuthError extends AppError {
  constructor() {
    super("Unauthorised", 401);
  }
}
