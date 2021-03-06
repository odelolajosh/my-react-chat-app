import React, { Component } from 'react';
import { themeMap } from '../helpers/themeHelper';
const MyThemeContext = React.createContext();

const USER_THEME_PREFERENCE = 'USER_THEME_PREFERENCE';

class ThemeContextProvider extends Component {

    state = {
        theme: 'night'
    };

    static getDerivedStateFromProps = () => {
        const theme = window.localStorage.getItem(USER_THEME_PREFERENCE);
        if (theme) {
            return { theme }
        }

        window.localStorage.setItem(USER_THEME_PREFERENCE, 'night');
        return null;
    }
    
    toggleTheme = () => {
        this.setState(prevState => {
            const theme = prevState.theme === 'day' ? 'night' : 'day';
            window.localStorage.setItem(USER_THEME_PREFERENCE, theme);
            console.log("toggle " + prevState.theme + " ", theme);
            return { theme: 'day' }
        })
    }
    
    render() {
        return <MyThemeContext.Provider value={{
            theme: themeMap(this.state.theme),
            state: this.state.theme,
            toggleTheme: this.toggleTheme
        }}>{ this.props.children }</MyThemeContext.Provider>
    }
}

const ThemeContext = { Provider: ThemeContextProvider , Consumer: MyThemeContext.Consumer, MyThemeContext }

export default ThemeContext;