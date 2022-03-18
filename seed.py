"""Utility file to seed database"""

import os
from datetime import datetime

import crud
from model import User, Trip, connect_to_db, db
from server import app


def load_users():
    """Load users into database"""

    kat = crud.create_user(user_id='kat', fname='Kat', lname='Jiang', email='kat@gmail.com', password='1234')

    brian = crud.create_user(user_id='brian', fname='Brian', lname='Anderson', email='brian@gmail.com', password='1234')

    christine = crud.create_user(user_id='christine', fname='Christine', lname='Wo', email='chris@gmail.com', password='1234')

    nina = crud.create_user(user_id='nina', fname='Nina', lname='Jiang', email='nina@gmail.com', password='1234')

    db.session.add_all([kat, brian, christine, nina])
    db.session.commit()

def load_trips_and_add_users():
    "Load trips into database and add to user"

    maui = crud.create_trip(trip_location='Maui, HI', trip_name="Nina's Wedding", start_date=datetime.strptime("2022-09-02", "%Y-%m-%d"), end_date=datetime.strptime("2022-09-11", "%Y-%m-%d"))

    seattle = crud.create_trip(trip_location='Seattle, WA', trip_name="See the PNW", start_date=datetime.strptime("2022-05-29", "%Y-%m-%d"), end_date=datetime.strptime("2022-06-04", "%Y-%m-%d"))

    palm_springs = crud.create_trip(trip_location='Palm Springs, CA', trip_name="Hike Joshua Tree", start_date=datetime.strptime("2022-10-10", "%Y-%m-%d"), end_date=datetime.strptime("2022-10-14", "%Y-%m-%d"))

    db.session.add_all([maui, seattle, palm_springs])
    db.session.commit()

    kat = User.query.get('kat')
    brian = User.query.get('brian')

    kat.trips.append(maui)
    kat.trips.append(seattle)
    kat.trips.append(palm_springs)

    brian.trips.append(maui)
    db.session.commit()

# def load_dates_to_trip():
#     """Load dates to trip"""
#     trips = Trip.query.all()
#     for trip in trips:
#         dates = crud.create_days(trip_id=trip.trip_id, start_date=trip.start_date, end_date=trip.end_date)
#         db.session.add_all(dates)
#         db.session.commit()

if __name__ == "__main__":
    os.system('dropdb travelplanner')
    os.system('createdb travelplanner')

    connect_to_db(app)
    db.create_all()

    load_users()
    load_trips_and_add_users()
    # load_dates_to_trip()