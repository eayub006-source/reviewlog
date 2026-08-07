"""Small server-side adapters for external catalog providers."""
import json
import os
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.core.cache import cache
from rest_framework.exceptions import APIException, ValidationError


class ExternalCatalogUnavailable(APIException):
    status_code = 503
    default_detail = "The external catalog is temporarily unavailable. Please try again shortly."


def _request_json(url):
    try:
        request = Request(url, headers={"Accept": "application/json", "User-Agent": "ReviewLog/1.0"})
        with urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
        raise ExternalCatalogUnavailable() from error


def search_books(query, page=1):
    key = f"catalog:books:{query.lower()}:{page}"
    cached = cache.get(key)
    if cached is not None:
        return cached
    payload = _request_json("https://openlibrary.org/search.json?" + urlencode({"q": query, "page": page, "limit": 12}))
    results = [{
        "id": item.get("key", ""), "title": item.get("title") or "Untitled",
        "author": (item.get("author_name") or ["Unknown author"])[0],
        "authors": item.get("author_name") or [], "firstPublishYear": item.get("first_publish_year"),
        "editionCount": item.get("edition_count"),
        "image": f"https://covers.openlibrary.org/b/id/{item['cover_i']}-M.jpg" if item.get("cover_i") else "",
        "source": "openlibrary",
    } for item in payload.get("docs", [])]
    data = {"results": results, "page": page, "has_more": page * 12 < payload.get("numFound", 0)}
    cache.set(key, data, 300)
    return data


def search_movies(query, page=1):
    api_key = os.environ.get("TMDB_API_KEY")
    if not api_key:
        raise ValidationError({"detail": "TMDB_API_KEY is not configured on the server."})
    key = f"catalog:movies:{query.lower()}:{page}"
    cached = cache.get(key)
    if cached is not None:
        return cached
    payload = _request_json("https://api.themoviedb.org/3/search/movie?" + urlencode({"api_key": api_key, "query": query, "page": page, "include_adult": "false"}))
    results = [{
        "id": str(item.get("id", "")), "title": item.get("title") or "Untitled",
        "releaseDate": item.get("release_date") or "", "overview": item.get("overview") or "No overview available.",
        "averageRating": item.get("vote_average"),
        "image": f"https://image.tmdb.org/t/p/w342{item['poster_path']}" if item.get("poster_path") else "",
        "source": "tmdb",
    } for item in payload.get("results", [])]
    data = {"results": results, "page": page, "has_more": page < payload.get("total_pages", 0)}
    cache.set(key, data, 300)
    return data
