from rest_framework import serializers
from ..models import Review


class ReviewSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Review
        fields = [
            "id",
            "title",
            "content",
            "rating",
            "date",
            "is_public",
            "item_type",
            "item_id",
            "external_source",
            "image",
            "metadata",
        ]
