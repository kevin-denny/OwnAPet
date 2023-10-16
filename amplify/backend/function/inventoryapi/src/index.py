import uuid
import awsgi
import boto3
import os
import json
import logging
from flask_cors import CORS
from flask import Flask, jsonify, request

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

client = boto3.client("dynamodb")
TABLE = "Inventory-dev"
BASE_ROUTE = "/items"

# SES configuration
ses_client = boto3.client("ses", region_name="us-east-1")

@app.route(BASE_ROUTE, methods=['POST', 'GET'])
def inventory_item():
    if request.method == 'POST':
        return create_inventory_item()
    elif request.method == 'GET':
        return get_inventory_items()

@app.route(BASE_ROUTE + '/<string:inventory_item_id>', methods=['PUT', 'DELETE'])
def update_or_delete_inventory_item(inventory_item_id):
    if request.method == 'PUT':
        return update_inventory_item(inventory_item_id)
    elif request.method == 'DELETE':
        return delete_inventory_item(inventory_item_id)

@app.route(BASE_ROUTE + '/report', methods=['POST'])
def send_inventory_report_email():
    try:
        # Get the inventory data from DynamoDB
        inventory_data = client.scan(TableName=TABLE)['Items']

        # Create the email message body as an HTML table
        email_body = "<html><body>"
        email_body += "<h1>Inventory Report</h1>"
        email_body += "<table border='1'><tr><th>Code</th><th>Item Name</th><th>Quantity</th></tr>"

        for item in inventory_data:
            code = item['code']['S']
            item_name = item['itemName']['S']
            quantity = item['quantity']['N']

            email_body += f"<tr><td>{code}</td><td>{item_name}</td><td>{quantity}</td></tr>"

        email_body += "</table>"
        email_body += "</body></html>"

        # Send the email using Amazon SES
        sender_email = "kevinddenny@gmail.com"
        recipient_email = "damiandenny17@gmail.com"
        subject = "Inventory Report"

        ses_client.send_email(
                Source=sender_email,
                Destination={
                    "ToAddresses": [recipient_email]
                },
                Message={
                    "Subject": {
                        "Data": subject
                    },
                    "Body": {
                        "Html": {
                            "Data": email_body
                        }
                    }
                }
            )

        return jsonify(message="Inventory report email sent successfully"), 200


    except Exception as e:
        return jsonify(error=str(e)), 500

def create_inventory_item():
    try:
        # Parse the request JSON
        request_data = json.loads(request.data)
        
        # Extract the inventory item data from the request JSON
        item_name = request_data.get('itemName', '') 
        item_quantity = request_data.get('quantity', '')
        item_remarks = request_data.get('remarks', '')  
        item_photo = request_data.get('photo', '') 
        
        # Generate a unique item_code using UUID
        item_code = str(uuid.uuid4())

        if not item_code or not item_name or not item_quantity or not item_remarks or not item_photo:
            return jsonify(error="All fields are required"), 400
        
        # Create a new item in DynamoDB with the additional attributes
        client.put_item(
            TableName=TABLE,
            Item={
                'code': {'S': item_code},
                'itemName': {'S': item_name},  
                'quantity': {'N': str(item_quantity)},  
                'remarks': {'S': item_remarks}, 
                'photo': {'S': item_photo},  
            }
        )
        
        return jsonify(message="Inventory item created successfully", code=item_code), 201
    
    except Exception as e:
        return jsonify(error=str(e)), 500

def get_inventory_items():
    return jsonify(data=client.scan(TableName=TABLE))

def update_inventory_item(inventory_item_id):
    try:
        # Parse the request JSON
        request_data = json.loads(request.data)
        
        # Extract the updated item data from the request JSON
        updated_item_data = {
            'itemName': request_data.get('itemName', ''),  # Item name
            'quantity': request_data.get('quantity', ''),  # Quantity (as a string)
            'remarks': request_data.get('remarks', ''),    # Remarks
            'photo': request_data.get('photo', ''),        # Photo
        }
        
        # Check if at least one field is provided for updating
        if not any(updated_item_data.values()):
            return jsonify(error="At least one field is required for updating"), 400
        

        update_expression = 'SET '
        expression_attribute_values = {}
        for key, value in updated_item_data.items():
            if value:
                update_expression += f'#{key} = :{key}, '
                expression_attribute_values[f':{key}'] = {'S': value} if key != 'quantity' else {'N': value}
        

        update_expression = update_expression.rstrip(', ')
        
        # Update the item in DynamoDB
        client.update_item(
            TableName=TABLE,
            Key={
                'code': {'S': inventory_item_id}
            },
            UpdateExpression=update_expression,
            ExpressionAttributeNames={f'#{key}': key for key in updated_item_data.keys()},
            ExpressionAttributeValues=expression_attribute_values,
        )
        
        return jsonify(message="Inventory item updated successfully"), 200
    
    except Exception as e:
        return jsonify(error=str(e)), 500


def delete_inventory_item(inventory_item_id):
    try:

        client.delete_item(
            TableName=TABLE,
            Key={
                'code': {'S': inventory_item_id}
            }
        )
        
        return jsonify(message="Inventory item deleted successfully"), 200
    
    except Exception as e:
        return jsonify(error=str(e)), 500

def handler(event, context):
    return awsgi.response(app, event, context)
