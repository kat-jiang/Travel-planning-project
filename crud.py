"""CRUD operations."""

from model import db, User, Trip, Activity, Task,connect_to_db
from datetime import datetime, timedelta

# ----- FUNCTIONS FOR USER TABLE ----- #

def create_user(user_id, fname, lname, email, password):
    """Create and return a new user."""

    user = User(user_id=user_id,
                fname=fname,
                lname=lname,
                email=email,
                password=password)

    return user

def get_user_by_id(user_id):
    """Return user info by user_id, else returns None"""
    
    return User.query.get(user_id)

def get_user_by_email(email):
    """Return user email, else returns None """

    return User.query.filter(User.email == email).first()

def get_user_trips(user_id):
    """Return list of user trips """

    user = User.query.get(user_id)
    
    return user.trips

def get_all_users():
    """Return list of all users"""

    return User.query.all()

# ----- FUNCTIONS FOR TRIP TABLE ----- #

def create_trip(trip_creator, trip_location, trip_name, start_date, end_date, longitude, latitude):
    """Create and return a new trip."""

    trip = Trip(trip_creator=trip_creator,
                trip_location=trip_location,
                trip_name=trip_name,
                start_date=start_date,
                end_date=end_date,
                longitude=longitude,
                latitude=latitude)
    return trip

def get_trip_by_id(trip_id):
    """Return trip info by trip_id, else returns None"""
    
    return Trip.query.get(trip_id)

def create_days(start_date, end_date):
    """Based on trip start and end date, create dates for the trip days"""

    trip_dates = []
    delta = end_date - start_date
    for day in range(delta.days + 1):
        date = start_date + timedelta(days=day)
        trip_dates.append(date)

    return trip_dates

# ----- FUNCTIONS FOR ACTIVITY TABLE ----- #

def create_activity(trip_id, activity_name, activity_type, address, phone, longitude, latitude, yelp_id):
    """Create and return an activity."""
    
    activity = Activity(trip_id=trip_id,
                        activity_name=activity_name,
                        activity_type=activity_type,
                        address=address,
                        phone=phone,
                        longitude=longitude,
                        latitude=latitude,
                        yelp_id=yelp_id)
    return activity

def get_activites_by_trip_id(trip_id):
    """Get all activities by trip_id"""

    return Activity.query.filter_by(trip_id=trip_id).all()

def get_activity_by_activity_id(activity_id):
    """Return activity by activity id"""

    return Activity.query.get(activity_id)

def get_null_datetime_activities(trip_id):
    """Return all activities where datetime is null"""

    return Activity.query.filter_by(trip_id=trip_id, datetime= None).all()

def get_datetime_activities(trip_id):
    """Return all activities where datetime is null"""

    return Activity.query.filter(Activity.trip_id==trip_id, Activity.datetime != None).all()

# ----- FUNCTIONS FOR TASK TABLE ----- #

def get_tasks_by_trip_id(trip_id):
    """Return all tasks by trip_id"""

    return Task.query.filter(Task.trip_id==trip_id).all()

def create_task(trip_id, assigned_user, task_item):
    """Create and return a task"""

    task = Task(trip_id=trip_id,
                assigned_user=assigned_user,
                task_item=task_item)

    return task


if __name__ == '__main__':
    from server import app
    connect_to_db(app)