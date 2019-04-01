# ict-gnu-final-sem-project-2015-ibm-group-14_force_multiplier
ict-gnu-final-sem-project-2015-ibm-group-14_force_multiplier created by GitHub Classroom

FORCE MULTIPLIER

For Accessing Force Multiplier API one can use the following URL:-https://forcemultiplier.eu-gb.mybluemix.net
For example for using SignUp API the url is like :-https://forcemultiplier.eu-gb.mybluemix.net/api/signup

The API are deploy at IBM Cloud in Cloud Foundry Application specify SDK for nodejs and the database use by the API is Mongo Atlas which is another platform to host Databases.The Connectivity is kept under config folder ->config.json.

Access to Mongo Atlas Database
Mongo Atlas provides connection string. When you login into the account than at left side of window a connect option is ther.Than select Connect to the Application from the list and copy the url and add that url to config.json(in database part) file which is reside in config foler.

If you want to use my Mongo Atlas database Please send a request.

Firebase Cloud Messaging(FCM) is use to send the notification to the field engineer when the new task/customer created into the system and second one when the newly task is assigned to the field engineer so that field engineer received a notification that "You Have Assign New Task".To see the code for push notification you can see the file pushnotification.js in backend folder.

API's

*{{localhost}} = "https://forcemultiplier.eu-gb.mybluemix.net"

1. To signup into system (POST Method)
      {{localhost}}/api/signup?name="value"&emailAddress="value"&password="value&userCode="value"
      
2. To login into system  (POST Method)
      {{localhost}}/api/login/<emailAddress>/<password>

3. SET Field Engineer Location with status  (POST Method)
      {{localhost}}/api/setfieldengdata?latitude="value"&longitude="value"&status="value"

4. To Set Task  (POST Method)
      {{localhost}}/api/set-task?custName="value"&latitude="value"&longitude="value"&reqTime="value"&description="value"

5. To Assign Eng  (GET Method)
      {{localhost}}/api/assign-eng/taskid

6. To Get Field Engineer Data with TASKS  (GET Method)
      {{localhost}}/api/getfieldengdata/fieldengID

7. CheckOut API for Field Eng.  (GET Method)
      {{localhost}}/api/check-out/task-id

To Run the app locally

1. Install Node.js.

2. cd into this project's root directory.

3. Run npm install to install the application dependencies.

4. Run node server.js to start the app.

5. Access the running api in a browser at http://localhost:3000.

6. One can import this file ForceMultiplier.postman_collection.json in POSTMAN and can test the api.
