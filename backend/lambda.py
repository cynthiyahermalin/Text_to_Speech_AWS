import json
import boto3
from botocore.exceptions import ClientError
from io import BytesIO

polly_client = boto3.client('polly')
s3_client = boto3.client('s3')
dynamodb = boto3.resource('dynamodb')


BUCKET_NAME = 'your_bucket_name'
TABLE_NAME = 'your_dynamo_table_name'

def lambda_handler(event, context):
    method = event['httpMethod']
    cors_headers = {
        'Access-Control-Allow-Origin': '*', 
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    if method == 'POST':
        # Handle POST request: Convert Text to Speech and store in S3 and DynamoDB
        try:
            body = json.loads(event['body'])
            text = body.get('text')
            id = body.get('id')

            if not text or not id:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'message': 'Text and id are required.'})
                }

            # Use Polly to convert text to speech
            response = polly_client.synthesize_speech(
                Text=text,
                OutputFormat='mp3',
                VoiceId='Joanna'  # You can change this to any supported voice
            )

            # Save the audio to S3 (use BytesIO to wrap the audio stream)
            audio_key = f"{id}.mp3"
            audio_stream = response['AudioStream']

            # Ensure the stream is handled as binary data by passing it into BytesIO
            audio_data = BytesIO(audio_stream.read())  # Read the audio stream into memory

            s3_client.put_object(
                Bucket=BUCKET_NAME,
                Key=audio_key,
                Body=audio_data,
                ContentType='audio/mp3'
            )

            # Save metadata to DynamoDB
            table = dynamodb.Table(TABLE_NAME)
            metadata = {
                'id': id,
                'text': text,
                'audioUrl': f'https://{BUCKET_NAME}.s3.amazonaws.com/{audio_key}'
            }

            table.put_item(Item=metadata)

            return {
                'statusCode': 200,
                'headers': cors_headers,
                'body': json.dumps({
                    'message': 'Text-to-speech successful',
                    'audioUrl': metadata['audioUrl']
                })
            }

        except ClientError as e:
            return {
                'statusCode': 500,
                'body': json.dumps({'message': 'Failed to generate speech', 'error': str(e)})
            }

    if method == 'GET':
        # Handle GET request: Retrieve metadata from DynamoDB
        try:
            id = event['queryStringParameters'].get('id')

            if not id:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'message': 'ID is required.'})
                }

            table = dynamodb.Table(TABLE_NAME)
            response = table.get_item(Key={'id': id})

            if 'Item' not in response:
                return {
                    'statusCode': 404,
                    'body': json.dumps({'message': 'Record not found.'})
                }

            return {
                'statusCode': 200,
                'body': json.dumps(response['Item'])
            }

        except ClientError as e:
            return {
                'statusCode': 500,
                'body': json.dumps({'message': 'Failed to fetch metadata', 'error': str(e)})
            }
    if method == 'DELETE':
        # Handle DELETE request: Delete from S3 and DynamoDB
        try:
            # Get ID from query parameters
            id = event['queryStringParameters'].get('id')

            if not id:
                return {
                    'statusCode': 400,
                    'body': json.dumps({'message': 'ID is required for deletion.'})
                }

            # Delete from DynamoDB
            table = dynamodb.Table(TABLE_NAME)
            response = table.delete_item(Key={'id': id})

            # Delete from S3
            audio_key = f"{id}.mp3"
            s3_client.delete_object(Bucket=BUCKET_NAME, Key=audio_key)

            return {
                'statusCode': 200,
                'body': json.dumps({'message': f'Item with ID {id} deleted successfully.'}),
                'headers': cors_headers
            }

        except ClientError as e:
            return {
                'statusCode': 500,
                'body': json.dumps({'message': 'Failed to delete item', 'error': str(e)}),
                'headers': cors_headers
            }

    return {
        'statusCode': 405,
        'body': json.dumps({'message': 'Method not allowed'})
    }


