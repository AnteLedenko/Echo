from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from datetime import datetime
from listings.models import Listing
from listings.serializers import ListingSerializer

class HomeView(ListAPIView):
    serializer_class = ListingSerializer

    def get_queryset(self):
        return Listing.objects.filter(is_sold=False).order_by("-created_at")

class AboutView(APIView):
    def get(self, request):
        return Response({
            "listings_count": Listing.objects.count(),
            "active_users": User.objects.filter(is_active=True).count(),
        })

