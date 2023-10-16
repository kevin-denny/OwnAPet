import React, { useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { API } from "aws-amplify";
import WidePetCard from "../../components/card/PetCardWide";
import SearchFilter from "../../components/filter/SearchFilter";

const PetViewPage = () => {
  const [animals, setAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Call the getData function to fetch animal data initially
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsLoading(true);
      const result = await API.get("PetApi", "/pet");
      setAnimals(result.data.Items);
      setIsLoading(false);
    } catch (error) {
      console.error("Error getting pets data:", error);
    }
  };

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col>
            <h1>View Our Pets</h1>
            <p>Browse our wide selection of pets available for adoption.</p>
          </Col>
        </Row>
        <Row>
          <SearchFilter />
        </Row>

        <Row className="mt-4">
          {isLoading ? (
            <Col xs={12} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Loading...</p>
            </Col>
          ) : (
            animals.map((animal, index) => (
              <Col key={index} xs={12} className="mb-4">
                <WidePetCard animal={animal} />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </>
  );
};

export default PetViewPage;
