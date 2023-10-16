import React, { useEffect } from "react";
import { Card } from "react-bootstrap";

const PetCardView = ({ animal }) => {
  return (
    <Card style={{ width: "18rem" }} className="pet-card">
      <div className="pet-image-container">
        <Card.Img variant="top" src={animal.PetPhoto} alt={animal.name} />
      </div>

      <Card.Body>
        <Card.Title>{animal.name}</Card.Title>
        <Card.Text>
          <strong>Color:</strong> {animal.Color}
        </Card.Text>
        <Card.Text>
          <strong>Characteristics:</strong> {animal.Characteristics}
        </Card.Text>
        <Card.Text>
          <strong>Age:</strong> {animal.Age}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PetCardView;
