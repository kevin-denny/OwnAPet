import uuid
import awsgi
import boto3
import os
import json
import logging 
from flask_cors import CORS
from flask import Flask, jsonify, request
from uuid import uuid4

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = boto3.client("dynamodb")
TABLE = "PetTable-dev"
BASE_ROUTE = "/pet"

@app.route(BASE_ROUTE, methods=['POST', 'GET'])
def pet():
    if request.method == 'POST':
        return create_pet()
    elif request.method == 'GET':
        return get_pet()

@app.route(BASE_ROUTE + '/<string:pet_id>', methods=['PUT', 'DELETE'])
def update_or_delete_pet(pet_id):
    if request.method == 'PUT':
        return update_pet(pet_id)
    elif request.method == 'DELETE':
        return delete_pet(pet_id)
    
@app.route(BASE_ROUTE + '/filter', methods=['GET'])   
def pet_filter(): 
    if request.method == 'GET':
        return get_pet_filter()
    
def create_pet():
    try:
        # Parse the request JSON
        request_data = json.loads(request.data)
        
        # Extract the pet data from the request JSON
        pet_name = request_data.get('name', '')
        pet_color = request_data.get('Color', '')  
        pet_characteristics = request_data.get('Characteristics', '')  
        pet_age = request_data.get('Age', '') 
        pet_photo = request_data.get('PetPhoto', '')  
        pet_caring_tips = request_data.get('CaringTips', '')  
        
        # Check if any of the fields are empty
        if not pet_name or not pet_color or not pet_characteristics or not pet_age or not pet_photo or not pet_caring_tips:
            return jsonify(error="All fields are required"), 400
        
        # Generate a unique pet_id using UUID
        pet_id = str(uuid.uuid4())
        
        # Create a new item in DynamoDB with the additional attributes
        client.put_item(
            TableName=TABLE,
            Item={
                'id': {'S': pet_id},
                'name': {'S': pet_name},
                'Color': {'S': pet_color},
                'Characteristics': {'S': pet_characteristics},
                'Age': {'N': str(pet_age)}, 
                'PetPhoto': {'S': pet_photo},  
                'CaringTips': {'S': pet_caring_tips}
            }
        )
        
        return jsonify(message="Pet created successfully", pet_id=pet_id), 201
    
    except Exception as e:
        return jsonify(error=str(e)), 500

def get_pet():
    return jsonify(data=client.scan(TableName=TABLE))

def get_pet_filter():
    try:
        # Extract filter criteria from query parameters
        name = request.args.get('name')
        color = request.args.get('color')
        age = request.args.get('age')

        # Define the filter expression and expression attribute values
        filter_expression = []
        expression_attribute_names = {}
        expression_attribute_values = {}

        if name:
            filter_expression.append("contains(#name, :name)")
            expression_attribute_names["#name"] = "name"
            expression_attribute_values[":name"] = {"S": name}

        if color:
            filter_expression.append("contains(#color, :color)")
            expression_attribute_names["#color"] = "Color"
            expression_attribute_values[":color"] = {"S": color}

        if age:
            filter_expression.append("#age = :age")
            expression_attribute_names["#age"] = "Age"
            expression_attribute_values[":age"] = {"N": str(age)}

        # Construct the filter expression
        if filter_expression:
            filter_expression = " AND ".join(filter_expression)
        else:
            filter_expression = None

        # Perform a scan operation with optional filtering
        response = client.scan(
            TableName=TABLE,
            FilterExpression=filter_expression,
            ExpressionAttributeNames=expression_attribute_names,
            ExpressionAttributeValues=expression_attribute_values,
        )

        # Extract filtered pet data from the items
        items = response.get("Items", [])

        # If no items are found, return an appropriate message
        if not items:
            return jsonify(pets={}, message="No pet records found"), 200

        # Convert DynamoDB items to a list of pets
        pets = [
            {
                "id": item["id"]["S"],
                "name": item["name"]["S"],
                "Color": item["Color"]["S"],
                "Characteristics": item["Characteristics"]["S"],
                "Age": int(item["Age"]["N"]),
                "PetPhoto": item["PetPhoto"]["S"],
                "CaringTips": item["CaringTips"]["S"],
            }
            for item in items
        ]

        return jsonify(pets=pets), 200

    except Exception as e:
        logger.error("An error occurred while retrieving pet records: %s", str(e))
        return jsonify(error=str(e)), 500



def update_pet(pet_id):
    try:
        # Parse the request JSON
        request_data = json.loads(request.data)
        
        # Extract the pet data from the request JSON
        pet_name = request_data.get('name', '')
        pet_color = request_data.get('Color', '')  # Extract color
        pet_characteristics = request_data.get('Characteristics', '')  # Extract characteristics
        pet_age = request_data.get('Age', '')  # Extract age
        pet_photo = request_data.get('PetPhoto', '')  # Extract a single pet photo
        pet_caring_tips = request_data.get('CaringTips', '')  # Extract caring tips
        
        # Check if any of the fields are empty
        if not pet_name or not pet_color or not pet_characteristics or not pet_age or not pet_photo or not pet_caring_tips:
            return jsonify(error="All fields are required"), 400
        
        # Update the item in DynamoDB with the additional attributes
        client.update_item(
            TableName=TABLE,
            Key={
                'id': {'S': pet_id}
            },
            UpdateExpression='SET #name = :name, #color = :color, #characteristics = :characteristics, #age = :age, #petPhoto = :petPhoto, #caringTips = :caringTips',
            ExpressionAttributeNames={
                '#name': 'name',
                '#color': 'Color',
                '#characteristics': 'Characteristics',
                '#age': 'Age',
                '#petPhoto': 'PetPhoto',
                '#caringTips': 'CaringTips',
            },
            ExpressionAttributeValues={
                ':name': {'S': pet_name},
                ':color': {'S': pet_color},
                ':characteristics': {'S': pet_characteristics},
                ':age': {'N': str(pet_age)},  # Note the 'N' type for numeric attribute, and convert to str
                ':petPhoto': {'S': pet_photo},  # Use 'S' for a single string (photo)
                ':caringTips': {'S': pet_caring_tips}
            }
        )
        
        return jsonify(message="Pet updated successfully"), 200
    
    except Exception as e:
        return jsonify(error=str(e)), 500

def delete_pet(pet_id):
    try:
        # Delete the pet item from DynamoDB by pet_id
        client.delete_item(
            TableName=TABLE,
            Key={
                'id': {'S': pet_id}
            }
        )
        
        return jsonify(message="Pet deleted successfully"), 200
    
    except Exception as e:
        return jsonify(error=str(e)), 500

def handler(event, context):
    return awsgi.response(app, event, context)
