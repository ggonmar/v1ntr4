## Authentication Test Set

##### AUTH_01 As a user, I want to be able to authenticate myself against the API

---

**Given** a user provides valid authentication

**When** a POST request for auth/login is sent

**Then** a 200 response is received`

**And** "access_token" and "token_type" are provided

---

**Given** a user provides invalid authentication

**When** a POST request for auth/login is sent

**Then** a 422 response is received`

**And** a validation error is returned

---

**Given** a user provides missing authentication

**When** a POST request for auth/login is sent

**Then** a 422 response is received`

**And** a validation error is returned
