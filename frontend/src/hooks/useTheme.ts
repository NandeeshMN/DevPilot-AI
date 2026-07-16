import { useThemeContext } from '../context/ThemeContext';

/**
 * Access hook exposing theme settings.
 */
export const useTheme = () => {
  const { theme, setTheme, toggleTheme } = useThemeContext();
  return { theme, setTheme, toggleTheme };
};
export default useTheme;
