import { Link, useNavigate } from 'react-router-dom';
import './InstructorSidebar.css';
import logo from '../../../assets/img/title.png'

function InstructorSidebar() {

    const navigate = useNavigate()

    return (
        <div className="instructor-sidebar-container">
            <aside className="instructor-sidenav">
                <div className="instructor-sidenav-header">
                    <Link to="/instructor/home" className="instructor-navbar-brand">
                        <img src={logo} className="instructor-navbar-brand-img" width="30" height="30" alt="Feel Fluent Logo" />
                        <span>Feel Fluent</span>
                    </Link>
                </div>

                <div className="instructor-navbar-collapse">
                    <ul className="instructor-navbar-nav">
                        <li className="instructor-nav-item">
                            <Link to="/instructor/home" className="instructor-nav-link">
                                <svg className="instructor-nav-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"></path>
                                </svg>
                                <span>Dashboard</span>
                            </Link>
                        </li>

                        <li className="instructor-nav-item">
                            <Link to="/instructor/profile" className="instructor-nav-link">
                                <svg className="instructor-nav-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path>
                                </svg>
                                <span>Profile</span>
                            </Link>
                        </li>

                        <li className="instructor-nav-item">
                            <Link to="/instructor/courses" className="instructor-nav-link">
                                <svg className="instructor-nav-icon" viewBox="0 0 24 24" >
                                    <path fill="currentColor" d="M21 4H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h6v2H7v2h10v-2h-2v-2h6c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 12H3V6h18v10zm-10-1 5-3-5-3v6z" />
                                </svg>
                                <span>Courses</span>
                            </Link>
                        </li>

                        <li className="instructor-nav-item">
                            <Link to="/instructor/blogs" className="instructor-nav-link">
                                <svg className="instructor-nav-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z" />
                                </svg>
                                <span>Blogs</span>
                            </Link>
                        </li>
                    </ul>

                    <div className="instructor-logout-section">
                        <button onClick={() => {
                            localStorage.removeItem('token');
                            navigate('/instructor/login');
                        }} className="instructor-logout-button">
                            <svg className="instructor-nav-icon" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"></path>
                            </svg>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

        </div>
    );
}

export default InstructorSidebar;