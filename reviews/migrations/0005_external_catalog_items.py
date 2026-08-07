# Generated manually for Phase 4 external catalog integration.
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("reviews", "0004_rename_review_review_content_remove_review_type_and_more")]

    operations = [
        migrations.AddField(model_name="review", name="external_source", field=models.CharField(blank=True, choices=[("", "None"), ("openlibrary", "Open Library"), ("tmdb", "TMDB")], default="", max_length=20)),
        migrations.AddField(model_name="review", name="image", field=models.URLField(blank=True, default="")),
        migrations.AddField(model_name="review", name="item_id", field=models.CharField(blank=True, default="", max_length=255)),
        migrations.AddField(model_name="review", name="item_type", field=models.CharField(choices=[("internal_review", "Internal review"), ("book", "Book"), ("movie", "Movie")], default="internal_review", max_length=20)),
        migrations.AddField(model_name="review", name="metadata", field=models.JSONField(blank=True, default=dict)),
        migrations.CreateModel(
            name="CatalogItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("action", models.CharField(choices=[("favorite", "Favorite"), ("recent", "Recent")], max_length=10)),
                ("item_type", models.CharField(choices=[("book", "Book"), ("movie", "Movie")], max_length=20)),
                ("external_source", models.CharField(choices=[("openlibrary", "Open Library"), ("tmdb", "TMDB")], max_length=20)),
                ("item_id", models.CharField(max_length=255)), ("title", models.CharField(max_length=255)),
                ("image", models.URLField(blank=True, default="")), ("metadata", models.JSONField(blank=True, default=dict)),
                ("created_at", models.DateTimeField(auto_now_add=True)), ("updated_at", models.DateTimeField(auto_now=True)),
                ("user", models.ForeignKey(on_delete=models.deletion.CASCADE, related_name="catalog_items", to=settings.AUTH_USER_MODEL)),
            ],
            options={"ordering": ["-updated_at"]},
        ),
        migrations.AddConstraint(model_name="catalogitem", constraint=models.UniqueConstraint(fields=("user", "action", "item_type", "external_source", "item_id"), name="unique_user_catalog_item")),
    ]
