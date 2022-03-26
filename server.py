"""Server for travel planning app."""

from datetime import datetime
from flask import (Flask, render_template, request, flash, session, redirect, jsonify)
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined
import os
import requests

app = Flask(__name__)
app.jinja_env.undefined = StrictUndefined

app.secret_key = 'SECRET_KEY'
YELP_API_KEY = os.environ['YELP_KEY']

# ----- ROUTES FOR HOME/LOGIN ----- #

@app.route("/")
def homepage():
    """View homepage"""
    #check if user is in session
    user_id = session.get('user')
    if user_id:
        return redirect(f"/homepage/{user_id}")

    return render_template("homepage.html")


@app.route("/register", methods=["POST"])
def register():
    """Process registration."""

    #get user information from registration form
    fname = request.form.get("fname")
    lname = request.form.get("lname")
    email = request.form.get("email")
    user_id = request.form.get("username").lower()
    password = request.form.get("password").rstrip()

    #check db if user already exists
    user_exists = crud.get_user_by_id(user_id)
    email_exists = crud.get_user_by_email(email)

    if user_exists:
        flash(f"{user_id} already exists!")

    if email_exists:
        flash(f"{email} already exists!")
    
    #create new user, add to db
    if user_exists is None and email_exists is None:
        new_user = crud.create_user(user_id=user_id,
                                    fname=fname,
                                    lname=lname,
                                    email=email,
                                    password=password)
        db.session.add(new_user)
        db.session.commit()

        flash("Account created successfully!")

    return redirect ("/")


@app.route("/login", methods=["POST"])
def login():
    """Process user login."""
    #retrieves information from log-in form
    user_id = request.form.get("username").lower()
    password = request.form.get("password")

    # query db for user_id
    user = crud.get_user_by_id(user_id)

    #if user does not exist, redirect
    if user is None:
        flash('User does not exist!')
        return redirect('/')

    #if passwords match, set session to user_id, send user to user_page
    if user.password == password:
        session['user'] = user_id
        return redirect (f"/homepage/{user_id}")
    else:
        flash("Sorry, passwords do not match!")
        return redirect('/')


@app.route("/logout")
def logout():
    """Log user out"""
    #delete session
    session.pop('user')

    return redirect('/')

# ----- ROUTES FOR USERPAGE ----- #

@app.route('/homepage/<user_id>')
def user_page(user_id):
    """Display user's trip page"""
    #prevent other users from seeing another's trippage
    if session.get('user') != user_id:
        return redirect('/')

    #get user and trips from db
    user = crud.get_user_by_id(user_id)
    trips = user.trips
    
    return render_template('user_page.html', user=user, trips=trips)

@app.route('/add-trip', methods=["POST"])
def add_trip():
    """Add trip to user's trip page"""

    #retrieve trip info from form
    trip_location = request.json.get("location")
    trip_name = request.json.get("name")
    start_date_str = request.json.get("start")
    end_date_str = request.json.get("end")
    user_id = request.json.get("user_id")
    longitude = float(request.json.get("longitude"))
    latitude = float(request.json.get("latitude"))

    #without ajax
    # trip_location = request.form.get("location")
    # trip_name = request.form.get("trip-name")
    # start_date_str = request.form.get("trip-start")
    # end_date_str = request.form.get("trip-end")

    #convert date strings to datetime
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

    #create trip and add to db
    new_trip = crud.create_trip(trip_creator=user_id,trip_location=trip_location, trip_name=trip_name, start_date=start_date, end_date=end_date, longitude=longitude, latitude=latitude)

    db.session.add(new_trip)
    db.session.commit()

    #add trip to User in db
    user = crud.get_user_by_id(user_id)
    user.trips.append(new_trip)
    db.session.commit()

    #convert python object to dictionary
    new_trip = new_trip.to_dict()

    return jsonify(new_trip)

@app.route('/delete-trip', methods=["POST"])
def delete_trip():
    """Delete a trip from user's trip page"""

    trip_id = request.json.get('trip_id')
    #first delete childs (activity/task)
    tasks = crud.get_tasks_by_trip_id(trip_id)
    for task in tasks:
        db.session.delete(task)
        db.session.commit()
    activities = crud.get_activites_by_trip_id(trip_id)
    for activity in activities:
        db.session.delete(activity)
        db.session.commit()
    #then delete trip
    trip = crud.get_trip_by_id(trip_id)
    db.session.delete(trip)
    db.session.commit()

    return "Trip has been deleted"

@app.route('/remove-trip', methods=["POST"])
def remove_trip():
    """Remove a trip from user's trip page"""
    # get info from ajax
    trip_id = request.json.get('trip_id')
    user_id = request.json.get('user_id')
    #retrieve trip and user info from db
    trip = crud.get_trip_by_id(trip_id)
    user = crud.get_user_by_id(user_id)
    # remove user and commit()
    trip.users.remove(user)
    db.session.commit()

    return "Trip has been removed"

# ----- ROUTES FOR TRIP PAGE ----- #

