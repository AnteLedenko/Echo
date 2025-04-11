from rest_framework.generics import ListAPIView
from listings.models import Listing
from listings.serializers import ListingSerializer
from rest_framework.exceptions import ValidationError


# View for searching listings by title or description 
class SearchListingsView(ListAPIView):
    serializer_class = ListingSerializer

    def get_queryset(self):
        query = self.request.GET.get("query", "").strip()

        if not query:
            raise ValidationError({"detail": "Missing search query."})

        return Listing.objects.filter(is_sold=False).filter(
            title__icontains=query
        ) | Listing.objects.filter(
            is_sold=False,
            description__icontains=query
        )
