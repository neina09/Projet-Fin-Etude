#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Ommalak Backend – Full API Test Suite
# Run:  chmod +x test_api.sh && ./test_api.sh
# Requires: curl, jq   |   Backend must be running on :8080
# ─────────────────────────────────────────────────────────────────────────────

BASE="http://localhost:8080/api"
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'
PASS=0; FAIL=0

# Unique suffix per run → no "already registered" conflicts
SFX=$(date +%M%S%N | head -c 6)
PHONE_CLIENT="+2221${SFX}01"
PHONE_WORKER="+2221${SFX}02"
PHONE_ADMIN="+2221${SFX}03"
PHONE_THROW="+2221${SFX}99"

section() { echo -e "\n${CYAN}${BOLD}━━━  $1  ━━━${NC}"; }

check() {
  local label="$1" status="$2" expect="$3"
  if [[ "$status" == "$expect" ]]; then
    echo -e "  ${GREEN}✓${NC} $label  ${YELLOW}[$status]${NC}"
    PASS=$((PASS+1))
  else
    echo -e "  ${RED}✗${NC} $label  ${YELLOW}[$status]${NC}  (expected $expect)"
    echo -e "    Body: $BODY" | head -3
    FAIL=$((FAIL+1))
  fi
}

req() {
  local method="$1" path="$2"; shift 2
  local raw
  raw=$(curl -s -w $'\n''%{http_code}' -X "$method" "$BASE$path" \
    -H "Content-Type: application/json" "$@")
  STATUS="${raw##*$'\n'}"
  BODY="${raw%$'\n'*}"
}

echo -e "${CYAN}${BOLD}  Phones: client=$PHONE_CLIENT  worker=$PHONE_WORKER  admin=$PHONE_ADMIN${NC}"

# ─────────────────────────────────────────────────────────────────────────────
section "1 · AUTH – OTP"
# ─────────────────────────────────────────────────────────────────────────────

req POST /auth/send-otp -d "{\"phone\":\"$PHONE_CLIENT\"}"; check "Send OTP (client)" "$STATUS" 200
req POST /auth/send-otp -d "{\"phone\":\"$PHONE_WORKER\"}"; check "Send OTP (worker)" "$STATUS" 200
req POST /auth/send-otp -d "{\"phone\":\"$PHONE_ADMIN\"}";  check "Send OTP (admin)"  "$STATUS" 200

echo ""
echo -e "  ${YELLOW}⚑  Check backend console for OTP codes, then paste them below.${NC}"
echo ""
read -rp "  OTP for client ($PHONE_CLIENT): " OTP_CLIENT
read -rp "  OTP for worker ($PHONE_WORKER): " OTP_WORKER
read -rp "  OTP for admin  ($PHONE_ADMIN):  " OTP_ADMIN

req POST /auth/verify-otp -d "{\"phone\":\"$PHONE_CLIENT\",\"code\":\"$OTP_CLIENT\"}"; check "Verify OTP (client)" "$STATUS" 200
req POST /auth/verify-otp -d "{\"phone\":\"$PHONE_WORKER\",\"code\":\"$OTP_WORKER\"}"; check "Verify OTP (worker)" "$STATUS" 200
req POST /auth/verify-otp -d "{\"phone\":\"$PHONE_ADMIN\",\"code\":\"$OTP_ADMIN\"}";   check "Verify OTP (admin)"  "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
section "2 · AUTH – Register"
# ─────────────────────────────────────────────────────────────────────────────

req POST /auth/register -d "{\"fullName\":\"Ahmed Client\",\"phone\":\"$PHONE_CLIENT\",\"password\":\"Test1234!\",\"role\":\"CLIENT\"}"
check "Register CLIENT" "$STATUS" 200
CLIENT_TOKEN=$(echo "$BODY" | jq -r '.token // empty')
echo "    → CLIENT token: ${CLIENT_TOKEN:0:40}..."

req POST /auth/register -d "{\"fullName\":\"Brahim Worker\",\"phone\":\"$PHONE_WORKER\",\"password\":\"Test1234!\"}"
check "Register WORKER (as CLIENT)" "$STATUS" 200
WORKER_TOKEN=$(echo "$BODY" | jq -r '.token // empty')

req POST /auth/register -d "{\"fullName\":\"Admin User\",\"phone\":\"$PHONE_ADMIN\",\"password\":\"Test1234!\",\"role\":\"ADMIN\"}"
check "Register ADMIN" "$STATUS" 200
ADMIN_TOKEN=$(echo "$BODY" | jq -r '.token // empty')

