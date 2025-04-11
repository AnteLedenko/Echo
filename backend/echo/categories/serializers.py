from rest_framework import serializers
from .models import Category


# Serializer for category model includes both raw name and human readable display name
class CategorySerializer(serializers.ModelSerializer):
    name_display = serializers.CharField(source='get_name_display', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'name_display', 'slug', 'icon']
