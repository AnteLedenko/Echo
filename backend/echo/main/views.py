from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from listings.models import Listing
from listings.serializers import ListingSerializer

class HomeView(APIView):

    def get(self, request):
        listings = Listing.objects.filter(is_sold=False).order_by('-created_at')
        serializer = ListingSerializer(listings, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)



