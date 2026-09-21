
export default function Navbar({ onGoHome }) {
    return (
        <nav className="navbar">
            <div className="nav-brand">
                <a
                    href="/"
                    onClick={(e) => {
                        if (onGoHome) {
                            e.preventDefault();
                            onGoHome();
                        }
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none', cursor: 'pointer' }}
                    title="Back to Home"
                >
                    <img
                        src="./SignCrafter-logo.png"
                        alt="SignCrafter Logo"
                        className="nav-logo"
                    />
                </a>
            </div>
        </nav>
    );
}