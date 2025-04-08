from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from listings.models import Listing
from listings.serializers import ListingSerializer
from .models import Category
from .serializers import CategorySerializer
from django.shortcuts import get_object_or_404


class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all().order_by("order")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ListingsByCategoryView(APIView):
    def get(self, request, slug):
        category = get_object_or_404(Category, slug=slug)
        listings = Listing.objects.filter(category=category)
        serializer = ListingSerializer(listings, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

