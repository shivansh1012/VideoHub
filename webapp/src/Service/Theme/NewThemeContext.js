import { createContext } from 'react'
import useLocalStorage from "use-local-storage";

const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

const ThemeContext = createContext()

function NewThemeContext(props) {
    const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'dark' : 'light');
    const changeThemeToDark = () => {
        document.documentElement.setAttribute("data-theme", "dark") // set theme to dark
    }
    
    const changeThemeToLight = () => {
        document.documentElement.setAttribute("data-theme", "light") // set theme light
    }
    return (
        <ThemeContext.Provider value={{ theme: theme, setTheme: setTheme, changeThemeToDark, changeThemeToLight}}>
          {props.children}
        </ThemeContext.Provider>
      )
}

export default ThemeContext
export { NewThemeContext }