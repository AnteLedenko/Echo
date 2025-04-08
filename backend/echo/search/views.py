from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from listings.models import Listing
from listings.serializers import ListingSerializer

class SearchListingsView(APIView):
    def get(self, request):
        query = request.GET.get("query", "").strip()

        if not query:
            return Response({"detail": "Missing search query."}, status=status.HTTP_400_BAD_REQUEST)

        listings = Listing.objects.filter(is_sold=False).filter(
            title__icontains=query
        ) | Listing.objects.filter(
            is_sold=False,
            description__icontains=query
        )

        serializer = ListingSerializer(listings.distinct(), many=True, context={"request": request})
        return Response(serializer.data)
