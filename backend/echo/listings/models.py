from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from categories.models import Category
from cloudinary.models import CloudinaryField
import cloudinary.models
import googlemaps

class Listing(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name="listings")
    category = models.ForeignKey(Category,on_delete=models.CASCADE,related_name="listings")
    title = models.CharField(max_length=250)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    county = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    is_sold = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    saved_by = models.ManyToManyField(settings.AUTH_USER_MODEL,related_name="saved_listings",blank=True)

    def geocode_address(self):
        gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)
        
        full_address = f"{self.address}, {self.city}, {self.county}, {self.postal_code}"
        
        try:
            geocode_result = gmaps.geocode(full_address)
            if geocode_result:
                location = geocode_result[0]['geometry']['location']
                self.latitude = location['lat']
                self.longitude = location['lng']
                self.save()
        except Exception as e:
            print(f"Geocoding failed: {str(e)}")

class ListingImage(models.Model):
    listing = models.ForeignKey(Listing,on_delete=models.CASCADE,related_name="images")
    image = cloudinary.models.CloudinaryField(
        'image',
        folder='echo_project/',
        transformation=[
            {'width': 500, 'height': 500, 'crop': "fill", 'quality': "auto:best"}
        ]
    )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)