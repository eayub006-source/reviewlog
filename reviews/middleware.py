class NoStoreApiCacheMiddleware:
    """Prevent any browser/proxy/CDN from caching API responses.

    Every /api/ response carries per-user data gated by the Authorization
    header, which most caches ignore by default. Without an explicit
    no-store directive, a caching layer sitting in front of the backend
    could serve one user's response to another.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        if request.path.startswith("/api/"):
            response["Cache-Control"] = "no-store, no-cache, must-revalidate, private"
            response["Vary"] = "Authorization"
        return response
