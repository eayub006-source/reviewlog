# Create your models here.
from django.db import models

class Review(models.Model):
    TYPE_CHOICES = [
        ('book', 'Book'),
        ('movie', 'Movie'),
    ]

    title = models.CharField(max_length=200)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    rating = models.IntegerField()
    review = models.TextField()
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.type})"
    