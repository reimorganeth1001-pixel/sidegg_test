export type AuthState = "pending" | "failure" | "success";

export type AuthContextType = {
  authState: AuthState;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState>>;
};