# ─────────────────────────────────────────────────────────────────────────────
section "3 · AUTH – Login & Profile"
# ─────────────────────────────────────────────────────────────────────────────

req POST /auth/login -d "{\"phone\":\"$PHONE_CLIENT\",\"password\":\"Test1234!\"}"
check "Login CLIENT" "$STATUS" 200
T=$(echo "$BODY" | jq -r '.token // empty'); [[ -n "$T" ]] && CLIENT_TOKEN="$T"

req POST /auth/login -d "{\"phone\":\"$PHONE_WORKER\",\"password\":\"Test1234!\"}"
check "Login WORKER" "$STATUS" 200
T=$(echo "$BODY" | jq -r '.token // empty'); [[ -n "$T" ]] && WORKER_TOKEN="$T"

req POST /auth/login -d "{\"phone\":\"$PHONE_ADMIN\",\"password\":\"Test1234!\"}"
check "Login ADMIN" "$STATUS" 200
T=$(echo "$BODY" | jq -r '.token // empty'); [[ -n "$T" ]] && ADMIN_TOKEN="$T"

req POST /auth/login -d "{\"phone\":\"$PHONE_CLIENT\",\"password\":\"wrongpassword\"}"
check "Login wrong password → 401" "$STATUS" 401

req GET /auth/me -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /me (client)" "$STATUS" 200
CLIENT_ID=$(echo "$BODY" | jq -r '.id // empty')
echo "    → client id: $CLIENT_ID"

req GET /auth/me -H "Authorization: Bearer $WORKER_TOKEN"
check "GET /me (worker)" "$STATUS" 200
WORKER_ID=$(echo "$BODY" | jq -r '.id // empty')
echo "    → worker id: $WORKER_ID"

req GET /auth/me
check "GET /me (no token → 403)" "$STATUS" 403

# ─────────────────────────────────────────────────────────────────────────────
section "4 · AUTH – Become Worker"
# ─────────────────────────────────────────────────────────────────────────────

req POST /auth/become-worker \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"profession":"Plumber","salaryExpectation":500,"bio":"Experienced plumber"}'
check "Become worker" "$STATUS" 200

# Re-login to pick up WORKER role
req POST /auth/login -d "{\"phone\":\"$PHONE_WORKER\",\"password\":\"Test1234!\"}"
T=$(echo "$BODY" | jq -r '.token // empty'); [[ -n "$T" ]] && WORKER_TOKEN="$T"

# ─────────────────────────────────────────────────────────────────────────────
section "5 · AUTH – Forgot / Reset Password"
# ─────────────────────────────────────────────────────────────────────────────

req POST /auth/forgot-password -d "{\"phone\":\"$PHONE_CLIENT\"}"
check "Forgot password (send OTP)" "$STATUS" 200

echo ""
read -rp "  OTP for reset ($PHONE_CLIENT): " OTP_RESET

req POST /auth/reset-password -d "{\"phone\":\"$PHONE_CLIENT\",\"code\":\"$OTP_RESET\",\"password\":\"NewPass456!\"}"
check "Reset password" "$STATUS" 200

req POST /auth/login -d "{\"phone\":\"$PHONE_CLIENT\",\"password\":\"NewPass456!\"}"
check "Login with new password" "$STATUS" 200
T=$(echo "$BODY" | jq -r '.token // empty'); [[ -n "$T" ]] && CLIENT_TOKEN="$T"

# ─────────────────────────────────────────────────────────────────────────────
section "6 · WORKERS – Browse"
# ─────────────────────────────────────────────────────────────────────────────

req GET /workers -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /workers (all)" "$STATUS" 200
echo "    → workers found: $(echo "$BODY" | jq 'length // 0')"

req GET "/workers?profession=Plumber" -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /workers?profession=Plumber" "$STATUS" 200

req GET "/workers?availability=AVAILABLE" -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /workers?availability=AVAILABLE" "$STATUS" 200

req GET "/workers?search=Brahim" -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /workers?search=Brahim" "$STATUS" 200

req GET "/workers/$WORKER_ID" -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /workers/:id" "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
section "7 · WORKERS – Update Profile & Availability"
# ─────────────────────────────────────────────────────────────────────────────

