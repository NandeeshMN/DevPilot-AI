import { useAuthContext } from '../context/AuthContext';

/**
 * Access hook exposing global login details and trigger hooks.
 */
export const useAuth = () => {
  const { isLoggedIn, user, authView, setAuthView, loginUser, logoutUser } = useAuthContext();
  return { isLoggedIn, user, authView, setAuthView, loginUser, logoutUser };
};
export default useAuth;
