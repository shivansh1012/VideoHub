import DarkMode from './DarkMode/DarkMode.jsx';

export default function SettingsComponent() {

    return (
        <div className="container" style={{height: "60vh", alignItems: "center", display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div className="p-4">Theme : </div>
                <DarkMode/>
            </div>
        </div>
    )
}
