from rest_framework import serializers
from ..models import Review


class ReviewSerializer(serializers.ModelSerializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)

    class Meta:
        model = Review
        fields = [
            "id",
            "title",
            "type",
            "rating",
            "review",
            "date",
        ]