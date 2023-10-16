import React from "react";
import {  Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CommonNavbar from "../components/navbar/NavBar";
import Footer from "../components/footer/Footer";
import Dog from "../assets/leash.jpg";
import Cat from "../assets/cat-2934720_640.jpg";
import PetFam from "../assets/petfam.webp";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/admin");
  };

  return (
    <>
      <CommonNavbar title="Home" handleLoginClick={handleLoginClick} />
      <Container className="mt-5">
        <Row>
          <Col>
            <h1>Welcome to OwnAPet</h1>
            <p>
              We have a wide range of pets, high-quality pet food, and
              accessories to make your pet's life better.
            </p>
            <Col className="d-flex justify-content-center align-items-center">
              <img className="img-fluid rounded" src={PetFam} alt="Pets" />
            </Col>
            <hr></hr>
            <Row>
              <p className="col-7">
                At Our Pet Care Center, we are dedicated to providing top-notch
                care for your beloved pets. Our team of passionate and
                experienced pet care specialists is committed to ensuring the
                health, happiness, and well-being of your furry friends. Whether
                it's training sessions, wellness check-ups, grooming services,
                or simply a friendly chat about your pet's needs, you can trust
                us to provide the expert guidance and care your pets deserve. We
                understand that your pets are an integral part of your family,
                and we treat them as such. Join us on this journey of love and
                companionship, and let's make every moment with your pets a
                joyful one.
              </p>
              <img className="col-4" src={Dog} alt="Dog" width="100" />
            </Row>
            <hr></hr>
            <Row>
              <img className="col-4" src={Cat} alt="Cat" width="100" />
              <h3 className="col-7">
                Visit our physical stores to explore our offerings and give your
                pet the care it deserves.
              </h3>
            </Row>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default HomePage;
