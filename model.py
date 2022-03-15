"""Models for travel planning app."""

from flask_sqlalchemy import SQLAlchemy 

db = SQLAlchemy()


class User(db.Model):
    """A user."""

    __tablename__ = "users"

    user_id = db.Column(db.String(25), primary_key=True)
    fname = db.Column(db.String(25), nullable=False)
    lname = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(25), nullable=False)

    # -- relationship to Trip --
    # trips = db.relationship("Trip", secondary="users_trips", backref="users")

    def __repr__(self):
        return f'<User user_id={self.user_id} email={self.email}>'


class Trip(db.Model):
    """A trip."""

    __tablename__ = "trips"

    trip_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    trip_location = db.Column(db.String(50), nullable=False)
    trip_name = db.Column(db.String(100), default=trip_location)
    longitude = db.Column(db.Integer)
    latitude = db.Column(db.Integer)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)

    #-- relationships to User and Day --
    users = db.relationship("User", secondary="users_trips", backref="trips")
    days = db.relationship("Day", backref="trip")

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


class Day(db.Model):
    """A day for the trip"""

    __tablename__ = "days"

    day_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.trip_id"), nullable=False)
    date = db.Column(db.DateTime)

    #-- relationship to Trip and Activity --
    # trip = db.relationship("Trip", backref="days")
    # activity = db.relationship("Activity", backref="days")

    def __repr__(self):
        return f'<Day day_id={self.day_id} trip_id={self.trip_id} date={self.date}>'


class Activity(db.Model):
    """An activity for the day for the trip"""

    __tablename__ = "activities"

    activity_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    day_id = db.Column(db.Integer, db.ForeignKey("days.day_id"), nullable=False)
    activity_name = db.Column(db.String(100))
    activity_type = db.Column(db.String(50))
    activity_time = db.Column(db.DateTime)
    longitude = db.Column(db.Integer)
    latitude = db.Column(db.Integer)
    yelp_id = db.Column(db.String(100))

    # -- relationship to Day --
    days = db.relationship("Day", backref="activity")

    def __repr__(self):
        return f'<Activity activity_id={self.activity_id} activity_name={self.activity_name} activity_type={self.activity_type}>'




def connect_to_db(flask_app, db_uri="postgresql:///travelplanner", echo=True):
    flask_app.config["SQLALCHEMY_DATABASE_URI"] = db_uri
    flask_app.config["SQLALCHEMY_ECHO"] = echo
    flask_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.app = flask_app
    db.init_app(flask_app)

    print("Connected to the db!")



if __name__ == "__main__":
    from server import app

    # Call connect_to_db(app, echo=False) if your program output gets
    # too annoying; this will tell SQLAlchemy not to print out every
    # query it executes.

    connect_to_db(app)
