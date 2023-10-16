import React, { useEffect } from "react";
import { Card } from "react-bootstrap";

const PetCard = ({ animal }) => {
  return (
    <Card style={{ width: "18rem" }} className="pet-card">
      <div className="pet-image-container">
        <Card.Img variant="top" src={animal.PetPhoto.S} alt={animal.name.S} />
      </div>

      <Card.Body>
        <Card.Title>{animal.name.S}</Card.Title>
        <Card.Text>
          <strong>Color:</strong> {animal.Color.S}
        </Card.Text>
        <Card.Text>
          <strong>Characteristics:</strong> {animal.Characteristics.S}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default PetCard;
