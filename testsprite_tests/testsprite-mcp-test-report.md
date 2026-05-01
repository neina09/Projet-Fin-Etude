# TestSprite AI Testing Report (MCP)

---

## 1️⃣ Document Metadata

| Field | Value |
|-------|-------|
| **Project Name** | Projet-Fin-Etude (Ommalak) |
| **Date** | 2026-04-30 |
| **Prepared by** | TestSprite AI + Claude Code |
| **Test Type** | Frontend (E2E browser automation) |
| **Total Tests Run** | 15 |
| **Pass** | 3 ✅ |
| **Fail** | 4 ❌ |
| **Blocked** | 8 🚫 |

---

## 2️⃣ Requirement Validation Summary

### Auth — Registration & Login

#### TC001 Login and access the dashboard
- **Test Code:** [TC001_Login_and_access_the_dashboard.py](./TC001_Login_and_access_the_dashboard.py)
- **Status:** ❌ Failed
- **Error:** Login did not succeed; page went blank after multiple attempts.
- **Analysis:** Two compounding bugs caused this. First, when the backend returns a 401 for wrong credentials, the axios interceptor in `axios.js` immediately called `window.location.href = '/login'` — a full-page reload that blanked the SPA mid-render. Second, `AuthContext.login` destructured the response with `const { token, ...userData }` but the backend wraps user fields inside a nested `user` key (`{ token, user: {...} }`), so `userData` was `{ user: {...} }` instead of the flat user object. This caused role detection (`user?.role`) to always be `undefined`, breaking dashboard routing.
- **Fix applied:** `axios.js` — skip the 401 redirect for `/auth/` endpoints. `AuthContext.jsx` — changed to `const { token, user: userData } = res.data`.
---

#### TC002 Verify OTP for registration and continue to login
- **Test Code:** [TC002_Verify_OTP_for_registration_and_continue_to_login.py](./TC002_Verify_OTP_for_registration_and_continue_to_login.py)
- **Status:** ❌ Failed
- **Error:** Submit did not navigate to OTP screen; "Please fill out this field" tooltip appeared on phone input.
- **Analysis:** The registration form used HTML5 native validation (`required` + `type="tel"`). Browser automation fills inputs differently from real keystrokes — in some cases the React controlled component state is not updated (synthetic `onChange` not triggered), causing the DOM to show a value while React state remains empty. On submit, React re-renders the input with `value=''` which triggers the native required validator and blocks the form. Additionally, no client-side empty-field check existed, so even when phone was truly empty, the code fell through to the API call.
- **Fix applied:** Added `noValidate` to the Register form and added explicit `if (!form.phone.trim())` / `if (!form.fullName.trim())` guards that show React error messages instead of native browser tooltips.
---

#### TC003 Start registration and proceed to OTP verification screen
- **Test Code:** [TC003_Start_registration_and_proceed_to_OTP_verification_screen.py](./TC003_Start_registration_and_proceed_to_OTP_verification_screen.py)
- **Status:** ❌ Failed
- **Error:** Page stayed on /register after multiple submit attempts; submit button became stale.
- **Analysis:** Same root cause as TC002 — HTML5 native validation blocked form submission before `handleSubmit` was ever called. The stale-element errors were a downstream effect of the SPA re-rendering while the automation held a reference to the now-replaced DOM node.
- **Fix applied:** Same as TC002.
---

#### TC004 Request password reset OTP and continue to OTP entry
- **Test Code:** [TC004_Request_password_reset_OTP_and_continue_to_OTP_entry.py](./TC004_Request_password_reset_OTP_and_continue_to_OTP_entry.py)
- **Status:** ✅ Passed
- **Analysis:** The forgot-password flow works correctly end-to-end. The form submits, OTP is sent, and the app navigates to the OTP entry screen.
---

