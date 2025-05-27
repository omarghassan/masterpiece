import React, { useState } from 'react';
import { BookOpen, Menu, X, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

import './Navbar.css'

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [showCoursesDropdown, setShowCoursesDropdown] = useState(false);
    
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleCoursesDropdown = () => {
        setShowCoursesDropdown(!showCoursesDropdown);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    <BookOpen className="logo-icon" />
                    <span className="logo-text">Feel Fluent</span>
                </Link>
                
                {/* Mobile menu button */}
                <button className="mobile-menu-btn" onClick={toggleMenu}>
                    {isOpen ? <X size={24} color="#F7F3E9" /> : <Menu size={24} color="#F7F3E9" />}
                </button>
                
                {/* Navigation links - desktop and mobile */}
                <div className={`nav-items ${isOpen ? 'show' : ''}`}>
                    <div className="nav-links">
                        <Link to="/" className="nav-link">Home</Link>
                        
                        <div className="dropdown">
                            <button 
                                className="nav-link dropdown-toggle"
                                onClick={toggleCoursesDropdown}
                            >
                                Courses <ChevronDown size={16} />
                            </button>
                            <div className={`dropdown-menu ${showCoursesDropdown ? 'show' : ''}`}>
                                <Link to="/course/executive-communication" className="dropdown-item">Communication Mastery</Link>
                                <Link to="/course/strategic-leadership" className="dropdown-item">Leadership & Influence</Link>
                                <Link to="/course/negotiation-mastery" className="dropdown-item">Negotiation Skills</Link>
                                <Link to="/courses" className="dropdown-item view-all">View All Courses</Link>
                            </div>
                        </div>
                        
                        <Link to="/about" className="nav-link">About Us</Link>
                        <Link to="/blog" className="nav-link">Blog</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                    </div>
                    
                    <div className="auth-buttons">
                        <Link to="/login" className="btn-outline">Sign In</Link>
                        <Link to="/register" className="btn-primary">Get Started</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;