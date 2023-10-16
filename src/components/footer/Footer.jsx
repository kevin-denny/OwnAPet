import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="mt-5 footer-container">
      <Container>
        <Row className="mt-4">
          <Col>
            <h2>Store Locations</h2>
            <p>Find us at multiple locations:</p>
            <ul>
              <li>Main Store: 123 Main Street, City</li>
              <li>Downtown Store: 456 Downtown Avenue, City</li>
              <li>Suburb Store: 789 Suburb Lane, City</li>
            </ul>
          </Col>
          <Col>
            <h2>Business Hours</h2>
            <p>Our stores are open 7 days a week:</p>
            <ul>
              <li>Monday to Saturday: 9:00 AM - 7:00 PM</li>
              <li>Sunday: 10:00 AM - 5:00 PM</li>
            </ul>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h2>Contact Us</h2>
            <p>If you have any questions, feel free to reach out:</p>
            <ul>
              <li>
                Email: <a href="mailto:kevinddenny@gmail.com">kevinddenny@gmail.com</a>
              </li>
              <li>Phone: +94 76 619 1941</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
