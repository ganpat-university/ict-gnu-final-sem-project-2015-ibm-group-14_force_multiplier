# ict-gnu-final-sem-project-2015-ibm-group-14_force_multiplier
ict-gnu-final-sem-project-2015-ibm-group-14_force_multiplier created by GitHub Classroom

FORCE MULTIPLIER

For Accessing Force Multiplier API one can use the following URL:-https://forcemultiplierapi.eu-gb.mybluemix.net
For example for using SignUp API the url is like :-https://forcemultiplierapi.eu-gb.mybluemix.net/api/signup

The API are deploy at IBM Cloud in Cloud Foundry Application specify SDK for nodejs and the database use by the API is Mongo Atlas which is another platform to host Databases.The Connectivity is kept under config folder ->config.json.

API's

1. To signup into system (POST Method)
      {{localhost}}/api/signup?name="value"&emailAddress="value"&password="value&userCode="value"
      
2. To login into system  (POST Method)
      {{localhost}}/api/login/<emailAddress>/<password>

3. SET Field Engineer Location with status  (POST Method)
      {{localhost}}/api/setfieldengdata?latitude="value"&longitude="value"&status="value"

4. To Set Task  (POST Method)
      {{localhost}}/api/set-task?custName="value"&latitude="value"&longitude="value"&reqTime="value"&description="value"

5. To Assign Eng  (GEt Method)
      {{localhost}}/api/assign-eng/taskid

6. To Get Field Engineer Data with TASKS  (GET Method)
      {{localhost}}/api/getfieldengdata/fieldengID