@app.route('/trip/<trip_id>')
def display_trip_info(trip_id):
    """Show trip info about trip"""

    trip = crud.get_trip_by_id(trip_id)

    #prevent unauthorized users from seeing trippage
    if session.get('user') not in [user.user_id for user in trip.users]:
        return redirect('/')

    return render_template('trip.html', trip=trip)

# ----- ROUTES FOR TRIP INVITE ----- #

@app.route('/trip/<trip_id>/invite')
def invite_friends(trip_id):
    """Invite friends into trip"""
    trip = crud.get_trip_by_id(trip_id)

    trip_users = trip.users

    all_users = crud.get_all_users()

    #prevent unauthorized users from seeing trippage
    if session.get('user') not in [user.user_id for user in trip.users]:
        return redirect('/')

    return render_template('invite-friends.html', trip=trip, trip_users=trip_users, all_users=all_users)

@app.route('/add-friend', methods=["POST"])
def add_friend_to_trip():
    """Add user to trip"""
    #retrieve user and trip id from form
    user_id = request.form.get("user-id")
    trip_id = request.form.get("trip-id")
    #retrieve user and trip info from db
    trip = crud.get_trip_by_id(trip_id)
    user = crud.get_user_by_id(user_id)
    #add user to trip and commit to db
    trip.users.append(user)
    db.session.commit()

    return redirect(f'/trip/{trip_id}/invite')

# ----- ROUTES FOR TRIP ACTIVITY ----- #

@app.route('/trip/<trip_id>/activities')
def display_trip_activities(trip_id):
    """Display activities page nav"""

    trip = crud.get_trip_by_id(trip_id)

    #prevent unauthorized users from seeing trippage
    if session.get('user') not in [user.user_id for user in trip.users]:
        return redirect('/')

    return render_template('activities.html', trip=trip, activities=None)

@app.route('/api/activities')
def get_activities():
    """Get top-rated yelp activities"""
    trip_id = request.args.get('trip_id')
    trip = crud.get_trip_by_id(trip_id)
    #make api request to Yelp-API
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {'Authorization': f'Bearer {YELP_API_KEY}'}
    queries = {
        'location': trip.trip_location,
        'sort_by': 'rating',
        'limit': 10,
        'categories': 'arts,active'
    }

    res = requests.get(url, headers=headers, params=queries)

    data = res.json()

    activities = data.get('businesses', [])

    # return render_template('activities.html', activities=activities, trip=trip)
    return jsonify(activities)

@app.route('/api/restaurants' )
def get_restaurants():
    """Get top-rated yelp restaurants/food"""

    trip_id = request.args.get('trip_id')
    trip = crud.get_trip_by_id(trip_id)
    #make api request to Yelp-API
    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {'Authorization': f'Bearer {YELP_API_KEY}'}
    queries = {
        'location': trip.trip_location,
        'sort_by': 'rating',
        'limit': 10,
        'categories': 'restaurant,food'
    }

    res = requests.get(url, headers=headers, params=queries)

    data = res.json()

    activities = data.get('businesses', [])

    # flash("Activity has been added")
    # return render_template('activities.html', activities=activities, trip=trip)
    return jsonify(activities)

@app.route('/api/search')
def search_activities():
    """Get top-rated yelp search"""
    trip_id = request.args.get('trip_id')
    trip = crud.get_trip_by_id(trip_id)

    search = request.args.get("search")

    url = 'https://api.yelp.com/v3/businesses/search'
    headers = {'Authorization': f'Bearer {YELP_API_KEY}'}
    queries = {
        'location': trip.trip_location,
        'limit': 10,
        'categories': f'{search}',
    }

    res = requests.get(url, headers=headers, params=queries)

    data = res.json()

    activities = data.get('businesses', [])

    # return render_template('activities.html', activities=activities, trip=trip)
    return jsonify(activities)

# ----- ROUTES FOR TRIP ITINERARY ----- #

@app.route('/trip/<trip_id>/itinerary')
def display_trip_itinerary(trip_id):
    """Show trip itinerary"""
    trip = crud.get_trip_by_id(trip_id)
    
    trip_dates = crud.create_days(trip.start_date, trip.end_date)

    #format datetime to work in input datetime
    start_date =trip.start_date.strftime("%Y-%m-%dT00:00")
    end_date =trip.end_date.strftime("%Y-%m-%dT00:00")

    unsorted_activities = crud.get_null_datetime_activities(trip_id)

    dated_activities = crud.get_datetime_activities(trip_id)

    itin_dict = {}
    for date in trip_dates:
        activity_list = []
        for activity in dated_activities:
            if activity.datetime.date() == date.date():
                activity_list.append(activity)
        activity_list.sort(key=lambda activity:activity.datetime)
        itin_dict[date.date()] = activity_list
        
    #prevent unauthorized users from seeing trippage
    if session.get('user') not in [user.user_id for user in trip.users]:
        return redirect('/')

    return render_template('itinerary.html', trip=trip, trip_dates=trip_dates, start_date=start_date, end_date=end_date, activities=unsorted_activities, sorted_activities=itin_dict)

     
