import React from 'react';
import './error.css';

const ErrorFullPage = ({ err, onAction }) => {
    return (
        <div className="error-fullpage" onClick={onAction ? onAction : null}>
            <div className="error">{ err }</div>
            <small>Click to refresh</small>
        </div>
    )
}

export default ErrorFullPage;