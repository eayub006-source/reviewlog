from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    ITEM_TYPE_CHOICES = [("internal_review", "Internal review"), ("book", "Book"), ("movie", "Movie")]
    EXTERNAL_SOURCE_CHOICES = [("", "None"), ("openlibrary", "Open Library"), ("tmdb", "TMDB")]
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews",
        null=True,
        blank=True,
    )

    title = models.CharField(max_length=255)
    content = models.TextField()

    rating = models.IntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ]
    )

    date = models.DateField()

    is_public = models.BooleanField(default=False)
    item_type = models.CharField(max_length=20, choices=ITEM_TYPE_CHOICES, default="internal_review")
    item_id = models.CharField(max_length=255, blank=True, default="")
    external_source = models.CharField(max_length=20, choices=EXTERNAL_SOURCE_CHOICES, blank=True, default="")
    image = models.URLField(blank=True, default="")
    metadata = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.title


class CatalogItem(models.Model):
    """A user-owned external catalog item, saved as either a favorite or recent view."""

    ACTION_CHOICES = [("favorite", "Favorite"), ("recent", "Recent")]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="catalog_items")
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    item_type = models.CharField(max_length=20, choices=[("book", "Book"), ("movie", "Movie")])
    external_source = models.CharField(max_length=20, choices=[("openlibrary", "Open Library"), ("tmdb", "TMDB")])
    item_id = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    image = models.URLField(blank=True, default="")
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=["user", "action", "item_type", "external_source", "item_id"], name="unique_user_catalog_item")]
        ordering = ["-updated_at"]
