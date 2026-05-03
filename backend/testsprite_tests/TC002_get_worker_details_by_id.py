import requests
import traceback

BASE_URL = "http://localhost:8080"
API_WORKERS = "/api/workers"
TIMEOUT = 30
HEADERS = {
    "Content-Type": "application/json"
}

def create_worker():
    # Minimal valid worker creation payload
    payload = {
        "displayName": "Test Worker",
        "services": ["electrician"],
        "hourlyRate": 25,
        "shortBio": "Test bio",
        "phoneNumber": "+22270000000"
    }
    try:
        response = requests.post(f"{BASE_URL}{API_WORKERS}", json=payload, headers=HEADERS, timeout=TIMEOUT)
        response.raise_for_status()
        return response.json().get("id")
    except Exception:
        traceback.print_exc()
        return None

def delete_worker(worker_id):
    try:
        response = requests.delete(f"{BASE_URL}{API_WORKERS}/{worker_id}", headers=HEADERS, timeout=TIMEOUT)
        response.raise_for_status()
    except Exception:
        traceback.print_exc()

def test_get_worker_details_by_id():
    worker_id = None
    try:
        # Create a worker to ensure a valid ID exists for testing
        worker_id = create_worker()
        assert worker_id, "Failed to create a worker for testing"

        # Fetch the full profile details of the worker by ID
        response = requests.get(f"{BASE_URL}{API_WORKERS}/{worker_id}", headers=HEADERS, timeout=TIMEOUT)
        assert response.status_code == 200, f"Expected status code 200, got {response.status_code}"
        data = response.json()

        # Validate expected fields in the profile
        assert "id" in data and data["id"] == worker_id, "Worker ID mismatch or missing"
        assert "services" in data and isinstance(data["services"], list), "Missing or invalid services list"
        assert "availability" in data, "Missing availability info"
        assert "ratings" in data and isinstance(data["ratings"], dict), "Missing or invalid ratings"
        assert "reviews" in data and isinstance(data["reviews"], list), "Missing or invalid reviews list"
        assert "displayName" in data and isinstance(data["displayName"], str), "Missing or invalid displayName"

        # Further checks could be added to verify the shape/validity of nested objects
    except Exception:
        traceback.print_exc()
        assert False, "Test failed due to an unexpected error"
    finally:
        if worker_id:
            delete_worker(worker_id)

test_get_worker_details_by_id()