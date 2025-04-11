from rest_framework import serializers
from .models import Listing, ListingImage


# Serializer for individual listing images
class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image']


# Serializer for full listing data with user info, ownership and saved status
class ListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True)
    is_saved = serializers.SerializerMethodField(read_only=True)
    is_owner = serializers.SerializerMethodField(read_only=True)
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    user_first_name = serializers.CharField(source="user.first_name", read_only=True)
    user_last_name = serializers.CharField(source="user.last_name", read_only=True)

    class Meta:
        model = Listing
        exclude = ['saved_by', 'updated_at']

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saved_by.filter(id=request.user.id).exists()
        return False

    def get_is_owner(self, obj):
            request = self.context.get('request')
            return request.user == obj.user if request and request.user.is_authenticated else False


# Serializer for referencing listings by ID and title
class ListingTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = ["id", "title"]
