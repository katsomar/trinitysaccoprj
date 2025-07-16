import React from 'react';
import '../styles/main.css';

const About = () => {
    return (
        <div className="about-page">
            <div className="about-container">
                <section className="company-info">
                    <h1>About Trinity SACCO</h1>
                    <div className="heading-line"></div>
                    <div className="company-content">
                        <div className="company-image-container">
                            <img src="/images/first.jpeg" alt="Company" className="company-image" />
                        </div>
                        <div className="company-text">
                            <p>
                                Trinity SACCO is a trusted partner in savings and credit management. Our mission is to empower individuals and groups to achieve financial stability and growth through innovative solutions.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="team">
                    <h2>Meet the Team</h2>
                    <div className="heading-line"></div>
                    <div className="team-member">
                        <div className="image-container">
                            <img src="/images/fifth.jpeg" alt="Omar Muammar" />
                        </div>
                        <div className="info-container">
                            <h3>Omar Muammar</h3>
                            <p>Lead Developer</p>
                            <p>
                                Omar Muammar is an experienced software engineer with a strong background in backend systems and cloud infrastructure. He enjoys solving complex problems and mentoring junior developers. Omar is passionate about building reliable, scalable applications and is always eager to learn new technologies. In his free time, he likes reading tech blogs and cycling.
                            </p>
                        </div>
                    </div>
                    
                    <div className="team-member">
                        <div className="image-container">
                            <img src="/images/jane.jpeg" alt="Jane Francis" />
                        </div>
                        <div className="info-container">
                            <h3>Jane Francis</h3>
                            <p>Backend Developer</p>
                            <p>
                                Jane Francis is a backend developer who specializes in API development and database management. She is detail-oriented, enjoys optimizing code for performance, and loves collaborating with her team. Jane is enthusiastic about new programming languages and enjoys attending tech meetups. She also likes painting and traveling.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="reviews">
                    <h2>What People Say</h2>
                    <div className="heading-line"></div>
                    <div className="review-cards">
                        <div className="card">
                            <div className="review-profile">
                                <img src="/images/c.jpeg" alt="Sarah Williams" className="review-img" />
                            </div>
                            <p>"Trinity SACCO has transformed the way I manage my savings. Highly recommended!"</p>
                            <h4>- Sarah Williams</h4>
                            <div className="review-stars">
                                {/* 5 stars */}
                                <span>★ ★ ★ ★ ★</span>
                            </div>
                        </div>
                        <div className="card">
                            <div className="review-profile">
                                <img src="/images/b.jpeg" alt="Michael Brown" className="review-img" />
                            </div>
                            <p>"The team behind this application is amazing. Great support and innovative features."</p>
                            <h4>- Michael Brown</h4>
                            <div className="review-stars">
                                {/* 4 stars */}
                                <span>★ ★ ★ ★ ☆</span>
                            </div>
                        </div>
                        <div className="card">
                            <div className="review-profile">
                                <img src="/images/a.jpeg" alt="Linda Davis" className="review-img" />
                            </div>
                            <p>"I love how easy it is to track my financial growth. Trinity SACCO is a game-changer."</p>
                            <h4>- Linda Davis</h4>
                            <div className="review-stars">
                                {/* 5 stars */}
                                <span>★ ★ ★ ★ ★</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="contact">
                    <h2>Contact Us</h2>
                    <div className="heading-line"></div>
                    <div className="contact-details">
                        <div className="contact-item">
                            <span className="contact-icon">&#9993;</span>
                            <span className="contact-label">Email:</span>
                            <span className="contact-value">support@trinitysacco.com</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">&#128222;</span>
                            <span className="contact-label">Phone:</span>
                            <span className="contact-value">+123 456 7890</span>
                        </div>
                        <div className="contact-item">
                            <span className="contact-icon">&#127968;</span>
                            <span className="contact-label">Address:</span>
                            <span className="contact-value">123 Trinity SACCO Street, Financial City</span>
                        </div>
                    </div>
                    <div className="map">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.835434509423!2d-122.4194154846819!3d37.77492977975937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064f8f8f8f8%3A0xf8f8f8f8f8f8f8f8!2sFinancial%20City!5e0!3m2!1sen!2sus!4v1633024800000!5m2!1sen!2sus"
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Map"
                        ></iframe>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default About;
