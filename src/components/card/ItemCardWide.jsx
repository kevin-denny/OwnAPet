import React from "react";
import { Card } from "react-bootstrap";

const WideItemCard = ({ item }) => {
  return (
    <Card className="wide-pet-card">
      <div className="row">
        <div className="col-md-4">
          <div className="wide-pet-image">
            <Card.Img src={item.photo.S} alt={item.itemName.S} />
          </div>
        </div>
        <div className="col-md-8">
          <Card.Body>
            <Card.Title>{item.itemName.S}</Card.Title>
            <Card.Text>
              <strong>Remarks:</strong> {item.remarks.S}
            </Card.Text>
          </Card.Body>
        </div>
      </div>
    </Card>
  );
};

export default WideItemCard;
