import React, { useContext } from 'react';
import logo from '../res/logo.svg';
import ThemeContext from "../contexts/themeContext"


const LogoKit = () => {
    const { theme } = useContext(ThemeContext.MyThemeContext);
    return (
        <span className="logo-kit" style={{ display: "flex", alignItems: "center" }}>
            <img src={logo} alt="logo" />
            <span style={{ color: theme.textColor }} >YouChat</span>
        </span>
    )
}

export default LogoKit;