@app.route('/add-to-itinerary', methods=["POST"])
def add_to_itinerary():
    """Add activity/restaurant to itinerary, creates Activity instance"""
    #retrieve data from ajax
    trip_id = request.json.get("trip_id")
    yelp_id = request.json.get("yelp_id")

    #make call to yelp to retrieve trip info
    url = f'https://api.yelp.com/v3/businesses/{yelp_id}'
    headers = {'Authorization': f'Bearer {YELP_API_KEY}'}

    res = requests.get(url, headers=headers)
  
    activity = res.json()

    #parse out data
    cat_list=[]
    for category in activity.get('categories'):
        cat_list.append(category['title'])
    activity_type = ", ".join(cat_list)

    address = ", ".join(activity.get('location').get('display_address'))

    activity_name = activity.get('name')
    phone = activity.get('display_phone')
    longitude = activity.get('coordinates').get('longitude')
    latitude = activity.get('coordinates').get('latitude')

    #create Activity instance and add to db
    activity = crud.create_activity(trip_id=trip_id,
                        activity_name=activity_name,
                        activity_type=activity_type,
                        address=address,
                        phone=phone,
                        longitude=longitude,
                        latitude=latitude,
                        yelp_id=yelp_id)
    db.session.add(activity)
    db.session.commit()

    return "Activity has been added to itinerary"

@app.route('/add-own-activity', methods=["POST"])
def add_own_activity():
    """Add own activity to itinerary, creates Activity instance"""
    #retrieve data from ajax
    trip_id = request.json.get("trip_id")
    activity_name = request.json.get("activity_name")
    activity_type = request.json.get("activity_type")
    address = request.json.get("address")
    phone = request.json.get("phone")
    date_time = request.json.get("datetime")
    note = request.json.get("note")

    #create Activity instance and add to db
    activity = crud.create_activity(trip_id=trip_id,
                        activity_name=activity_name,
                        activity_type=activity_type,
                        address=address,
                        phone=phone,
                        longitude=None,
                        latitude=None,
                        yelp_id=None)
    db.session.add(activity)
    activity.datetime = date_time
    activity.note = note
    db.session.commit()

    return "Activity has been added to itinerary"

@app.route('/add-datetime', methods=["POST"])
def add_datetime_to_activity():
    """Add datetime to Activity instance"""
    #retrieve activity id and datetime from form
    activity_id = request.json.get("activity_id")
    date_time = request.json.get("datetime")
    note = request.json.get("note")
    #get activity object and add datetime instance, commit to db
    activity=crud.get_activity_by_activity_id(activity_id)
    activity.datetime = date_time
    activity.note = note
    db.session.commit()

    return "Date and time added to activity"

@app.route('/delete-activity', methods=["POST"])
def remove_activity():
    """Remove activity from db"""
    #retrieve activity id and datetime from form
    activity_id = request.json.get("activity_id")

    #get activity object and remove from db
    activity=crud.get_activity_by_activity_id(activity_id)
    db.session.delete(activity)
    db.session.commit()

    return "Activity removed"

# ----- ROUTES FOR TRIP TASK ----- #

@app.route('/trip/<trip_id>/task-list')
def display_trip_tasks(trip_id):
    """Display trip tasks for all users"""

    trip=crud.get_trip_by_id(trip_id)

    #prevent unauthorized users from seeing trippage
    if session.get('user') not in [user.user_id for user in trip.users]:
        return redirect('/')

    return render_template('tasks.html', trip=trip)

@app.route("/tasks.json")
def get_tasks_json():
    """Return a JSON response with all tasks."""

    trip_id = request.args.get("tripId")
    #retrieve all task by trip
    tasks = crud.get_tasks_by_trip_id(trip_id)
    #make a list of task dict items
    task_list = []
    for task in tasks:
        task_list.append(task.to_dict())
    #return users in the trip as dictionary
    trip = crud.get_trip_by_id(trip_id)
    trip_users_list = []
    for user in trip.users:
        trip_users_list.append(user.to_dict())

    return jsonify({"tasks": task_list, "users": trip_users_list})


@app.route('/add-task', methods=["POST"])
def add_task():
    """Add a new task to the DB."""

    # get info from js
    trip_id = request.json.get("tripId")
    assigned_user = request.json.get("assignedUser")
    task_item = request.json.get("task")
    # create task instance and add to db
    new_task = crud.create_task(trip_id=trip_id,
                            assigned_user=assigned_user,
                            task_item=task_item)
    db.session.add(new_task)
    db.session.commit()
    # return task object as dictionary
    new_task_dict = new_task.to_dict()

    return jsonify({"success": True, "taskAdded": new_task_dict})

# ----- ROUTES FOR MAPS ----- #

@app.route('/api/trips')
def get_trip_locations():
    """Return list of trip long/lats"""

    user_id = request.args.get('user_id')
    user = crud.get_user_by_id(user_id)

    trips = []
    for trip in user.trips:
        trips.append(trip.to_dict())

    return jsonify(trips)



if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)