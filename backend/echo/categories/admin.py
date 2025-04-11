# Admin config for Category model with sortable order and slug display

from django.contrib import admin
from .models import Category


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "order")
    list_editable = ("order",)
    ordering = ("order",)

