import React, { useState } from "react";
import {
  Accordion,
  Alert,
  Button,
  Carousel,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import PetCardView from "../card/PetCardView";
import { API } from "aws-amplify";

const initialFormData = {
  name: "",
  age: "",
  color: "",
};

const SearchFilter = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [filterCriteria, setFilterCriteria] = useState(initialFormData);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterCriteria({
      ...filterCriteria,
      [name]: value,
    });
  };

  const handleFilterSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      // Create an object to hold the filter criteria with non-empty values
      const filteredCriteria = {};

      // Add filter criteria to the object if values are provided
      if (filterCriteria.name) {
        filteredCriteria.name = filterCriteria.name;
      }
      if (filterCriteria.age) {
        filteredCriteria.age = filterCriteria.age;
      }
      if (filterCriteria.color) {
        filteredCriteria.color = filterCriteria.color;
      }

      // Make an API request to fetch filtered pet data based on filterCriteria
      const result = await API.get("PetApi", "/pet/filter", {
        queryStringParameters: filteredCriteria,
      });
      if (result.pets && Object.keys(result.pets).length === 0) {
        setPets([]);
        setErrorMessage(result.message);
      } else {
        setPets(result.pets);
        setErrorMessage("");
      }

      setLoading(false);
    } catch (error) {
      setErrorMessage("Error Finding pet. Please try again.");
      console.error("Error filtering pets data:", error);
    }
  };

  return (
    <>
      <Accordion>
        <Accordion.Item eventKey="0">
          <Accordion.Header>Search</Accordion.Header>
          <Accordion.Body>
            <Row className="mt-4">
              <Col className="col-5">
                <Form onSubmit={handleFilterSubmit}>
                  <Form.Group controlId="formName">
                    <Form.Label>Breed</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={filterCriteria.name}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formAge">
                    <Form.Label>Age</Form.Label>
                    <Form.Control
                      type="text"
                      name="age"
                      value={filterCriteria.age}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formColor">
                    <Form.Label>Color</Form.Label>
                    <Form.Control
                      type="text"
                      name="color"
                      value={filterCriteria.color}
                      onChange={handleFilterChange}
                    />
                  </Form.Group>
                  {/* Add more filter input fields as needed */}
                  <Button variant="primary" type="submit">
                    Apply Filters
                  </Button>
                  <Button
                    variant="secondary"
                    type="reset"
                    className="m-2"
                    onClick={() => setFilterCriteria(initialFormData)}
                  >
                    Reset
                  </Button>
                </Form>
              </Col>
              <Container className="col-5">
                {/* Render animal cards */}
                {!loading && pets.length > 0 ? (
                  <Row className="mt-4">
                    <Carousel
                      className="custom-carousel"
                      prevIcon={<span className="carousel-icon">&#8249;</span>}
                      nextIcon={<span className="carousel-icon">&#8250;</span>}
                    >
                      {pets.map((animal, idx) => (
                        <Carousel.Item key={idx} className="carousel-item">
                          <Col xs={12} sm={6} md={4} lg={3}>
                            <PetCardView animal={animal} />
                          </Col>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </Row>
                ) : (
                  errorMessage && (
                    <Alert
                      variant="danger"
                      onClose={() => setErrorMessage("")}
                      dismissible
                    >
                      {errorMessage}
                    </Alert>
                  )
                )}
              </Container>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default SearchFilter;
