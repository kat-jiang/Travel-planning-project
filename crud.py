"""CRUD operations."""

from model import db, User, Trip, UserTrip, Day, Activity, connect_to_db
from datetime import datetime, timedelta

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

    users = User.query.all()

    return users

def create_trip(trip_location, trip_name, start_date, end_date):
    """Create and return a new trip."""

    trip = Trip(trip_location=trip_location,
                trip_name=trip_name,
                start_date=start_date,
                end_date=end_date)
                # longitude=longitude,
                # latitude=latitude,
    return trip

def get_trip_by_id(trip_id):
    """Return trip info by trip_id, else returns None"""
    
    return Trip.query.get(trip_id)

def create_days(trip_id, start_date, end_date):
    """Based on trip start and end date, create Day instances for num of days"""
    trip = get_trip_by_id(trip_id)

    delta = end_date - start_date
    for day in range(delta.days + 1):
        date = start_date + timedelta(days=day)
        day = Day(date=date)
        trip.days.append(day)

    return trip.days

def get_all_days(trip_id):
    """return all days associated with trip"""

    days = Day.query.filter_by(trip_id=trip_id).all()

    return days


if __name__ == '__main__':
    from server import app
    connect_to_db(app)