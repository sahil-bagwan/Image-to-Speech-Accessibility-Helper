import boto3
import os
import uuid

def lambda_handler(event, context):
    
    recordId = str(uuid.uuid4())
    print(event)
    voice = event["voice"]
    comment = event["text"]
    image = event["image"]
    print('Generating new DynamoDB record, with ID: ' + recordId)
    print('Input Text: ' + comment)
    print('Selected voice: ' + voice)
    bucket='projectaudiobucket'
    photo=image
    text_count=detect_text(photo,bucket,comment,voice, recordId)
    
    
    #Sending notification about new post to SNS
    client = boto3.client('sns')
    client.publish(
        TopicArn = os.environ['SNS_TOPIC'],
        Message = recordId
    )
    
    return recordId

def detect_text(photo, bucket,comment,voice,recordId):

    client=boto3.client('rekognition')

    response=client.detect_text(Image={'S3Object':{'Bucket':'projectaudiobucket','Name':photo}})
                        
    textDetections=response['TextDetections']
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DB_TABLE_NAME'])
    imageText = ""
    
    print ('Detected text\n----------')
    for text in textDetections:
            print ('Detected text:' + text['DetectedText'])
            print ('Confidence: ' + "{:.2f}".format(text['Confidence']) + "%")
            print ('Id: {}'.format(text['Id']))
            if 'ParentId' in text:
                print ('Parent Id: {}'.format(text['ParentId']))
            print ('Type:' + text['Type'])
            if( text['Type'] == 'LINE'):
                imageText += text['DetectedText']+" "
            
    table.put_item(
        Item={
            'id' : recordId,
            'text' : imageText,
            'comment': comment,
            'voice' : voice,
            'status' : 'PROCESSING'
        }
    )
    client = boto3.client('sns')
    client.publish(
        TopicArn = os.environ['SNS_TOPIC'],
        Message = recordId
    )
    
    return recordId