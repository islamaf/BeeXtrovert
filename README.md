# BeeXtrovert

## Contributors
https://github.com/LordHomie  
https://github.com/Marvinwidjaja

## How to run
* When the repo is successfully cloned, run ```npm install``` in the IDE terminal and it will install all the dependencies automatically.
* Again, in terminal, run ```npm start``` to run an auto updated server on http://localhost:5000.
* To use the database, you need to use MongoDB Compass, download MongoDB community server from https://www.mongodb.com/try/download/community. When set, click connect and you should be good to go.

## Updates v.1.0
* Set file structure.
* User sign up and login functionalities.
* Implementation of password encryption.
* Session tokens are now active.
* Logout functionality implemented.
* Printing the username of the logged in user in the home page.

## Updates v.1.1
* Admin functionality using AdminBro has been implemented.
* Possibility to add admins from admin page.
* Predefined admins.
* Restricting unauthorized users from accessing admin page.
* Add link to admin page for admins in home page.

## Updates v.1.2
* Replacing birthdate with age groups.
* Adding gender.
* One-Email-One-User implemented.
* Signin and singup pages created.

## Updates v.1.3
* Transition from Handlebars to EJS.
* Database updated with gender and age groups fields.
* Fetch geolocation of client.

## Update v.1.4
* Gender validation using JavaScript.
* Add default "Select range" in age group options.

## Updates v.1.5
* Use RegEx in backend.
* Use Ajax to display error without refreshing the page or submitting the form.
* Username validation.
* Password validation.
* Email validation.
* Signin form validation.
* Flashing errors in frontend.
* Fetching geolocation fixed. Updates in database.
* Style age group selector.

## Updates v.1.5
* Gender validation fixes.

## Updates v.1.6
* Create home page.
* Home page styling.

## Updates v.1.7
* Ability to edit user's username, password and email.
* Showing errors from backend in the frontend in edit page.
* Realtime browser warnings about invalid inputs in username, email and password.
* Fix geolocation. Now saves to session directly. No more strange redirects.
* Add overlay forms when user opts to change username, email or password.

## Updates v.1.8
* Styling 404 error page.
* Styling 500 error page.

## Updates v.1.9
* Create separate JS files for different functionalities instead of being at the end of the HTML code.
* Directly logout users who delete their account.
* Connect button in homepage redirects to sign-in page if user is not logged in.

## Updates v.1.10
* Fetching geolocation through AJAX request, so no need for a full page and forms.
* Create overlay "get started" form which pops up when user is new to the platform.

## Updates v.1.11
* Create separate JS files for different functionalities instead of being at the end of the HTML code.
* Directly logout users who delete their account.
* Connect button in homepage redirects to sign-in page if user is not logged in.

## Updates v.1.12
* Fetching geolocation through AJAX request, so no need for a full page and forms.
* Create overlay "get started" form which pops up when user is new to the platform.

## Updates v.1.13
* Used to get only user country code. Now the country code, country and city are fetched using openstreetmap api.
* Use Axios to get request from openstreetmap api.
* Use latitude and longitude to get client's precise location.
