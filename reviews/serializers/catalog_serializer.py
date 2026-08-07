from rest_framework import serializers
from ..models import CatalogItem


class CatalogItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CatalogItem
        fields = ["id", "action", "item_type", "external_source", "item_id", "title", "image", "metadata", "created_at", "updated_at"]
        read_only_fields = ["id", "action", "created_at", "updated_at"]
