import React, { Component } from 'react';
const { Consumer, Provider } = React.createContext();

class ThemeContextProvider extends Component {

    USER_THEME_PREFERENCE = 'USER_THEME_PREFERENCE';
    state = {
        theme: 'night'
    };

    static getDerivedStateFromProps = () => {
        const theme = window.localStorage.getItem(this.USER_THEME_PREFERENCE);
        if (theme) {
            return { theme }
        }

        window.localStorage.setItem(this.USER_THEME_PREFERENCE, 'night');
        return null;
    }
    
    toggleTheme = () => {
        this.setState(prevState => {
            const theme = prevState.theme === 'day' ? 'night' : 'day';
            window.localStorage.setItem(this.USER_THEME_PREFERENCE, theme);
            return { theme }
        })
    }
    render() {
        return <Provider value={this.state.theme}>{ this.props.children }</Provider>
    }
}

const ThemeContext = { Provider: ThemeContextProvider , Consumer }

export default ThemeContext;