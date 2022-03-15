"""CRUD operations."""

from model import db, User, Trip, UserTrip, Day, Activity, connect_to_db

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


def create_trip(trip_location, trip_name, start_date, end_date, longitude, latitude):
    """Create and return a new trip."""

    trip = Trip(trip_location=trip_location,
                trip_name=trip_name,
                longitude=longitude,
                latitude=latitude,
                start_date=start_date,
                end_date=end_date)

    return trip

# def create_user_trip(user, trip):



if __name__ == '__main__':
    from server import app
    connect_to_db(app)