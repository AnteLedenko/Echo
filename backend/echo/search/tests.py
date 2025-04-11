# Again using APITestCase for tests for listing search functionality based on title or description

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from listings.models import Listing, Category

User = get_user_model()

class SearchViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="ledenko@example.com",
            password="whatever123",
            first_name="Ante",
            last_name="Ledenko"
        )
        self.category = Category.objects.create(name="string_instruments", slug="string-instruments")

        Listing.objects.create(
            user=self.user,
            title="Jackson V Guitar",
            description="New",
            price=1000,
            category=self.category,
            address="whatever 67",
            city="Dublin",
            county="Dublin",
            postal_code="12345"
        )

        Listing.objects.create(
            user=self.user,
            title="Yamaha Drum Kit",
            description="barely used ",
            price=800,
            category=self.category,
            address="whatever 45",
            city="Dublin",
            county="Dublin",
            postal_code="67890"
        )

    def test_search_returns_matching_listing(self):
        response = self.client.get("/api/search/?query=guitar")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["title"], "Jackson V Guitar")

    def test_search_returns_empty_for_no_match(self):
        response = self.client.get("/api/search/?query=piano")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)
