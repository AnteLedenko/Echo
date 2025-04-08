from django.contrib import admin
from .models import Listing, ListingImage

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "price", "is_sold", "created_at")
    list_filter = ("is_sold", "category")
    search_fields = ("title", "description")

admin.site.register(ListingImage)
