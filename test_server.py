import unittest

from server import app
from model import db, connect_to_db, example_data
from datetime import datetime
import json

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

        self.client = app.test_client()
        app.config['TESTING'] = True

        # Connect to test database (uncomment when testing database)
        connect_to_db(app, "postgresql:///testdb")

        # Create tables and add sample data (uncomment when testing database)
        # db.create_all()
        # example_data()

    def tearDown(self):
        """Do at end of every test."""

        # (uncomment when testing database)
        # db.session.close()
        # db.drop_all()

    def test_login(self):
        """Test login"""
        result = self.client.post("/login",
                                data={  "username": "kat",
                                        "password": "1234"},
                                follow_redirects=True)
        self.assertIn(b"Ready to plan your next trip?", result.data)
        self.assertNotIn(b"Plan Trips with your Friends!", result.data)

    def test_logout(self):
        """ Test the logout feature """
        result = self.client.post("/login",
                                data={  "username": "kat",
                                        "password": "1234"},
                                follow_redirects=True)
        result = self.client.get("/logout", follow_redirects=True)
        self.assertIn(b"Plan Trips with your Friends!", result.data)
        self.assertNotIn(b"Ready to plan your next trip?", result.data)

    # def test_user_can_make_trips(self):
    #     """Test that user can make a trip """
    #     # self.client.post(
    #     #     "/login",
    #     #     data={
    #     #         "username": "kat",
    #     #         "password": "1234"
    #     #     },
    #     #     follow_redirects=True
    #     # )

    #     request = {
    #         'location':'Maui, HI',
    #         'name':"Nina's Wedding",
    #         'start': "2022-09-02",
    #         'end': "2022-09-11",
    #         'latitude':20.798363,
    #         'longitude':-156.331924,
    #         'user_id': 'kat'
    #     }
    #     print(f'dump {json.dumps(request)}')
    #     result = self.client.post(
    #         '/add-trip',
    #         data=json.dumps(request),
    #         follow_redirects=True
    #     )
    #     self.assertIn(b"Ready to plan your next trip?", result.data)
    #     self.assertIn(b"Maui", result.data)


if __name__ == "__main__":
    unittest.main()
