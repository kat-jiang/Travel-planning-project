import unittest

from server import app
from model import db, connect_to_db

class TravelPlannerTest(unittest.TestCase):
    """Test for register/login features"""

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

if __name__ == "__main__":
    unittest.main()