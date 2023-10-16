import React, { useEffect, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { API } from "aws-amplify";
import WideItemCard from "../../components/card/ItemCardWide";

const InventoryViewPage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    try {
      const result = await API.get("PetApi", "/items");
      setItems(result.data.Items);
    } catch (error) {
      console.error("Error getting pets data:", error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <Container className="mt-5">
        <Row>
          <Col>
            <h1>View Our Items</h1>
            <p>Browse our wide selection of items available for your pet.</p>
          </Col>
        </Row>
        <Row className="mt-4">
          {isLoading ? (
            <Col xs={12} className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Loading...</p>
            </Col>
          ) : (
            items.map((item, index) => (
              <Col key={index} xs={12} className="mb-4">
                <WideItemCard item={item} />
              </Col>
            ))
          )}
        </Row>
      </Container>
    </>
  );
};

export default InventoryViewPage;
