"""Utility file to seed database"""

import os
from datetime import datetime

import crud
from model import connect_to_db, db
from server import app


def load_users():
    """Load users into database"""

    kat = crud.create_user(user_id='kat', fname='Kat', lname='Jiang', email='kat@gmail.com', password='1234')

    brian = crud.create_user(user_id='brian', fname='Brian', lname='Anderson', email='brian@gmail.com', password='1234')

    christine = crud.create_user(user_id='christine', fname='Christine', lname='Wo', email='chris@gmail.com', password='1234')

    nina = crud.create_user(user_id='nina', fname='Nina', lname='Jiang', email='nina@gmail.com', password='1234')

    db.session.add_all([kat, brian, christine, nina])
    db.session.commit()


if __name__ == "__main__":
    os.system('dropdb travelplanner')
    os.system('createdb travelplanner')

    connect_to_db(app)
    db.create_all()

    load_users()