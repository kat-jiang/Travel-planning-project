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

@app.route("/")
def homepage():
    """View homepage"""

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
        flash(f"Welcome, {user_id}!")
        return redirect (f"/homepage/{user_id}")
    else:
        flash("Sorry, passwords do not match!")
        return redirect('/')


@app.route('/homepage/<user_id>')
def user_page(user_id):
    """Display user's trip page"""
    user = crud.get_user_by_id(user_id)

    trips = user.trips
    
    return render_template('user_page.html', user=user, trips=trips)

@app.route('/add-trip.json', methods=["POST"])
def add_trip():
    """Add trip to user's trip page"""

    #retrieve trip info from form
    trip_location = request.json.get("location")
    trip_name = request.json.get("name")
    start_date_str = request.json.get("start")
    end_date_str = request.json.get("end")
    user_id = request.json.get("user_id")

    #without ajax
    # trip_location = request.form.get("location")
    # trip_name = request.form.get("trip-name")
    # start_date_str = request.form.get("trip-start")
    # end_date_str = request.form.get("trip-end")

    #convert date strings to datetime
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()

    #create trip and add to db
    new_trip = crud.create_trip(trip_location=trip_location, trip_name=trip_name, start_date=start_date, end_date=end_date)
    db.session.add(new_trip)
    db.session.commit()
    #add trip to User in db
    user = crud.get_user_by_id(user_id)
    user.trips.append(new_trip)
    db.session.commit()

    #create Days and add to db
    dates = crud.create_days(trip_id=new_trip.trip_id, start_date=start_date, end_date=end_date)
    db.session.add_all(dates)
    db.session.commit()

    #convert python object to dictionary
    new_trip = new_trip.to_dict()

    return jsonify(new_trip)

@app.route('/delete-trip', methods=["POST"])
def delete_trip():
    """Delete a trip from user's trip page"""

    trip_id = request.json.get('trip_id')
    trip = crud.get_trip_by_id(trip_id)
    db.session.delete(trip)
    db.session.commit()

    return "Trip has been deleted"

@app.route('/trip/<trip_id>')
def show_trip(trip_id):
    """Show trip info about trip"""

    trip = crud.get_trip_by_id(trip_id)

    return render_template('trip.html', trip=trip)

@app.route('/trip/<trip_id>/itinerary')
def show_trip_itinerary(trip_id):
    """Show trip itinerary"""
    trip = crud.get_trip_by_id(trip_id)
    
    days = trip.days

    return render_template('itinerary.html', trip=trip, dates=days)

# @app.route('/trip/activities')
# def display_trip_activities():
#     """Display top-rated Yelp activities"""

#     trip_id = request.args.get('trip-id')
#     trip = crud.get_trip_by_id(trip_id)

#     url = 'https://api.yelp.com/v3/businesses/search'
#     headers = {'Authorization': f'Bearer {YELP_API_KEY}'}
#     queries = {
#         'location': trip.trip_name,
#         'sort_by': 'rating',
#         'limit': 10,
#         'categories': 'active,arts'
#     }

#     res = requests.get(url, headers=headers, params=queries)

#     data = res.json()

#     activities = data.get('businesses', [])

#     return render_template('activities.html', activities=activities)

# @app.route('/trip/activities')
# def display_trip_food():
#     """Display top-rated Yelp food/restaurants"""

#     trip_id = request.args.get('trip-id')
#     trip = crud.get_trip_by_id(trip_id)

#     url = 'https://api.yelp.com/v3/businesses/search'
#     headers = {'Authorization': f'Bearer {API_KEY}'}
#     queries = {
#         'location': trip.trip_name,
#         'sort_by': 'rating',
#         'limit': 10,
#         'categories': 'food,restaurant'
#     }

#     res = requests.get(url, headers=headers, params=queries)

#     data = res.json()

#     activities = data.get('businesses', [])

#     return render_template('activities.html', activities=activities)


# @app.route('/trip/<trip_id>/invite')
# def invite_friends(trip_id):
#     """Invite friends into trip"""

#     return render_template('trip.html')





if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)