req PUT /workers/profile \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"profession":"Electrician","salaryExpectation":700,"bio":"Also do electrical work"}'
check "PUT /workers/profile" "$STATUS" 200

req PUT /workers/availability \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"status":"BUSY"}'
check "PUT /workers/availability (BUSY)" "$STATUS" 200

req PUT /workers/availability \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"status":"AVAILABLE"}'
check "PUT /workers/availability (AVAILABLE)" "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
section "8 · TASKS – CRUD"
# ─────────────────────────────────────────────────────────────────────────────

req POST /tasks \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d '{"title":"Fix kitchen sink","description":"Leaking tap needs urgent repair","budget":300,"location":"Nouakchott"}'
check "POST /tasks (create)" "$STATUS" 200
TASK_ID=$(echo "$BODY" | jq -r '.id // empty')
echo "    → task id: $TASK_ID"

req GET /tasks -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /tasks (all)" "$STATUS" 200

req GET "/tasks?status=PENDING" -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /tasks?status=PENDING" "$STATUS" 200

req GET /tasks/my -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /tasks/my" "$STATUS" 200

req GET "/tasks/$TASK_ID" -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /tasks/:id" "$STATUS" 200

req PUT "/tasks/$TASK_ID" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d '{"title":"Fix kitchen sink (urgent)","description":"Updated desc","budget":350,"location":"Nouakchott"}'
check "PUT /tasks/:id (update)" "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
section "9 · TASKS – Offers"
# ─────────────────────────────────────────────────────────────────────────────

req PATCH "/tasks/$TASK_ID/status" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d '{"status":"OPEN"}'
check "PATCH /tasks/:id/status → OPEN" "$STATUS" 200

req POST "/tasks/$TASK_ID/offers" \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"price":320,"message":"I can fix it today"}'
check "POST /tasks/:id/offers (submit)" "$STATUS" 200
OFFER_ID=$(echo "$BODY" | jq -r '.id // empty')
echo "    → offer id: $OFFER_ID"

req GET "/tasks/$TASK_ID/offers" -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /tasks/:id/offers" "$STATUS" 200

req POST "/tasks/$TASK_ID/offers/$OFFER_ID/accept" \
  -H "Authorization: Bearer $CLIENT_TOKEN"
check "POST accept offer" "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
section "10 · TASKS – Status Update"
# ─────────────────────────────────────────────────────────────────────────────

req PATCH "/tasks/$TASK_ID/status" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d '{"status":"COMPLETED"}'
check "PATCH /tasks/:id/status → COMPLETED" "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
section "11 · WORKERS – Rate"
# ─────────────────────────────────────────────────────────────────────────────

req POST "/workers/$WORKER_ID/rate" \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d '{"rating":5,"comment":"Excellent work!"}'
check "POST /workers/:id/rate" "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
section "12 · BOOKINGS"
# ─────────────────────────────────────────────────────────────────────────────

req POST /bookings \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d "{\"workerId\":$WORKER_ID,\"date\":\"2025-06-01\",\"description\":\"Need plumbing help\"}"
check "POST /bookings (create)" "$STATUS" 200
BOOKING_ID=$(echo "$BODY" | jq -r '.id // empty')
echo "    → booking id: $BOOKING_ID"

req GET /bookings/my -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /bookings/my (client)" "$STATUS" 200

req GET /bookings/worker -H "Authorization: Bearer $WORKER_TOKEN"
check "GET /bookings/worker" "$STATUS" 200

req PATCH "/bookings/$BOOKING_ID/respond" \
  -H "Authorization: Bearer $WORKER_TOKEN" \
  -d '{"status":"ACCEPTED"}'
check "PATCH /bookings/:id/respond (ACCEPTED)" "$STATUS" 200

req POST /bookings \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d "{\"workerId\":$WORKER_ID,\"date\":\"2025-06-05\",\"description\":\"Second job\"}"
check "POST /bookings (second)" "$STATUS" 200
BOOKING2_ID=$(echo "$BODY" | jq -r '.id // empty')

req PATCH "/bookings/$BOOKING2_ID/cancel" -H "Authorization: Bearer $CLIENT_TOKEN"
check "PATCH /bookings/:id/cancel" "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
section "13 · NOTIFICATIONS"
# ─────────────────────────────────────────────────────────────────────────────

req GET /notifications -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /notifications" "$STATUS" 200
NOTIF_ID=$(echo "$BODY" | jq -r '.[0].id // empty')