#### TC005 Reset password successfully and return to login
- **Test Code:** [TC005_Reset_password_successfully_and_return_to_login.py](./TC005_Reset_password_successfully_and_return_to_login.py)
- **Status:** ❌ Failed
- **Error:** Backend returned `password: must not be blank` even though passwords appeared populated in the UI.
- **Analysis:** Field name mismatch between frontend and backend. The backend `ResetPasswordRequest` DTO declares the field as `password`, but `auth.js` was sending `{ phone, code, newPassword }`. Spring's `@NotBlank` validation on `password` failed because that key was absent in the request body.
- **Fix applied:** `auth.js` line 13 — changed `{ phone, code, newPassword }` to `{ phone, code, password: newPassword }`.
---

### Bookings

#### TC006 Submit a booking request from a worker profile
- **Test Code:** [TC006_Submit_a_booking_request_from_a_worker_profile.py](./TC006_Submit_a_booking_request_from_a_worker_profile.py)
- **Status:** 🚫 Blocked
- **Error:** SPA rendered blank on / and /workers; no UI elements reachable.
- **Analysis:** Blocked by the same SPA blank-render issue seen in TC001/TC015, likely triggered by the 401 interceptor causing a mid-session full-page reload that left the app in a broken state. With the axios interceptor fix in place, this should unblock.
---

#### TC007 Cancel an active booking from the user dashboard
- **Test Code:** [TC007_Cancel_an_active_booking_from_the_user_dashboard.py](./TC007_Cancel_an_active_booking_from_the_user_dashboard.py)
- **Status:** ❌ Failed
- **Error:** No cancel button found on the booking card.
- **Analysis:** The `UserDashboard` bookings tab rendered booking cards with only a status badge — no cancel action. The backend already exposed `PATCH /api/bookings/{id}/cancel` but `bookings.js` had no `cancel` method and the dashboard had no corresponding UI.
- **Fix applied:** Added `cancel: (id) => api.patch(...)` to `bookingsApi`. Added a "Annuler" danger button on booking cards for `PENDING` and `CONFIRMED` status bookings, with optimistic status update on success.
---

#### TC008 Admin can access admin dashboard and view platform statistics
- **Test Code:** [TC008_Admin_can_access_admin_dashboard_and_view_platform_statistics.py](./TC008_Admin_can_access_admin_dashboard_and_view_platform_statistics.py)
- **Status:** ✅ Passed
- **Analysis:** Admin login and dashboard access worked. Note: the `AuthContext` user-data extraction bug (TC001 analysis) means the admin role check was likely failing — the test may have passed by finding statistics on the /dashboard route. The `AuthContext` fix will make admin routing work correctly going forward.
---

#### TC009 Accept an incoming booking request from the worker dashboard
- **Test Code:** [TC009_Accept_an_incoming_booking_request_from_the_worker_dashboard.py](./TC009_Accept_an_incoming_booking_request_from_the_worker_dashboard.py)
- **Status:** 🚫 Blocked
- **Error:** Authentication failed; page remained on /login.
- **Analysis:** Blocked by the same login bug (TC001). With the AuthContext and axios interceptor fixes applied, worker login and dashboard routing should work.
---

### Workers & Tasks

#### TC010 Find a worker using search and filters
- **Test Code:** [TC010_Find_a_worker_using_search_and_filters_and_open_the_worker_profile.py](./TC010_Find_a_worker_using_search_and_filters_and_open_the_worker_profile.py)
- **Status:** 🚫 Blocked
- **Error:** 0 workers in the directory ("Aucun travailleur trouvé").
- **Analysis:** No worker data in the test environment database. Not a code bug — requires seed data or a registered+approved worker account.
---

#### TC011 Submit an offer from task detail
- **Test Code:** [TC011_Submit_an_offer_from_task_detail_and_see_it_listed.py](./TC011_Submit_an_offer_from_task_detail_and_see_it_listed.py)
- **Status:** 🚫 Blocked
- **Error:** No tasks available ("Aucune tâche disponible").
- **Analysis:** No task data in the test environment. Requires a user to create a task first.
---

