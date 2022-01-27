import { useContext } from 'react'

import ThemeContext, { themes } from "../../Service/Theme/themeContextWrapper.js"

export default function SettingsComponent() {
    const { setTheme, theme, themeState, setThemeState } = useContext(ThemeContext);
    const onThemeChange = (e) => {
        if(theme==="light-content") {
            setTheme(themes.dark);
            setThemeState(theme)
        } else {
            setTheme(themes.light);
            setThemeState(theme)
        }
    }

    return (
        <div className="container" style={{ width: "100vw", height: "60vh", alignItems: "center", display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="p-4">Theme : </div>
                {/* <button className="m-5" onClick={() => setTheme(themes.light)}>Light</button>
                <button className="m-5" onClick={() => setTheme(themes.dark)}>Dark</button> */}
                <label className="form-check-label p-4">Light</label>
                <div className="form-check form-switch py-4">
                    <input className="form-check-input" type="checkbox" role="switch"
                        id="flexSwitchCheckDefault"
                        defaultChecked={themeState} onChange={(e) => onThemeChange(e)} />
                </div>
                <label className="form-check-label p-4">Dark</label>
            </div>
        </div>
    )
}
