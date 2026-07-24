# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class Review(models.Model):

    TYPE_CHOICES = [
        ("book", "Book"),
        ("movie", "Movie"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reviews",
        null=True,
        blank=True,
    )

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    rating = models.IntegerField()
    review = models.TextField()

    is_public = models.BooleanField(default=False)

    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.type})"