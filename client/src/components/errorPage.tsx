import './errorPage.css';

const ErrorPage = () => {
    return (
        <div className="error-container">
            <h1 className="error-title">Oops! Something went wrong.</h1>
            <p className="error-message">We're sorry, but the page you were looking for doesn't exist.</p>
            <button className="error-button" onClick={() => window.location.href = '/'}>Go to Homepage</button>
        </div>
    );
};

export default ErrorPage;