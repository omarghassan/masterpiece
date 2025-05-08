import './Landing.css'
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Clock, ArrowRight } from 'lucide-react';


export default function LandingPage() {
  return (
    <div className="page-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo">
            <BookOpen className="logo-icon" />
            <span className="logo-text">EduPlatform</span>
          </div>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Sign In</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1>
            <span>Learn from the</span>
            <span className="highlight">best instructors</span>
          </h1>
          <p className="lead">
            Access high-quality courses taught by industry experts. Upgrade your skills and advance your career today.
          </p>
          <div className="cta-buttons">
            <Link to="/courses" className="btn-primary btn-lg">Browse Courses</Link>
            <Link to="/register" className="btn-secondary btn-lg">Join Free</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="subtitle">Features</h2>
            <h3>A better way to learn</h3>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon"><BookOpen /></div>
              <h4>Diverse Courses</h4>
              <p>Choose from hundreds of courses across various disciplines and skill levels.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Users /></div>
              <h4>Expert Instructors</h4>
              <p>Learn from industry professionals with real-world experience.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Clock /></div>
              <h4>Flexible Learning</h4>
              <p>Study at your own pace with lifetime access to course materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="courses">
        <div className="container">
          <div className="section-header">
            <h2 className="subtitle">Courses</h2>
            <h3>Popular Courses</h3>
          </div>
          <div className="course-grid">
            <div className="course-card">
              <div className="course-thumbnail bg-blue">
                <BookOpen className="course-icon" />
              </div>
              <div className="course-body">
                <h4>Web Development Bootcamp</h4>
                <p>Master HTML, CSS, JavaScript and modern frameworks in this comprehensive course.</p>
                <div className="course-footer">
                  <span className="price">$99.99</span>
                  <Link to="/course/web-development" className="link-more">View Course <ArrowRight /></Link>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail bg-green">
                <Award className="course-icon" />
              </div>
              <div className="course-body">
                <h4>Data Science Fundamentals</h4>
                <p>Learn Python, Pandas, and data visualization techniques from scratch.</p>
                <div className="course-footer">
                  <span className="price">$129.99</span>
                  <Link to="/course/data-science" className="link-more">View Course <ArrowRight /></Link>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail bg-purple">
                <Users className="course-icon" />
              </div>
              <div className="course-body">
                <h4>Digital Marketing Mastery</h4>
                <p>Everything you need to know about SEO, social media, and content marketing.</p>
                <div className="course-footer">
                  <span className="price">$79.99</span>
                  <Link to="/course/digital-marketing" className="link-more">View Course <ArrowRight /></Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Link to="/courses" className="btn-primary">View All Courses</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2 className="subtitle">Testimonials</h2>
            <h3>What our students say</h3>
          </div>
          <div className="testimonial-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">JD</div>
                <div className="user-info">
                  <h4>John Doe</h4>
                  <p>Web Developer</p>
                </div>
              </div>
              <p>"The web development course completely transformed my career. The instructors are knowledgeable and the curriculum is up-to-date."</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">AS</div>
                <div className="user-info">
                  <h4>Alice Smith</h4>
                  <p>Data Analyst</p>
                </div>
              </div>
              <p>"I landed my dream job after completing the Data Science course. The hands-on projects were especially valuable."</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="avatar">RJ</div>
                <div className="user-info">
                  <h4>Robert Johnson</h4>
                  <p>Marketing Specialist</p>
                </div>
              </div>
              <p>"The digital marketing course provided practical skills I could immediately apply to grow my business. Highly recommended!"</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container cta-content">
          <h2>
            <span>Ready to dive in?</span>
            <span className="subtext">Start your learning journey today.</span>
          </h2>
          <Link to="/register" className="btn-light">Get started</Link>
        </div>
      </section>

      {/* Footer */}
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
          <p>&copy; {new Date().getFullYear()} EduPlatform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}