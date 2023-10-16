import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import CommonNavbar from "../components/navbar/NavBar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer/Footer";
import Hamster from "../assets/hamster.jpeg";
import Bird from "../assets/parrot.jpeg";
import Leash from "../assets/leash.jpg";
import Food from "../assets/food.jpg";

const InfoPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/admin");
  };
  return (
    <>
      <CommonNavbar title="About Us" handleLoginClick={handleLoginClick} />
      <Container className="mt-5">
        <Row>
          <Col>
            <h1>Welcome to OwnAPet</h1>
            <p>
              OwnAPet is your one-stop destination for all your pet needs. With
              multiple physical pet shops conveniently located, we are committed
              to providing the best for you and your furry companions.
            </p>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col md={6}>
            <h2>Wide Range of Pets</h2>
            <p>
              At OwnAPet, we offer a diverse selection of domesticated pets,
              including cats, dogs, birds, and small animals. Whether you're
              looking for a loyal canine friend or a playful kitten, we have the
              perfect pet waiting for you.
            </p>
            <Row>
              <img className="col-5" src={Bird} alt="Bird" width="120" />
              <img className="col-5" src={Hamster} alt="Hamster" width="120" />
            </Row>
          </Col>

          <Col md={6}>
            <h2>Pet Supplies and Accessories</h2>
            <Row>
              <img className="col-5" src={Leash} alt="Leash" width="120" />
              <img className="col-5" src={Food} alt="Food" width="120" />
            </Row>
            <p>
              We understand that your pets deserve the best. That's why we stock
              high-quality pet food, toys, bedding, and accessories to keep your
              pets healthy, happy, and entertained. Visit our shops to explore
              our wide range of pet products.
            </p>
          </Col>
        </Row>
        <hr></hr>
        <Card>
          <Card.Body>
            <Row className="mt-4">
              <Col md={6}>
                <h2>Pet Care Training</h2>
                <p>
                  Our pet care experts provide training sessions and valuable
                  advice on pet wellness. Whether you're a new pet parent or
                  looking to enhance your pet's obedience, our training programs
                  cater to pets of all ages and breeds.
                </p>
              </Col>

              <Col md={6}>
                <h2>Health and Wellness</h2>
                <p>
                  The well-being of your pets is our top priority. Our
                  experienced veterinarians offer comprehensive health check-ups
                  and vaccinations. We're here to ensure your pets lead happy,
                  healthy lives.
                </p>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <h2>Visit Us Today!</h2>
                <p>
                  We invite you to visit our pet shops and experience the
                  OwnAPet difference. Our friendly staff is always ready to
                  assist you in finding the perfect pet, the right pet supplies,
                  or providing guidance on pet care. Join us in celebrating the
                  joy of pet companionship!
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default InfoPage;
