# Category model with predefined category choices, icon upload support, and custom ordering.
# Automatically generates slug from the name on save.

from django.db import models
from django.utils.text import slugify
from cloudinary_storage.storage import MediaCloudinaryStorage

class Category(models.Model):
    CATEGORY_CHOICES = [
        ("string_instruments", "String Instruments"),
        ("key_instruments", "Key Instruments"),
        ("percussion", "Percussion"),
        ("wind_instruments", "Wind Instruments"),
        ("speakers_and_studio_equipment", "Speakers And Studio Equipment"),
        ("other", "Other"),
    ]

    name = models.CharField(max_length=100, choices=CATEGORY_CHOICES, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    icon = models.ImageField(upload_to="category-icons/", storage=MediaCloudinaryStorage(),max_length=1000, null=True, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['order']

    def __str__(self):
        return self.get_name_display()

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

