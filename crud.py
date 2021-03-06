"""CRUD operations."""

from model import db, connect_to_db, User, Trip, Activity, Task, Poll, Option
from datetime import timedelta
from passlib.hash import argon2


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

def hash_password(password):
    """Converts password to hash"""

    return argon2.hash(password)

# ----- FUNCTIONS FOR TRIP TABLE ----- #

def create_trip(trip_creator, trip_location, trip_name, start_date, end_date, longitude, latitude, trip_image):
    """Create and return a new trip."""

    trip = Trip(trip_creator=trip_creator,
                trip_location=trip_location,
                trip_name=trip_name,
                start_date=start_date,
                end_date=end_date,
                longitude=longitude,
                latitude=latitude,
                trip_image=trip_image)
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
    """Return all activities with datetime"""

    return Activity.query.filter(Activity.trip_id==trip_id, Activity.datetime != None).all()

# ----- FUNCTIONS FOR TASK TABLE ----- #

def get_tasks_by_trip_id(trip_id):
    """Return all tasks by trip_id"""

    return Task.query.filter(Task.trip_id==trip_id).all()

def create_task(trip_id, assigned_user, task_item):
    """Create and return a task"""

    task = Task(trip_id=trip_id,
                assigned_user=assigned_user,
                task_item=task_item,
                completed=False)
    return task

def get_task_by_task_id(task_id):
    """Return task by task_id"""

    return Task.query.get(task_id)

# ----- FUNCTIONS FOR POLL/OPTIONS TABLE ----- #

def create_poll(trip_id, poll_title):
    """Create a poll, add to db and return poll"""

    poll = Poll(trip_id=trip_id,
                poll_title=poll_title)
    db.session.add(poll)
    db.session.commit()

    return poll

def create_option(poll_id, option_name):
    """Create an option, add to db and return option"""

    option = Option(poll_id=poll_id,
                    option_name=option_name)
    db.session.add(option)
    db.session.commit()

    return option


def get_poll_list_by_trip_id(trip_id):
    """Return a list of polls dict objects for that trip"""

    trip_polls = Poll.query.filter(Poll.trip_id==trip_id).all()

    poll_list = []
    for poll in trip_polls:
        poll_list.append(poll.to_dict())

    return poll_list


def get_options_by_poll_id(poll_id):
    """Return a list of option objects in dictionary form with option id, name, voters, and num of votes"""

    options_list = []
    options = Option.query.filter(Option.poll_id==poll_id).all()
    for option in options:
        option_dict = {}
        option_dict['option_id'] = option.option_id
        option_dict['option_name'] = option.option_name
        option_dict['votes'] = len(option.users)
        voters = []
        for user in option.users:
            voters.append(user.user_id)
        option_dict['voters'] = voters
        options_list.append(option_dict)
    return options_list

def get_option_by_option_id(option_id):
    """Return option by option id"""

    return Option.query.get(option_id)

def get_voted_users_for_poll(poll_id):
    """Return list of users that voted in that poll"""

    voted_users= []
    options = Option.query.filter(Option.poll_id==poll_id).all()
    for option in options:
        for user in option.users:
            voted_users.append(user.user_id)

    return voted_users

def get_poll_by_id(poll_id):
    """Return a poll by id"""

    return Poll.query.get(poll_id)

def get_all_options_by_poll_id(poll_id):
    """Return all options by poll_id"""

    return Option.query.filter(Option.poll_id==poll_id).all()

def get_polls_by_trip_id(trip_id):
    """Return all polls for that trip"""

    return Poll.query.filter(Poll.trip_id==trip_id).all()



if __name__ == '__main__':
    from server import app
    connect_to_db(app)