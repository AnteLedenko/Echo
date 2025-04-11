# Tests for creating, reading, updating, and deleting listings using JWT authenticated requests.

from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from listings.models import Listing, Category

User = get_user_model()


class ListingTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="ledenko@example.com",
            password="whatever123",
            first_name="Ante",
            last_name="Ledenko"
        )
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

        self.category = Category.objects.create(
            name="string_instruments",
            slug="string-instruments"
        )

        self.listing = Listing.objects.create(
            user=self.user,
            title="fender sstrat",
            description="new",
            price=500,
            address="whatever 12",
            city="Dublin",
            county="Dublin",
            postal_code="12345",
            category=self.category
        )

    def test_create_listing(self):
        data = {
            "title": "fender tele",
            "description": "few marks",
            "price": 300,
            "address": "whatever 37",
            "city": "Dublin",
            "county": "Dublin",
            "postal_code": "43210",
            "category": self.category.id
        }

        response = self.client.post("/api/listings/create/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Listing.objects.count(), 2)

    def test_read_listings(self):
        response = self.client.get("/api/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_read_listing_detail(self):
        response = self.client.get(f"/api/listings/{self.listing.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["title"], self.listing.title)

    def test_update_listing(self):
        data = {
            "title": "fender jazzmaster",
            "description": "unboxed",
            "price": 800,
            "address": self.listing.address,
            "city": self.listing.city,
            "county": self.listing.county,
            "postal_code": self.listing.postal_code,
            "category": self.category.id,
            "is_sold": False
        }
        response = self.client.put(
            f"/api/listings/{self.listing.id}/update/", data
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.listing.refresh_from_db()
        self.assertEqual(self.listing.title, "fender jazzmaster")

    def test_delete_listing(self):
        response = self.client.delete(f"/api/listings/{self.listing.id}/delete/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Listing.objects.filter(id=self.listing.id).exists())



