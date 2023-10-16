import React from "react";
import { Card } from "react-bootstrap";

const WidePetCard = ({ animal }) => {
  return (
    <Card className="wide-pet-card">
      <div className="row">
        <div className="col-md-4">
          <div className="wide-pet-image">
            <Card.Img src={animal.PetPhoto.S} alt={animal.name.S} />
          </div>
        </div>
        <div className="col-md-8">
          <Card.Body>
            <Card.Title>{animal.name.S}</Card.Title>
            <Card.Text>
              <strong>Color:</strong> {animal.Color.S}
            </Card.Text>
            <Card.Text>
              <strong>Age:</strong> {animal.Age.N}
            </Card.Text>
            <Card.Text>
              <strong>Characteristics:</strong> {animal.Characteristics.S}
            </Card.Text>
            <Card.Text>
              <strong>Caring Tips:</strong> {animal.CaringTips.S}
            </Card.Text>
          </Card.Body>
        </div>
      </div>
    </Card>
  );
};

export default WidePetCard;
