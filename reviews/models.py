from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
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

    def __str__(self):
        return self.title