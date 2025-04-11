# Here we have views for creating, updating, deleting, retrieving, and saving listings

from rest_framework import status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Listing, ListingImage
from categories.models import Category
from .serializers import ListingSerializer


# Here we create a new listing with image uploads and address geocoding
class ListingCreateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        category_id = request.data.get("category")
        try:
            category = Category.objects.get(id=category_id)
        except Category.DoesNotExist:
            return Response({"error": "Invalid category"}, status=400)

        data = request.data.copy()
        data["user"] = request.user.id
        data["category"] = category.id

        serializer = ListingSerializer(data=data, context={"request": request})
        if serializer.is_valid():
            listing = serializer.save()
            listing.geocode_address()

            for image in request.FILES.getlist("images"):
                ListingImage.objects.create(listing=listing, image=image)

            return Response(ListingSerializer(listing, context={"request": request}).data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Here we update an existing listing, allowing image changes and geocoding
class ListingUpdateView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def put(self, request, pk):
        listing = get_object_or_404(Listing, pk=pk)

        if listing.user != request.user:
            return Response(
                {"detail": "You are not authorized to edit this listing."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = ListingSerializer(listing, data=request.data, partial=True, context={"request": request})
        if serializer.is_valid():
            listing = serializer.save()

            address_fields = ["address", "city", "county", "postal_code"]
            if any(field in request.data for field in address_fields):
                listing.geocode_address()

            delete_ids = request.data.getlist("delete_images") if hasattr(request.data, "getlist") else []
            if delete_ids:
                ListingImage.objects.filter(id__in=delete_ids, listing=listing).delete()

            for image in request.FILES.getlist("images"):
                ListingImage.objects.create(listing=listing, image=image)

            return Response(ListingSerializer(listing, context={"request": request}).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Here we delete a listing belonging to the authenticated user
class ListingDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        listing = get_object_or_404(Listing, pk=pk, user=request.user)
        listing.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Here is view for retrieve details for a single listing
class ListingDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        listing = get_object_or_404(Listing, pk=pk)
        serializer = ListingSerializer(listing, context={"request": request})
        return Response(serializer.data)


# View for listing all listings created by the authenticated user
class MyListingsView(ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Listing.objects.filter(user=self.request.user).order_by("-created_at")


# View for listing all saved listings for the authenticated user
class SavedListingsView(ListAPIView):
    serializer_class = ListingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.saved_listings.all().order_by("-created_at")


# Toggle the saved status of a listing for the authenticated user
class ToggleSaveListingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        listing = get_object_or_404(Listing, pk=pk)
        if listing.saved_by.filter(id=request.user.id).exists():
            listing.saved_by.remove(request.user)
            return Response({"saved": False})
        else:
            listing.saved_by.add(request.user)
            return Response({"saved": True})
