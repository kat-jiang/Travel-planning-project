"""Utility file to seed database"""

import os
from datetime import datetime

from server import app
import crud
from model import User, Trip, connect_to_db, db

password = os.environ['PASSWORD']

def load_users():
    """Load users into database"""
    hash_password = crud.hash_password(password)

    kat = crud.create_user(user_id='kat', fname='Kat', lname='Jiang', email='kat@gmail.com', password=hash_password)

    brian = crud.create_user(user_id='brian', fname='Brian', lname='Anderson', email='brian@gmail.com', password=hash_password)

    devin = crud.create_user(user_id='devin', fname='Devin', lname='Jiang', email='devin@gmail.com', password=hash_password)

    hans=crud.create_user(user_id='hans', fname='Hans', lname='Mei', email='hans@gmail.com', password=hash_password)

    christine = crud.create_user(user_id='christine', fname='Christine', lname='Wo', email='chris@gmail.com', password=hash_password)

    nina = crud.create_user(user_id='nina', fname='Nina', lname='Jiang', email='nina@gmail.com', password=hash_password)

    ting=crud.create_user(user_id='ting', fname='Yuting', lname='Jiang', email='ting@gmail.com', password=hash_password)

    phil=crud.create_user(user_id='phil', fname='Phil', lname='Arrington', email='phil@gmail.com', password=hash_password)

    jess=crud.create_user(user_id='jess', fname='Jess', lname='Harrigan', email='jess@gmail.com', password=hash_password)


    db.session.add_all([kat, brian, devin, hans, christine, nina, ting, phil, jess])
    db.session.commit()

def load_trips_and_add_users():
    "Load trips into database and add to user"

    maui = Trip(trip_creator='kat', trip_location='Maui, HI', trip_name="Nina's Wedding", start_date=datetime.strptime("2022-09-02", "%Y-%m-%d"), end_date=datetime.strptime("2022-09-11", "%Y-%m-%d"), latitude=20.798363, longitude=-156.331924, trip_image="https://images.unsplash.com/photo-1483168527879-c66136b56105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTY5Nzl8MHwxfGFsbHx8fHx8fHx8fDE2NDkyMDM0Nzc&ixlib=rb-1.2.1&q=80&w=400")

    seattle = Trip(trip_creator='kat',trip_location='Seattle, WA', trip_name="See the PNW", start_date=datetime.strptime("2022-05-29", "%Y-%m-%d"), end_date=datetime.strptime("2022-06-04", "%Y-%m-%d"), latitude=47.608013, longitude=-122.335167, trip_image="https://images.unsplash.com/photo-1648372795759-f91c2225d752?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTY5Nzl8MHwxfGFsbHx8fHx8fHx8fDE2NDkyNzMwMzc&ixlib=rb-1.2.1&q=80&w=400")

    joshua_tree = Trip(trip_creator='brian',trip_location='Joshua Tree, CA', trip_name="Joshua Tree National Park Trip", start_date=datetime.strptime("2022-10-10", "%Y-%m-%d"), end_date=datetime.strptime("2022-10-14", "%Y-%m-%d"), latitude=33.8734, longitude=-115.9010, trip_image="https://images.unsplash.com/photo-1600680386586-9b4795bee256?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTY5Nzl8MHwxfGFsbHx8fHx8fHx8fDE2NDkyNzMzNDU&ixlib=rb-1.2.1&q=80&w=400")

    chicago = Trip(trip_creator='kat', trip_location='Chicago, IL', trip_name="Chicago Weekend", start_date=datetime.strptime("2022-07-01", "%Y-%m-%d"), end_date=datetime.strptime("2022-07-04", "%Y-%m-%d"), latitude=41.881832, longitude=-87.623177, trip_image="https://images.unsplash.com/photo-1494522855154-9297ac14b55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTY5Nzl8MHwxfGFsbHx8fHx8fHx8fDE2NDkyNzQzOTg&ixlib=rb-1.2.1&q=80&w=400")


    db.session.add_all([maui, seattle, joshua_tree, chicago])
    db.session.commit()

    kat = User.query.get('kat')
    brian = User.query.get('brian')

    kat.trips.append(maui)
    kat.trips.append(seattle)
    kat.trips.append(chicago)

    brian.trips.append(maui)
    brian.trips.append(joshua_tree)
    db.session.commit()


if __name__ == "__main__":
    os.system('dropdb travelplanner')
    os.system('createdb travelplanner')

    connect_to_db(app)
    db.create_all()

    load_users()
    load_trips_and_add_users()
