import requests

BASE_URL = "http://localhost:8080"
TIMEOUT = 30

# Assume these are valid credentials for an authenticated worker
AUTH_PHONE = "+22260000000"
AUTH_PASSWORD = "workerPassword123"

def login_worker(phone, password):
    url = f"{BASE_URL}/api/auth/login"
    payload = {"phone": phone, "password": password}
    response = requests.post(url, json=payload, timeout=TIMEOUT)
    response.raise_for_status()
    data = response.json()
    token = data.get("token")
    if not token:
        raise Exception("Login failed: No token returned")
    return token

def test_update_authenticated_worker_profile():
    token = login_worker(AUTH_PHONE, AUTH_PASSWORD)
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    valid_profile_update = {
        "displayName": "Updated DisplayName",
        "services": ["electrician", "plumbing"],
        "hourlyRate": 30.5,
        "profileImage": "https://example.com/images/profile123.jpg"
    }
    # 1. Update profile with valid data
    url = f"{BASE_URL}/api/workers/profile"
    response = requests.put(url, json=valid_profile_update, headers=headers, timeout=TIMEOUT)
    assert response.status_code == 200, f"Expected 200 OK, got {response.status_code}"
    resp_json = response.json()
    for key, value in valid_profile_update.items():
        assert resp_json.get(key) == value, f"Expected {key} to be updated to {value}"

    # 2. Attempt update with missing required field displayName
    invalid_profile_update = {
        "services": ["cleaning"],
        "hourlyRate": 25.0,
        "profileImage": "https://example.com/images/profile_invalid.jpg"
    }
    response = requests.put(url, json=invalid_profile_update, headers=headers, timeout=TIMEOUT)
    assert response.status_code == 400, f"Expected 400 Bad Request for missing required field, got {response.status_code}"
    err_resp = response.json()
    assert "displayName" in err_resp.get("errors", {}) or "displayName" in str(err_resp), "Expected validation error for missing displayName"

    # 3. Attempt update with empty services array (may be required validation)
    invalid_profile_update2 = {
        "displayName": "DisplayName Again",
        "services": [],
        "hourlyRate": 20.0,
        "profileImage": "https://example.com/images/profile_invalid2.jpg"
    }
    response = requests.put(url, json=invalid_profile_update2, headers=headers, timeout=TIMEOUT)
    # Assuming empty services is invalid, expect 400; else could be 200 - validate accordingly
    if response.status_code == 400:
        err_resp = response.json()
        assert "services" in err_resp.get("errors", {}) or "services" in str(err_resp), "Expected validation error for empty services"
    else:
        assert response.status_code == 200

test_update_authenticated_worker_profile()