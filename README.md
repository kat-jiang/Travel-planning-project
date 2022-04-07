# Travel-planning-project
Traveling with a group of friends is very fun, but can be difficult to coordinate. My travel app will take the stress out of planning a group trip by allowing multiple users to interact and collaborate on planning their trip. Once a trip has been decided on, users can start by creating a new trip and adding in their trip buddies. The app will generate a list of top rated activities and restaurants for users to explore and add to their itinerary. Users also have the option of using the search bar to find their own activities. Once activities are added to the itinerary, users can edit the date and times to their liking. If users have trouble deciding on an activity or time, a poll can be made and all users can vote on their choice. In addition, users have the option to assign tasks to other users to keep each other organized. 
## Table of Contents
* [Technologies](#technologies-used)
* [Features](#features)
* [Future Improvements](#future-improvements)
* [Set Up](#set-up)
* [About Me](#about-me)
## Technologies Used
* Backend: Python, Flask, SQLAlchemy
* Database: SQL, PostgreSQL
* Frontend: Javascript, React, HTML, Bootstrap, AJAX, JSON, Jinja2
* APIs: Mapbox API (Mapbox GL JS, Mapbox Geocoding API), Yelp Fusion API, Unsplash Image API
## Features
* To begin users must log in or create an account
* User's homepage displays a list all their trips with markers on the map
* Users can create a new trip with the location and dates
* Users can click into their trips to start planning
* Users can add friends to the trip
* Users can see top rated restaurants and activities in the area
* Users can search for their own activities
* Activities can be added to the intinerary
* The intinerary page displays the trip itinerary and activities that have been added but not given a date/time
* Users can assign tasks to each other to remind themselves of things to do pre-trip
* If users have trouble deciding on activities, they can create a poll for other users to vote on
## Future Improvements
## Set Up
To run this project, first clone or fork this repo:
```
git clone https://github.com/kat-jiang/Travel-planning-project.git
```
Create and activate a virtual environment inside your directory
```
virtualenv env
source env/bin/activate
```
Install the dependencies:
```
pip install -r requirements.txt
```
Sign up to obtain keys for the Mapbox API, Yelp API, and Unsplash Images API

Save your API keys in a file called `secrets.sh` using this format:
```
export APP_KEY="YOUR_KEY_GOES_HERE"
```
Source your keys from your `secrets.sh` file into your virtual environment:
```
source secrets.sh
```
Set up the database:
```
python3 model.py
```
Run the app:
```
python3 server.py
```
You can now navigate to 'localhost:5000/' to access the travel app
## About Me
😸 Hi, my name is Kat and I'm a software engineer. This travel app is my first full stack application which I created in four weeks as my final project at Hackbright, a 12-week accelerated software engineering fellowship. Feel free to connect on [LinkedIn](https://www.linkedin.com/in/jiangkatherine/)!