req GET /notifications/unread-count -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /notifications/unread-count" "$STATUS" 200
echo "    → unread: $(echo "$BODY" | jq -c '.')"

if [[ -n "$NOTIF_ID" ]]; then
  req PATCH "/notifications/$NOTIF_ID/read" -H "Authorization: Bearer $CLIENT_TOKEN"
  check "PATCH /notifications/:id/read" "$STATUS" 200
fi

req PATCH /notifications/read-all -H "Authorization: Bearer $CLIENT_TOKEN"
check "PATCH /notifications/read-all" "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
section "14 · ADMIN"
# ─────────────────────────────────────────────────────────────────────────────

req GET /admin/stats -H "Authorization: Bearer $ADMIN_TOKEN"
check "GET /admin/stats" "$STATUS" 200
echo "    → $(echo "$BODY" | jq -c '.')"

req GET /admin/workers/pending -H "Authorization: Bearer $ADMIN_TOKEN"
check "GET /admin/workers/pending" "$STATUS" 200
echo "    → pending: $(echo "$BODY" | jq 'length // 0')"

req POST "/admin/workers/$WORKER_ID/approve" -H "Authorization: Bearer $ADMIN_TOKEN"
check "POST /admin/workers/:id/approve" "$STATUS" 200

req GET /admin/users -H "Authorization: Bearer $ADMIN_TOKEN"
check "GET /admin/users" "$STATUS" 200

req GET "/admin/users?search=Ahmed" -H "Authorization: Bearer $ADMIN_TOKEN"
check "GET /admin/users?search=Ahmed" "$STATUS" 200

req GET /admin/tasks -H "Authorization: Bearer $ADMIN_TOKEN"
check "GET /admin/tasks" "$STATUS" 200

# Throwaway: register → become-worker → reject → delete
req POST /auth/send-otp -d "{\"phone\":\"$PHONE_THROW\"}"
check "Send OTP (throwaway)" "$STATUS" 200
echo ""
read -rp "  OTP for throwaway ($PHONE_THROW): " OTP_THROW
req POST /auth/verify-otp -d "{\"phone\":\"$PHONE_THROW\",\"code\":\"$OTP_THROW\"}"
check "Verify OTP (throwaway)" "$STATUS" 200

req POST /auth/register -d "{\"fullName\":\"Throwaway Worker\",\"phone\":\"$PHONE_THROW\",\"password\":\"Test1234!\"}"
check "Register throwaway" "$STATUS" 200
THROW_TOKEN=$(echo "$BODY" | jq -r '.token // empty')
THROW_ID=$(echo "$BODY" | jq -r '.user.id // empty')

req POST /auth/become-worker \
  -H "Authorization: Bearer $THROW_TOKEN" \
  -d '{"profession":"Painter","salaryExpectation":400,"bio":"Throwaway"}'
check "Become worker (throwaway)" "$STATUS" 200

req POST "/admin/workers/$THROW_ID/reject" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"reason":"Incomplete documents"}'
check "POST /admin/workers/:id/reject" "$STATUS" 200

req DELETE "/admin/users/$THROW_ID" -H "Authorization: Bearer $ADMIN_TOKEN"
check "DELETE /admin/users/:id" "$STATUS" 200

req GET /admin/stats -H "Authorization: Bearer $CLIENT_TOKEN"
check "GET /admin/stats (client → 403)" "$STATUS" 403

# ─────────────────────────────────────────────────────────────────────────────
section "15 · CLEANUP – Delete task"
# ─────────────────────────────────────────────────────────────────────────────

req POST /tasks \
  -H "Authorization: Bearer $CLIENT_TOKEN" \
  -d '{"title":"Temp task","description":"Will be deleted","budget":100,"location":"Tevragh-Zeina"}'
check "POST /tasks (spare)" "$STATUS" 200
SPARE_ID=$(echo "$BODY" | jq -r '.id // empty')

req DELETE "/tasks/$SPARE_ID" -H "Authorization: Bearer $CLIENT_TOKEN"
check "DELETE /tasks/:id" "$STATUS" 200

# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  Results:  ${GREEN}$PASS passed${NC}  /  ${RED}$FAIL failed${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
[[ $FAIL -eq 0 ]] && echo -e "  ${GREEN}All tests passed!${NC}" || echo -e "  ${RED}Some tests failed — check output above.${NC}"
echo ""
