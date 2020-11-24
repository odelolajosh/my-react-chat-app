import React from 'react';
import './notfound.css';

const NotFound = () => {
    return (
        <>
            <div className="notfound-top">
                <span onClick={() => window.history.back()}>Go Back</span>
            </div>
            <main className="notfound-bx">
                <span>4</span>
                <span>0</span>
                <span>4</span>
            </main>
        </>
    )
}

export default NotFound;