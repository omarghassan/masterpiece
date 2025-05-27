import './Landing.css'
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Clock, ArrowRight, Diamond, Target, Zap } from 'lucide-react';
import Navbar from './Navbar/Navbar';
import Footer from './Footer/Footer';


export default function LandingPage() {
  return (
    <div className="page-container">

      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1>
            <span>Elevate Your</span>
            <span className="highlight"> Professional Presence</span>
          </h1>
          <p className="lead">
            Master the essential soft skills that transform careers. Curated courses designed by industry leaders for today's competitive professional landscape.
          </p>
          <div className="cta-buttons">
            <Link to="/courses" className="btn-primary btn-lg">Explore Courses</Link>
            <Link to="/register" className="btn-secondary btn-lg">Begin Your Journey</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="subtitle">Why Choose Us</h2>
            <h3>The Art of Professional Excellence</h3>
          </div>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon"><Diamond /></div>
              <h4>Premium Content</h4>
              <p>Carefully crafted curriculum designed to develop the soft skills most valued in today's professional environment.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Users /></div>
              <h4>Expert Mentorship</h4>
              <p>Learn from accomplished professionals with proven track records across diverse industries.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Target /></div>
              <h4>Personalized Growth</h4>
              <p>Customized learning paths adapting to your specific career goals and personal development needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="courses">
        <div className="container">
          <div className="section-header">
            <h2 className="subtitle">Signature Programs</h2>
            <h3>Transformative Learning Experiences</h3>
          </div>
          <div className="course-grid">
            <div className="course-card">
              <div className="course-thumbnail bg-blue">
                <Zap className="course-icon" />
              </div>
              <div className="course-body">
                <h4>Executive Communication Mastery</h4>
                <p>Develop compelling communication skills that command attention and inspire action in any professional setting.</p>
                <div className="course-footer">
                  <span className="price">$349</span>
                  <Link to="/course/executive-communication" className="link-more">View Details <ArrowRight /></Link>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail bg-green">
                <Award className="course-icon" />
              </div>
              <div className="course-body">
                <h4>Strategic Leadership & Influence</h4>
                <p>Master the subtle art of leadership through presence, emotional intelligence, and strategic relationship building.</p>
                <div className="course-footer">
                  <span className="price">$429</span>
                  <Link to="/course/strategic-leadership" className="link-more">View Details <ArrowRight /></Link>
                </div>
              </div>
            </div>
            <div className="course-card">
              <div className="course-thumbnail bg-purple">
                <Clock className="course-icon" />
              </div>
              <div className="course-body">
                <h4>Negotiation & Conflict Resolution</h4>
                <p>Acquire advanced techniques to navigate complex negotiations and transform conflicts into opportunities.</p>
                <div className="course-footer">
                  <span className="price">$389</span>
                  <Link to="/course/negotiation-mastery" className="link-more">View Details <ArrowRight /></Link>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center" style={{ marginTop: "3rem" }}>
            <Link to="/courses" className="btn-primary">Browse All Programs</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container cta-content">
          <h2>
            <span>Invest in Your Professional Future</span>
            <span className="subtext">The difference between good and exceptional is mastery of soft skills</span>
          </h2>
          <Link to="/register" className="btn-light">Start Your Transformation</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}