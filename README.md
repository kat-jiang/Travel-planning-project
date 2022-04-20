# Travelbugs ![Logo](travel-project/static/img/dragonfly-logo.svg)
Plan. Collaborate. Travel. Repeat.

Traveling with a group of friends is very fun, but can be difficult to coordinate. TravelBugs will take the stress out of planning a group trip by allowing multiple users to interact and collaborate on planning their trip. Users can create a trip, invite their friends and start building the itinerary together. Users can explore the local area for activities, assign tasks to each other and create polls if they have trouble deciding on an activity.
## Table of Contents
* 🤖 [Technologies](#technologies-used)
* ⭐ [Features](#features)
* 🚀 [Future Improvements](#future-improvements)
* 📖 [Set Up](#set-up)
* 😸 [About Me](#about-me)
## Technologies Used
* Backend: Python, Flask, SQL, PostgreSQL, SQLAlchemy
* Frontend: Javascript, React JS, HTML, CSS, Bootstrap, AJAX, JSON, Jinja2
* APIs: Mapbox API (Mapbox GL JS, Mapbox Geocoding API), Yelp Fusion API, Unsplash Image API, Chart.js
## Features
🎥 [See a full video walk-through](https://www.youtube.com/watch?v=9KIX7lISdeE)

**Login**
* To begin, users can create an account or login
* Passwords are first hashed using Argon2 and then saved to the database for added security

**User Homepage**
* User's homepage displays a list all their trips with markers on the map
* Users can create a new trip with the location and dates. I added the mapbox geocoding API to autocomplete the city names as the user types and save the coordinates in my database.
* Users can delete a trip if they are the creator or remove if a trip from their list if they can no longer attend
* To start planning, users can click on the trip

**Trips**

**Friend-Invite**
* Users can add friends to the trip

**Explore Activities**
* Users can see top rated restaurants and activities from Yelp's Fusion API
* Users can search for their own activities
* A map displays a marker and popup for searched activities
* Activities can be added to the intinerary

**Itinerary**
* The intinerary page displays the trip itinerary sorted by date and time and list of added activities
* Users also have the option to add their own custom activities
* To add an activity to the itinerary, user can add a date and time
* A custom marker is added to the map to correspond to the day for each activity in the itinerary

**Trip Tasks**
* Users can assign tasks to each other to remind themselves of things to do pre-trip

**Trip Polls**
* If users have trouble deciding on activities, they can create a poll for other users to vote on

## Future Improvements
* Add a profile page so users can share their trip itineraries
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
python3 seed.py
```
Run the app:
```
python3 server.py
```
You can now navigate to 'localhost:5000/' to access the travel app
## About Me
😸 Hi, my name is Kat and I'm a software engineer. This travel app is my first full stack application which I created in four weeks as my final project at Hackbright, a 12-week accelerated software engineering fellowship. Feel free to connect on [LinkedIn](https://www.linkedin.com/in/jiangkatherine/)!
