import React, { useState, useCallback, useEffect } from "react";
import { Form, Card, Button, Alert } from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import { Amplify, API } from "aws-amplify";

import awsconfig from "../../aws-exports";
import "bootstrap/dist/css/bootstrap.min.css";
import Label from "../../components/labels/Label";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
Amplify.configure(awsconfig);

const PetUpdatePage = ({ data, close }) => {
  const [formData, setFormData] = useState({
    petCode: "",
    petName: "",
    color: "",
    characteristics: "",
    age: "",
    petPhoto: "",
    caringTips: "",
  });
  const [emptyFields, setEmptyFields] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    if (data) {
      setIsLoading(true);
      setFormData({
        petCode: data.id.S,
        petName: data.name.S,
        color: data.Color.S,
        characteristics: data.Characteristics.S,
        age: data.Age.N,
        petPhoto: data.PetPhoto.S,
        caringTips: data.CaringTips.S,
      });
      setIsLoading(false);
    }
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFormData((prevData) => ({
        ...prevData,
        petPhoto: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleUpdate = async (petCode) => {
    MySwal.fire({
      title: "Do you want to Update Pet?",
      icon: "question",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const requiredFields = [
            "petCode",
            "petName",
            "color",
            "characteristics",
            "age",
            "caringTips",
          ];

          // Check for empty fields
          const emptyFieldsArray = requiredFields.filter(
            (field) => formData[field] === ""
          );

          setEmptyFields(emptyFieldsArray);

          if (emptyFieldsArray.length > 0) {
            setErrorMessage("Please fill in all required fields.");
            return; // Prevent form submission if there are empty fields
          }

          const updatedPetData = {
            id: formData.petCode,
            name: formData.petName,
            Color: formData.color,
            Characteristics: formData.characteristics,
            Age: parseInt(formData.age),
            PetPhoto: formData.petPhoto,
            CaringTips: formData.caringTips,
          };

          const result = await API.put("PetApi", `/pet/${petCode}`, {
            body: updatedPetData,
          });
          if (result !== null) {
            setSuccessMessage("Pet Updated successfully!");
            setErrorMessage("");
            close();
          }
        } catch (error) {
          console.error("Error updating pet:", error);
          setErrorMessage("Error updating pet. Please try again.");
        }
      }
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: String(value),
    }));
  };

  return (
    <>
      {!isLoading && (
        <Card>
          <div className="row px-3 pt-2 justify-content-between align-items-center">
            <Card.Body>
              <Form>
                <div className="row">
                  <Form.Group className="col-6" controlId="petCode">
                    <Label value={"Pet Code"} required></Label>
                    <Form.Control
                      type="text"
                      name="petCode"
                      placeholder="Enter Pet Code"
                      disabled
                      value={formData.petCode}
                      onChange={(e) => handleInputChange(e)}
                      className={
                        emptyFields.includes("petCode") ? "empty-field" : ""
                      }
                    />
                  </Form.Group>

                  <Form.Group className="col-6" controlId="petName">
                    <Label value={"Pet Breed"} required></Label>
                    <Form.Control
                      type="text"
                      name="petName"
                      placeholder="Enter Pet Breed"
                      value={formData.petName}
                      onChange={(e) => handleInputChange(e)}
                      className={
                        emptyFields.includes("petName") ? "empty-field" : ""
                      }
                    />
                  </Form.Group>
                </div>
                <div className="row">
                  <Form.Group className="col-6" controlId="color">
                    <Label value={"Colour"} required></Label>
                    <Form.Control
                      type="text"
                      name="color"
                      placeholder="Enter Colour"
                      value={formData.color}
                      onChange={(e) => handleInputChange(e)}
                      className={
                        emptyFields.includes("color") ? "empty-field" : ""
                      }
                    />
                  </Form.Group>

                  <Form.Group className="col-6" controlId="characteristics">
                    <Label value={"Characteristics"} required></Label>
                    <Form.Control
                      type="text"
                      name="characteristics"
                      placeholder="Enter Characteristics"
                      value={formData.characteristics}
                      onChange={(e) => handleInputChange(e)}
                      className={
                        emptyFields.includes("characteristics")
                          ? "empty-field"
                          : ""
                      }
                    />
                  </Form.Group>
                </div>
                <div className="row">
                  <Form.Group className="col-6" controlId="age">
                    <Label value={"Age"} required></Label>
                    <Form.Control
                      type="number"
                      name="age"
                      placeholder="Enter Age"
                      value={formData.age}
                      onChange={(e) => handleInputChange(e)}
                      className={
                        emptyFields.includes("age") ? "empty-field" : ""
                      }
                    />
                  </Form.Group>

                  <Form.Group className="col-6" controlId="caringTips">
                    <Label value={"Caring Tips"} required></Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="caringTips"
                      placeholder="Enter Caring Tips"
                      value={formData.caringTips}
                      onChange={(e) => handleInputChange(e)}
                      className={
                        emptyFields.includes("caringTips") ? "empty-field" : ""
                      }
                    />
                  </Form.Group>
                </div>
                <Form.Group className="col-6" controlId="petPhoto">
                  <Label value={"Pet Photo (Upload Image)"} required></Label>
                  <fieldset className="custom-form">
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <p>
                        Drag 'n' drop an image here, or click to select a file
                      </p>
                    </div>
                  </fieldset>
                  {formData.petPhoto && (
                    <div>
                      <h5>Uploaded Photo:</h5>
                      <div className="m-2">
                        <img
                          src={formData.petPhoto}
                          alt="Pet Photo"
                          width="100"
                        />
                      </div>
                    </div>
                  )}
                </Form.Group>

                {/* Success Alert */}
                {successMessage && (
                  <Alert
                    variant="success"
                    onClose={() => setSuccessMessage("")}
                    dismissible
                  >
                    {successMessage}
                  </Alert>
                )}

                {/* Error Alert */}
                {errorMessage && (
                  <Alert
                    variant="danger"
                    onClose={() => setErrorMessage("")}
                    dismissible
                  >
                    {errorMessage}
                  </Alert>
                )}
                <Button
                  variant="primary"
                  onClick={() => {
                    handleUpdate(formData.petCode);
                  }}
                >
                  Update
                </Button>
              </Form>
            </Card.Body>
          </div>
        </Card>
      )}
    </>
  );
};

export default PetUpdatePage;
