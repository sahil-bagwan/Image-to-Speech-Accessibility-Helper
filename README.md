
# Image to Speech: Accessibility Helper 

![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/Intr.png)

Machine replication of human functions, like reading, is an ancient dream. However, over the last five decades, machine reading has grown from a dream to reality. 
Image to speech conversion is a trending aspect of computer technology. It determines an important criterion in which we interact with the system and interfaces across a variety of platforms.
It is a popular feature that lets your computer or phone read images aloud to you and is commonly used as an accessibility feature to help people who have trouble reading on-screen text, but it's also convenient for those who want to be read to.
Though the systems rely on a computerized voice speaking to you, in recent years these voices have become much more natural sounding. Many modern TTS voices are almost indistinguishable from humans, and some even incorporate natural human inflections to make them sound more lifelike. 

# Goal:
While there are many systems and applications already developed that detect objects, scenes, and faces; extract text; or systems which convert text to speech,a very few systems have been developed to extract textual information which is embedded in an image or scene and convert it to speech.
So with our project we intend to design a model/system to extract textual information from JPG, PNG files and convert it to speech.
The functionality of such a system can help to interpret information within images for people with disabilities. 

# Process Outline:

![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/PD.png)

## Part 1: 
Here we provide a functionality for the user to upload images they want to read out with a webpage hosted on Amazon S3. Those images will be stored in Dynamodb for the further process.
## Part 2: 
The extraction of the text from the uploaded images will happen in this part of the pipeline. This process will take place with the help of Amazon Rekognition Image. Rekognition Image uses deep neural network models to detect and label thousands of objects and scenes in your images, and we are continually adding new labels and facial recognition features to the service. 
## Part 3:
The extracted text from the previous steps will get stored in Dynamodb to be retrieved for future use as well as will be used as an input to the Text-to-Speech conversion job.
## Part 4:
In the last part of the pipelined the stored extracted text will get converted to speech and an mp3 will be generated as an output. One can play the mp3 by using the functionality made available on the webpage.

# System Architecture: 

![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/IMGtoTextAccessibility_Helper%20(2).png)

# Steps to follow:
## 1. Create and host a webpage on Amazon S3
Static webpages are the webpages containing static content or client-side scripts. We’re using static webpage here to support serverless architecture. We’re using Amazon SDKs to write, configure, set end points and update the webpages for static web hosting.(Upload HTML, CSS and JS file to S3).
![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/staticwebpage.png)
#### Note: Replace API_Endpoint with your API Gateway generated endpoint.

### Setting to host the static webpage.

![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/Screenshot%202020-12-17%20232321.png)

## 2. Create an IAM role with the following permissions
![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/IAMRole.png)

## 3. Create a DynamoDB with a 'Id' as a partition key
![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/Screenshot%202020-12-17%20233037.png)

## 4. Creating and deploying the Lambda Functions (Ref. the uploaded code)
This lambda function will be doing following tasks:
(a) Create "New Image Upload" Lambda function. This lambda is responsible to upload an image to S3 bucket, start the text detection job and initiate SNS
(b) Create "Get Information" Lambda function. This lambda retrieves the information about the posts
(c) Create " Text to Audio" Lambda function. This lambda is responsible to convert the extracted text from the image to audio
#### Note: replace Table_Name with your original DynamoDB table name and replace SNS_Topic with your SNS Topic name

## 5. Create a SNS Topic
Add a trigger to the New Image Upload(New Post) and Text-to-Audio lambda functions and specify the SNS topic in it.
![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/Screenshot%202020-12-17%20233451.png)

## 6. Create an API Gateway and add two methods to it
(a) Get: Configure the get method with the "Get Information" lambda
![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/API%20GATEWAY%20(1).png)

### Setup url query string parameter 
![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/Screenshot%202020-12-17%20233705.png)

(b) Post: Configure the post method with the  "New Image Upload" lambda
![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/APIGatewayPost.png)
(c) Enable CORS: CORS is a browser security feature that restricts cross-origin HTTP requests that are initiated from scripts running in the browser. If your REST API's resources receive non-simple cross-origin HTTP requests, you need to enable CORS support.

## 7. Creating a new indentity pool and keep unauthenticated users checked so that anybody can access the application without logging in
![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/Screenshot%202020-12-18%20080610.png)

#### Note: add the identity pool authentication code in the JS file.
![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/Screenshot%202020-12-18%20102431.png)

## 8. Go to the web page to access your Image to Speech application 
 http://projectaudiobucket.s3-website-us-east-1.amazonaws.com/
(a) Upload a .png or .jpg image, select from the voice options and click on the "Say it!" button
(b) You will get a post id. Retrieve the audio file for the generated post id using the search functionality
(c) You can play or download the generated audio file using the web interface

![picture](https://github.com/Team5CSYEFall/Project/blob/main/images/Final.png)