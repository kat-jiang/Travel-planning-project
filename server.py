"""Server for travel planning app."""

from flask import (Flask, render_template, request, flash, session, redirect, jsonify)
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined
from datetime import datetime, date

app = Flask(__name__)
app.secret_key = "dev"
app.jinja_env.undefined = StrictUndefined

@app.route("/")
def homepage():
    """View homepage"""
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
        return redirect (f"/user_page/{user_id}")
    else:
        flash("Sorry, passwords do not match!")
        return redirect('/')


@app.route('/user_page/<user_id>')
def user_page(user_id):
    """Display user's trip page"""
    user = crud.get_user_by_id(user_id)

    trips = user.trips

    return render_template('user_page.html', user=user, trips=trips)

@app.route('/user_page/<user_id>/add-trip.json', methods=["POST"])
def add_trip(user_id):
    """Add trip to user's trip page"""

    #retrieve trip info from form
    trip_location = request.json.get("location")
    trip_name = request.json.get("name")
    start_date_str = request.json.get("start")
    end_date_str = request.json.get("end")

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

    #convert python object to dictionary
    new_trip = new_trip.to_dict()

    return jsonify(new_trip)
    # return redirect(f'/user_page/{user_id}')







if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)