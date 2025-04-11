# Urls for creating listing, managing, viewing, and saving 

from django.urls import path
from .views import (
    ListingCreateView,
    ListingUpdateView,
    ListingDeleteView,
    ListingDetailView,
    MyListingsView,
    SavedListingsView,
    ToggleSaveListingView,
)

urlpatterns = [
    path("create/", ListingCreateView.as_view(), name="listing-create"),
    path("<int:pk>/", ListingDetailView.as_view(), name="listing-detail"),
    path("<int:pk>/update/", ListingUpdateView.as_view(), name="listing-update"),
    path("<int:pk>/delete/", ListingDeleteView.as_view(), name="listing-delete"),
    path("my/", MyListingsView.as_view(), name="my-listings"),
    path("saved/", SavedListingsView.as_view(), name="saved-listings"),
    path("<int:pk>/toggle-save/", ToggleSaveListingView.as_view(), name="toggle-save-listing"),
]
