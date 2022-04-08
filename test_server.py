import unittest

from server import app
from flask import g
from model import db, connect_to_db, example_data


class TravelPlannerTest(unittest.TestCase):
    """Test for my site"""

    def setUp(self):
        self.client = app.test_client()
        app.config['TESTING'] = True

    def test_homepage(self):
        """Test homepage"""
        result = self.client.get("/")
        self.assertIn(b"Plan Trips with your Friends!", result.data)


class TravelPlannerTestDatabase(unittest.TestCase):
    """Flask tests that use the database"""

    def setUp(self):
        """Stuff to do before every test."""

        # Get the Flask test client
        self.client = app.test_client()

        # Show Flask errors that happen during tests
        app.config['TESTING'] = True

        # Connect to test database
        connect_to_db(app, "postgresql:///testdb")

        # Create tables and add sample data
        db.create_all()
        example_data()

    def test_login(self):
        """Test login"""
        result = self.client.post("/login",
                                data={  "username": "kat",
                                        "password": '1234'},
                                follow_redirects=True)
        self.assertIn(b"Ready to plan your next trip?", result.data)
        self.assertIn(b"Maui", result.data)
        self.assertNotIn(b"Plan Trips with your Friends!", result.data)

    def test_trip_page(self):
        """ Test the trip page """
        login = self.client.post("/login",
                                data={  "username": "kat",
                                        "password": '1234'},
                                follow_redirects=True)
        result = self.client.get("/trip/1", follow_redirects=True)
        self.assertIn(b"Maui", result.data)
        self.assertIn(b"Itinerary", result.data)
        self.assertIn(b"Explore Activities", result.data)
        self.assertNotIn(b"Ready to plan your next trip?", result.data)

    def test_trip_page_no_login(self):
        """ Test the trip page without login """
        result = self.client.get("/trip/1", follow_redirects=True)
        self.assertNotIn(b"Maui", result.data)
        self.assertNotIn(b"Itinerary", result.data)
        self.assertNotIn(b"Explore Activities", result.data)
        self.assertIn(b"Plan Trips with your Friends!", result.data)

    def test_trip_invite_page(self):
        """ Test the trip invite page """
        login = self.client.post("/login",
                                data={  "username": "kat",
                                        "password": '1234'},
                                follow_redirects=True)
        result = self.client.get("/trip/1/invite", follow_redirects=True)
        self.assertIn(b"People in this trip", result.data)
        self.assertIn(b"kat", result.data)
        self.assertIn(b"Add friends to this trip", result.data)
        self.assertNotIn(b"Ready to plan your next trip?", result.data)

    def test_trip_invite_page_no_login(self):
        """ Test the trip invite page without login """
        result = self.client.get("/trip/1/invite", follow_redirects=True)
        self.assertNotIn(b"People in this trip", result.data)
        self.assertNotIn(b"kat", result.data)
        self.assertNotIn(b"Add friends to this trip", result.data)
        self.assertIn(b"Plan Trips with your Friends!", result.data)

    def test_trip_invite_friend(self):
        """ Test the trip invite friend feature """
        login = self.client.post("/login",
                                data={  "username": "kat",
                                        "password": '1234'},
                                follow_redirects=True)
        result = self.client.post("/add-friend",
                                data={  "user-id": "brian",
                                        "trip-id": 1},
                                follow_redirects=True)
        self.assertIn(b"People in this trip", result.data)
        self.assertIn(b"kat", result.data)
        self.assertIn(b"brian", result.data)
        self.assertIn(b"Add friends to this trip", result.data)
        self.assertNotIn(b"Ready to plan your next trip?", result.data)

    def test_trip_activity_page(self):
        """ Test the trip activity page """
        login = self.client.post("/login",
                                data={  "username": "kat",
                                        "password": '1234'},
                                follow_redirects=True)
        result = self.client.get("/trip/1/activities", follow_redirects=True)
        self.assertIn(b"Top Rated Activities", result.data)
        self.assertIn(b"Top Rated Restaurants", result.data)
        self.assertIn(b"Search", result.data)
        self.assertNotIn(b"Ready to plan your next trip?", result.data)

    def test_trip_activity_page_no_login(self):
        """ Test the trip activity page without login """
        result = self.client.get("/trip/1/invite", follow_redirects=True)
        self.assertNotIn(b"Top Rated Activities", result.data)
        self.assertNotIn(b"Top Rated Restaurants", result.data)
        self.assertNotIn(b"Search", result.data)
        self.assertIn(b"Plan Trips with your Friends!", result.data)

    def test_trip_itinerary_page(self):
        """ Test the trip itinerary page """
        login = self.client.post("/login",
                                data={  "username": "kat",
                                        "password": '1234'},
                                follow_redirects=True)
        result = self.client.get("/trip/1/itinerary", follow_redirects=True)
        self.assertIn(b"Activities List", result.data)
        self.assertIn(b"Itinerary", result.data)
        self.assertNotIn(b"Ready to plan your next trip?", result.data)

    def test_trip_itinerary_page_no_login(self):
        """ Test the trip itinerary page without login """
        result = self.client.get("/trip/1/invite", follow_redirects=True)
        self.assertNotIn(b"Activities List", result.data)
        self.assertNotIn(b"Itinerary", result.data)
        self.assertIn(b"Plan Trips with your Friends!", result.data)

    def test_logout(self):
        """ Test the logout feature """
        result = self.client.get("/logout", follow_redirects=True)
        self.assertIn(b"Plan Trips with your Friends!", result.data)
        self.assertNotIn(b"Ready to plan your next trip?", result.data)

    def tearDown(self):
        """Do at end of every test."""

        # (uncomment when testing database)
        db.session.close()
        db.drop_all()


if __name__ == "__main__":
    unittest.main()
