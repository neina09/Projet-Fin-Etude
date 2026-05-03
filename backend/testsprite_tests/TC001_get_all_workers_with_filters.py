import requests

BASE_URL = "http://localhost:8080"
TIMEOUT = 30
WORKERS_ENDPOINT = f"{BASE_URL}/api/workers"

def test_get_all_workers_with_filters():
    # Test combinations of filters to verify filtering and response format
    filters_list = [
        {},  # No filters
        {"trade": "electrician"},
        {"location": "Nouakchott"},
        {"availability": "available"},
        {"trade": "plumber", "location": "Nouakchott"},
        {"trade": "cleaner", "availability": "unavailable"},
        {"location": "Nouadhibou", "availability": "available"},
        {"trade": "electrician", "location": "Nouakchott", "availability": "available"}
    ]

    headers = {
        "Accept": "application/json"
    }

    for filters in filters_list:
        response = requests.get(WORKERS_ENDPOINT, params=filters, headers=headers, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected 200 OK, got {response.status_code} for filters: {filters}"
        data = response.json()
        # The response should be a list or contain a list of workers in a field (assuming direct list)
        assert isinstance(data, list), f"Response should be a list, got {type(data)} for filters: {filters}"

        for worker in data:
            # Verify expected fields in each worker item
            assert "id" in worker, f"Worker missing 'id' field for filters: {filters}"
            assert "trade" in worker, f"Worker missing 'trade' field for filters: {filters}"
            assert "availability" in worker, f"Worker missing 'availability' field for filters: {filters}"
            assert "rating" in worker, f"Worker missing 'rating' field for filters: {filters}"
            assert isinstance(worker["id"], (int, str)), "Worker 'id' should be int or str"
            assert isinstance(worker["trade"], str), "Worker 'trade' should be string"
            assert isinstance(worker["availability"], str), "Worker 'availability' should be string"
            assert (isinstance(worker["rating"], (int, float)) or worker["rating"] is None), "Worker 'rating' should be numeric or None"

            # Validate filters applied correctly
            if "trade" in filters:
                assert filters["trade"].lower() == worker["trade"].lower(), f"Worker trade mismatch filter: {filters['trade']} vs {worker['trade']}"
            if "location" in filters:
                # Location filter assumed to check worker location string inclusion (may require API details)
                # We try to check if location in worker.get("location") if exists
                worker_location = worker.get("location", "")
                assert filters["location"].lower() in worker_location.lower(), f"Worker location mismatch filter: {filters['location']} vs {worker_location}"
            if "availability" in filters:
                assert filters["availability"].lower() == worker["availability"].lower(), f"Worker availability mismatch filter: {filters['availability']} vs {worker['availability']}"

        # Security check: public listing, ensure no sensitive info is exposed
        for worker in data:
            # workers should not expose private fields like adminOnly or internal notes
            forbidden_keys = {"adminOnly", "internalNotes", "password", "phoneNumber"}
            assert not any(key in worker for key in forbidden_keys), f"Worker listing exposes forbidden fields for filters: {filters}"

test_get_all_workers_with_filters()
