# Views for listing all categories and retrieving listings by category slug

from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from listings.models import Listing
from listings.serializers import ListingSerializer
from .models import Category
from .serializers import CategorySerializer
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound


# Returns a list of all available categories ordered by the order field
class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all().order_by("order")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Returns all unsold listings for a specific category filtered by slug
class ListingsByCategoryView(ListAPIView):
    serializer_class = ListingSerializer

    def get_queryset(self):
        slug = self.kwargs.get("slug")
        category = get_object_or_404(Category, slug=slug)
        return Listing.objects.filter(category=category, is_sold=False).order_by("-created_at")

