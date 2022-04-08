"""Models for travel planning app."""

from flask_sqlalchemy import SQLAlchemy
from passlib.hash import argon2
from datetime import datetime

db = SQLAlchemy()


class User(db.Model):
    """A user."""

    __tablename__ = "users"

    user_id = db.Column(db.String(50), primary_key=True)
    fname = db.Column(db.String(50), nullable=False)
    lname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String, nullable=False)

    # -- relationship to Trip/Task/Option --
    # trips = db.relationship("Trip", secondary="users_trips", backref="users")
    # trips_created = db.relationship("Trip", backref="creator")
    tasks = db.relationship("Task", backref="user")
    options = db.relationship("Option", secondary="votes", backref="users")

    def to_dict(self):
        """return data as dictionary"""
        trip_dict = {'user_id': self.user_id,
                    'fname': self.fname,
                    'lname': self.lname,
                    'email': self.email,
        }
        return trip_dict

    def __repr__(self):
        return f'<User user_id={self.user_id} email={self.email}>'


class Trip(db.Model):
    """A trip."""

    __tablename__ = "trips"

    trip_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    trip_creator = db.Column(db.String(25), db.ForeignKey("users.user_id"), nullable=False)
    trip_location = db.Column(db.String, nullable=False)
    trip_name = db.Column(db.String, default=trip_location)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    trip_image = db.Column(db.String)

    #-- relationships to User/Activity/Task/Poll --
    users = db.relationship("User", secondary="users_trips", backref="trips")
    creator = db.relationship("User", backref="trips_created")
    activities = db.relationship("Activity", backref="trip")
    tasks = db.relationship("Task", backref="trip")
    polls = db.relationship("Poll", backref="trip")

    def to_dict(self):
        """return data as dictionary"""
        trip_dict = {'trip_id': self.trip_id,
                    'trip_location': self.trip_location,
                    'trip_name': self.trip_name,
                    'start_date': self.start_date,
                    'end_date': self.end_date,
                    'longitude': self.longitude,
                    'latitude': self.latitude,
                    'trip_image': self.trip_image,
        }
        return trip_dict

    def __repr__(self):
        return f'<Trip trip_id={self.trip_id} trip_location={self.trip_location} trip_name={self.trip_name}>'


class UserTrip(db.Model):
    """Association Table: Trip for a specific user"""

    __tablename__ = "users_trips"

    user_trip_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.String(25), db.ForeignKey("users.user_id"), nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.trip_id"), nullable=False)

    def __repr__(self):
        return f'<UserTrip user_trip_id={self.user_trip_id} user_id={self.user_id} trip_id={self.trip_id}>'


class Task(db.Model):
    """A task for the trip"""

    __tablename__ = "tasks"

    task_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.trip_id"), nullable=False)
    assigned_user = db.Column(db.String(25), db.ForeignKey("users.user_id"), nullable=False)
    task_item = db.Column(db.String, nullable=False)
    completed = db.Column(db.Boolean)

    #-- relationship to Trip and User --
    # trip = db.relationship("Trip", backref="tasks")
    # user = db.relationship("User", backref="tasks")

    def to_dict(self):
        """return data as dictionary"""
        task_dict = {'task_id': self.task_id,
                    'trip_id': self.trip_id,
                    'assigned_user': self.assigned_user,
                    'task_item': self.task_item,
                    'completed': self.completed,
        }
        return task_dict

    def __repr__(self):
        return f'<Task task_id={self.task_id} trip_id={self.trip_id} assigned_user={self.assigned_user} task_item={self.task_item} completed={self.completed}>'


class Activity(db.Model):
    """An activity for the trip"""

    __tablename__ = "activities"

    activity_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.trip_id"), nullable=False)
    activity_name = db.Column(db.String)
    activity_type = db.Column(db.String)
    address = db.Column(db.String)
    phone = db.Column(db.String(20))
    datetime = db.Column(db.DateTime)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    yelp_id = db.Column(db.String(100))
    note = db.Column(db.String)

    # -- relationship to Trip --
    # trip = db.relationship("Trip", backref="activities")

    def __repr__(self):
        return f'<Activity activity_id={self.activity_id} activity_name={self.activity_name} activity_type={self.activity_type}>'


class Poll(db.Model):
    """A poll for the trip"""

    __tablename__ = "polls"

    poll_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.trip_id"), nullable=False)
    poll_title = db.Column(db.String)

    # -- relationship to Trip/Option --
    # trip = db.relationship("Trip", backref="polls")
    options = db.relationship("Option", backref="poll")

    def to_dict(self):
        """return data as dictionary"""
        poll_dict = {'poll_id': self.poll_id,
                    'trip_id': self.trip_id,
                    'poll_title': self.poll_title,
        }
        return poll_dict

    def __repr__(self):
        return f'<Poll poll_id={self.poll_id} poll_title={self.poll_title}>'

class Option(db.Model):
    """An option for the poll"""

    __tablename__ = "options"

    option_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    poll_id = db.Column(db.Integer, db.ForeignKey("polls.poll_id"), nullable=False)
    option_name = db.Column(db.String)

    # -- relationship to Option --
    # users = db.relationship("User", secondary="votes", backref="options")
    # poll = db.relationship("Poll", backref="options")

    def to_dict(self):
        """return data as dictionary"""
        option_dict = {'option_id': self.option_id,
                    'poll_id': self.poll_id,
                    'option_name': self.option_name,
        }
        return option_dict

    def __repr__(self):
        return f'<Option option_id={self.option_id} poll_id={self.poll_id} option_name={self.option_name}>'


class Vote(db.Model):
    """Association Table: An option that the user voted on"""

    __tablename__ = "votes"

    vote_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    option_id = db.Column(db.Integer, db.ForeignKey("options.option_id"), nullable=False)
    user_id = db.Column(db.String, db.ForeignKey("users.user_id"), nullable=False)


    def __repr__(self):
        return f'<Vote vote_id={self.vote_id} option_id={self.option_id} user_id={self.user_id}>'



def connect_to_db(flask_app, db_uri="postgresql:///travelplanner", echo=True):
    """Connect to db"""
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")

def example_data():
    """Create example data for the test database."""

    kat = User(user_id='kat', fname='Kat', lname='Jiang', email='kat@gmail.com', password=argon2.hash('1234'))

    brian = User(user_id='brian', fname='Brian', lname='Anderson', email='brian@gmail.com', password=argon2.hash('1234'))

    db.session.add_all([kat, brian])

    maui = Trip(trip_creator='kat', trip_location='Maui, HI', trip_name="Nina's Wedding", start_date=datetime.strptime("2022-09-02", "%Y-%m-%d"), end_date=datetime.strptime("2022-09-11", "%Y-%m-%d"), latitude=20.798363, longitude=-156.331924, trip_image="https://images.unsplash.com/photo-1483168527879-c66136b56105?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTY5Nzl8MHwxfGFsbHx8fHx8fHx8fDE2NDkyMDM0Nzc&ixlib=rb-1.2.1&q=80&w=400")
    db.session.add(maui)
    kat.trips.append(maui)
    
    db.session.commit()

if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app, echo=False)
