import { useState, useEffect, createContext } from 'react'

const themes = {
  dark: 'dark-content',
  light: 'light-content'
}

const ThemeContext = createContext({
  theme: themes.dark,
  changeTheme: () => { }
})

function ThemeContextWrapper (props) {
  const [theme, setTheme] = useState(themes.dark)

  function changeTheme (theme) {
    setTheme(theme)
  }

  useEffect(() => {
    switch (theme) {
      case themes.light:
        document.body.classList.remove('dark-content')
        document.body.classList.add('light-content')
        break
      case themes.dark:
      default:
        document.body.classList.remove('light-content')
        document.body.classList.add('dark-content')
        break
    }
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme: theme, changeTheme: changeTheme }}>
      {props.children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext
export { ThemeContextWrapper, themes }
