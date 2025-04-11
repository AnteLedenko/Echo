# Tests for the categories app here were verifying category listings API and response structure

from rest_framework.test import APITestCase
from rest_framework import status
from listings.models import Category

class CategoryTests(APITestCase):
    def setUp(self):
        Category.objects.create(name="string_instruments", slug="string-instruments")
        Category.objects.create(name="key_instruments", slug="key-instruments")

    def test_list_categories(self):
        response = self.client.get("/api/categories/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name_display"], "String Instruments")
        self.assertEqual(response.data[1]["slug"], "key-instruments")


