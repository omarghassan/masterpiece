import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-grid">
                    <div>
                        <h4>Company</h4>
                        <ul>
                            <li><Link to="/about">About</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/careers">Careers</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Resources</h4>
                        <ul>
                            <li><Link to="/help">Help Center</Link></li>
                            <li><Link to="/guides">Guides</Link></li>
                            <li><Link to="/community">Community</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Legal</h4>
                        <ul>
                            <li><Link to="/privacy">Privacy</Link></li>
                            <li><Link to="/terms">Terms</Link></li>
                            <li><Link to="/cookies">Cookie Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4>Connect</h4>
                        <ul>
                            <li><Link to="#">Twitter</Link></li>
                            <li><Link to="#">Facebook</Link></li>
                            <li><Link to="#">LinkedIn</Link></li>
                        </ul>
                    </div>
                </div>
                <p>&copy; {new Date().getFullYear()} Feel Fluent. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;