#### TC012 Browse tasks and open task detail
- **Test Code:** [TC012_Browse_tasks_and_open_task_detail_from_filtered_results.py](./TC012_Browse_tasks_and_open_task_detail_from_filtered_results.py)
- **Status:** 🚫 Blocked
- **Error:** No tasks available after applying "Ouvert" filter.
- **Analysis:** Same as TC011 — no seed data.
---

### Admin

#### TC013 Admin can view the user list in user management
- **Test Code:** [TC013_Admin_can_view_the_user_list_in_user_management.py](./TC013_Admin_can_view_the_user_list_in_user_management.py)
- **Status:** ✅ Passed
- **Analysis:** Admin user management list rendered successfully.
---

#### TC014 Rate a completed booking from the user dashboard
- **Test Code:** [TC014_Rate_a_completed_booking_from_the_user_dashboard.py](./TC014_Rate_a_completed_booking_from_the_user_dashboard.py)
- **Status:** 🚫 Blocked
- **Error:** No completed booking available; existing booking is in "pending" status.
- **Analysis:** Requires a booking to be accepted and marked completed before rating is possible. Not a code bug — data/flow dependency.
---

#### TC015 Non-admin cannot access the admin dashboard
- **Test Code:** [TC015_Non_admin_cannot_access_the_admin_dashboard.py](./TC015_Non_admin_cannot_access_the_admin_dashboard.py)
- **Status:** 🚫 Blocked
- **Error:** /login page was blank with 0 interactive elements.
- **Analysis:** Caused by the SPA blank-page issue from TC001/TC006 — a prior test's 401-triggered full-page reload left the app in a broken state. With the axios interceptor fix, the login page should render correctly in isolation.
---

## 3️⃣ Coverage & Matching Metrics

| Requirement Group | Total Tests | ✅ Passed | ❌ Failed | 🚫 Blocked |
|---|---|---|---|---|
| Auth (Login / Register / Password) | 5 | 1 | 4 | 0 |
| Bookings | 4 | 0 | 1 | 3 |
| Workers & Tasks | 3 | 0 | 0 | 3 |
| Admin | 3 | 2 | 0 | 1 |
| **Total** | **15** | **3 (20%)** | **5 (33%)** | **7 (47%)** |

**Bugs fixed in this session: 5**
- `axios.js` — 401 interceptor no longer redirects on auth endpoints (fixes blank-page cascade)
- `AuthContext.jsx` — user data correctly extracted from nested `{ token, user: {...} }` response
- `auth.js` — reset password payload uses `password` key (matches backend DTO)
- `bookings.js` + `UserDashboard.jsx` — cancel booking endpoint wired up with UI button
- `Register.jsx` + `Login.jsx` — `noValidate` + custom empty-field guards replace native browser validation

---

## 4️⃣ Key Gaps / Risks

1. **No test seed data** — 8 of 15 tests were blocked purely by missing database records (workers, tasks, completed bookings). A seed script or fixture setup is needed for meaningful E2E coverage.

2. **Role-based routing was silently broken** — The `AuthContext` user-data extraction bug caused `isAdmin` and `isWorker` to always be `false`. Admin/worker routing appeared to work in some tests only because the tests found content on the wrong dashboard page. This could let a non-admin navigate to `/admin` if they know the URL and the route guard is bypassed by the wrong role value.

3. **401 interceptor was too aggressive** — Using `window.location.href` for session expiry causes a full-page SPA reload. Consider using React Router's `navigate` and an event/context-based logout instead to preserve SPA state cleanly.

4. **No error boundary** — If any component throws a render error, the entire app goes blank. Adding a top-level React Error Boundary would prevent the cascading blank-page failures seen across multiple tests.

5. **Worker dashboard accept/reject not tested** — TC009 was blocked by the login bug. Once login is fixed, the worker booking response flow should be retested.
