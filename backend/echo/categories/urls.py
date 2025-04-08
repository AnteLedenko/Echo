from django.urls import path
from .views import CategoryListView, ListingsByCategoryView

urlpatterns = [
    path("", CategoryListView.as_view(), name="category-list"),
    path("<slug:slug>/", ListingsByCategoryView.as_view(), name="category-listings"),
]



