import { useState } from "react";
import { MaterialUISwitch } from "./MaterialUISwitch";

export function Header() {
    const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') === 'dark')

    function handleChange(event) {
        const newTheme = event.target.checked ? 'dark' : ''
        document.documentElement.setAttribute('data-theme', newTheme)
        setTheme(event.target.checked)
    }

    return (
        <div className="header-container">
            <div className="logo-container">
                <img className="starbucks-logo" src="https://www.freepnglogos.com/uploads/starbucks-coffee-green-logo-28.png" alt="" />
                <h1>Starbucks x Webiks</h1>
            </div>

            <MaterialUISwitch
                onChange={handleChange}
                checked={theme}
            />
        </div>
    )
}
