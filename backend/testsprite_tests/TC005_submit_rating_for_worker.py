import requests

BASE_URL = "http://localhost:8080"
TIMEOUT = 30

# These credentials should be replaced by valid test user credentials
CLIENT_PHONE = "+22200000001"
CLIENT_PASSWORD = "clientpass"

def authenticate(phone, password):
    url = f"{BASE_URL}/api/auth/login"
    payload = {"phone": phone, "password": password}
    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()["token"]

def create_worker_for_rating(auth_token):
    # Create a worker profile (simulate a completed job for rating)
    # Assuming there's an API to create a worker (or use a test worker), but none was provided.
    # We'll create a new worker user to rate.
    url = f"{BASE_URL}/api/workers/profile"
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }
    # Minimal profile data to create a worker
    payload = {
        "displayName": "Test Worker",
        "services": ["electrician"],
        "hourlyRate": 15,
        "shortBio": "Test worker profile for rating"
    }
    resp = requests.put(url, json=payload, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    # Get worker ID from profile
    url_get = f"{BASE_URL}/api/workers"
    resp_list = requests.get(url_get, headers=headers, timeout=TIMEOUT)
    resp_list.raise_for_status()
    workers = resp_list.json()
    # find created worker by display name
    for worker in workers:
        if worker.get("displayName") == "Test Worker":
            return worker["id"]
    raise Exception("Created worker not found")

def delete_worker(worker_id, auth_token):
    # No delete API documented, so we skip deleting the worker.
    # If deletion available, implement here. For now, pass.
    pass

def get_worker_profile(worker_id, auth_token=None):
    url = f"{BASE_URL}/api/workers/{worker_id}"
    headers = {}
    if auth_token:
        headers["Authorization"] = f"Bearer {auth_token}"
    resp = requests.get(url, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    return resp.json()

def submit_rating(worker_id, star_rating, comment, auth_token):
    url = f"{BASE_URL}/api/workers/{worker_id}/rate"
    headers = {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }
    payload = {
        "stars": star_rating
    }
    if comment is not None:
        payload["comment"] = comment
    resp = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    return resp

def test_submit_rating_for_worker():
    # Authenticate client user
    client_token = authenticate(CLIENT_PHONE, CLIENT_PASSWORD)

    # As we have no documented way to create or delete workers, we attempt:
    # 1. Fetch existing workers (public, no auth required)
    # 2. If none, fail test because no worker to rate
    resp_workers = requests.get(f"{BASE_URL}/api/workers", timeout=TIMEOUT)
    resp_workers.raise_for_status()
    workers = resp_workers.json()
    if not workers:
        raise Exception("No workers available to rate, cannot run test")
    # Use first worker from the list for rating tests
    worker_id = workers[0]["id"]

    # Try a successful rating submission
    rating = 4
    comment = "Good work and timely."
    resp = submit_rating(worker_id, rating, comment, client_token)
    assert resp.status_code == 200, f"Expected 200 OK for valid rating, got {resp.status_code}"
    data = resp.json()
    assert "ratingId" in data or "id" in data, "Response missing rating ID or similar confirmation"

    # Validate that the rating is reflected on worker profile (aggregation)
    profile = get_worker_profile(worker_id)
    # The profile should include an average rating and recent reviews (include the submitted comment)
    assert "averageRating" in profile and profile["averageRating"] is not None, "Profile missing averageRating"
    assert "reviews" in profile and isinstance(profile["reviews"], list), "Profile missing reviews list"
    # Check that the submitted comment is in the reviews
    comments = [r.get("comment", "") for r in profile["reviews"]]
    assert any(comment in c for c in comments), "Submitted comment not found in worker reviews"

    # Submit rating without stars (invalid case)
    resp_invalid = submit_rating(worker_id, None, "Missing stars", client_token)
    assert resp_invalid.status_code == 400, "Expected 400 Bad Request when stars rating is missing"
    error_resp = resp_invalid.json()
    assert "error" in error_resp or "message" in error_resp, "Expected error message in response for missing stars"

test_submit_rating_for_worker()