import {useContext} from 'react'

import ThemeContext, {themes} from "../../Theme/themeContextWrapper.js"

export default function SettingsComponent() {
    const { changeTheme } = useContext(ThemeContext);
    // changeTheme(themes.dark)
    return (
        <div className="container text-center">
            <div className="m-5">Theme : </div>
            <button className="m-5" onClick={()=>changeTheme(themes.light)}>Light</button>
            <button className="m-5" onClick={()=>changeTheme(themes.dark)}>Dark</button>
        </div>
    )
}
