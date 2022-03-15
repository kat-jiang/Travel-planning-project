"""Server for travel planning app."""

from flask import (Flask, render_template, request, flash, session, redirect)
from model import connect_to_db, db
import crud
from jinja2 import StrictUndefined

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
        return redirect ("/")

    if email_exists:
        flash(f"{email} already exists!")
        return redirect ("/")
    
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
    password = request.form.get("password").rstrip()

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

    return render_template('user_page.html')



if __name__ == "__main__":
    # DebugToolbarExtension(app)
    connect_to_db(app)
    app.run(host="0.0.0.0", debug=True)