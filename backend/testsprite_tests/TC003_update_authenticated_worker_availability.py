import requests

BASE_URL = "http://localhost:8080"
TIMEOUT = 30

def authenticate_worker(phone_number, password):
    url = f"{BASE_URL}/api/auth/login"
    payload = {"phoneNumber": phone_number, "password": password}
    headers = {"Content-Type": "application/json"}
    resp = requests.post(url, json=payload, headers=headers, timeout=TIMEOUT)
    resp.raise_for_status()
    token = resp.json().get("token")
    assert token, "Authentication failed, no token received"
    return token

def update_worker_availability(token, availability_payload):
    url = f"{BASE_URL}/api/workers/availability"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    resp = requests.put(url, json=availability_payload, headers=headers, timeout=TIMEOUT)
    return resp

def test_update_authenticated_worker_availability():
    # Authentication credentials - replace with valid test credentials
    phone_number = "+22212345678"
    password = "testpassword123"

    token = authenticate_worker(phone_number, password)

    # Valid availability update payload
    availability_update = {
        "status": "AVAILABLE",
        "schedule": [
            {"day": "Monday", "startTime": "09:00", "endTime": "12:00"},
            {"day": "Monday", "startTime": "13:00", "endTime": "17:00"},
            {"day": "Tuesday", "startTime": "10:00", "endTime": "15:00"}
        ]
    }

    # Test valid update - expect HTTP 200 and success confirmation
    resp = update_worker_availability(token, availability_update)
    assert resp.status_code == 200, f"Expected 200 OK, got {resp.status_code}"
    json_resp = resp.json()
    assert "message" in json_resp and "updated" in json_resp["message"].lower()

    # Test invalid overlapping times (Monday 11:00-14:00 overlaps existing 09:00-12:00 & 13:00-17:00)
    invalid_overlap_payload = {
        "status": "AVAILABLE",
        "schedule": [
            {"day": "Monday", "startTime": "11:00", "endTime": "14:00"}
        ]
    }
    resp_overlap = update_worker_availability(token, invalid_overlap_payload)
    assert resp_overlap.status_code == 400, f"Expected 400 Bad Request, got {resp_overlap.status_code}"
    json_overlap = resp_overlap.json()
    assert "error" in json_overlap and ("overlap" in json_overlap["error"].lower() or "invalid" in json_overlap["error"].lower())

    # Test invalid time range (start after end)
    invalid_time_range_payload = {
        "status": "AVAILABLE",
        "schedule": [
            {"day": "Wednesday", "startTime": "18:00", "endTime": "14:00"}
        ]
    }
    resp_invalid_time = update_worker_availability(token, invalid_time_range_payload)
    assert resp_invalid_time.status_code == 400, f"Expected 400 Bad Request, got {resp_invalid_time.status_code}"
    json_invalid_time = resp_invalid_time.json()
    assert "error" in json_invalid_time and ("invalid" in json_invalid_time["error"].lower() or "time" in json_invalid_time["error"].lower())

    # Test hiding availability (status set to UNAVAILABLE with empty schedule)
    hide_availability_payload = {
        "status": "UNAVAILABLE",
        "schedule": []
    }
    resp_hide = update_worker_availability(token, hide_availability_payload)
    assert resp_hide.status_code == 200, f"Expected 200 OK, got {resp_hide.status_code}"
    json_hide = resp_hide.json()
    assert "message" in json_hide and "updated" in json_hide["message"].lower()

test_update_authenticated_worker_availability()