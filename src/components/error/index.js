import React from 'react';
import ThemeContext from '../../contexts/themeContext';
import './error.css';

const ErrorFullPage = ({ err, onAction, templateImage }) => {
    return (
        <ThemeContext.Consumer>
        {
            ({ theme }) => (
                <div className="error-fullpage" onClick={onAction ? onAction : null}>
                    { templateImage && <img src={templateImage} alt="error" /> }
                    <div className="error">{ err }</div>
                    <small style={{ color: theme.textColorContrast }}>Click to refresh</small>
                </div>
            )
        }
        </ThemeContext.Consumer>
    )
}

export default ErrorFullPage;