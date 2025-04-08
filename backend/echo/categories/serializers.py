from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    name_display = serializers.CharField(source='get_name_display', read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'name_display', 'slug', 'icon']
