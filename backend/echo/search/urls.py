from django.urls import path
from .views import SearchListingsView

urlpatterns = [
    path("", SearchListingsView.as_view(), name="search-listings"),
]
