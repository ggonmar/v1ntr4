## Authentication Test Plan

### AUTH_01
#### As a user, I want to be able to authenticate myself against the API

---

**Given** a user provides valid authentication  
**When** a POST request for auth/login is sent  
**Then** a 200 response is received  
&nbsp;&nbsp;**And** "access_token" and "token_type" are provided

---

**Given** a user provides invalid authentication  
**When** a POST request for auth/login is sent  
**Then** a 422 response is received  
&nbsp;&nbsp;**And** a validation error is returned

---

**Given** a user provides missing authentication  
**When** a POST request for auth/login is sent  
**Then** a 422 response is received  
&nbsp;&nbsp;**And** a validation error is returned  

---
---

### AUTH_02
#### As a previously logged-in user, I want to be able to check my authentication credentials against /auth/me endpoint, so that I can check if I am properly logged in the API.

---

**Given** a user is correctly logged in  
**When** a GET request is sent against auth/me  
**Then** a 200 response is received  
&nbsp;&nbsp;**And** the correct response header is returned

---

**Given** a user is not correctly logged in   
**When** a GET request is sent against auth/me is  
**Then** a 401 response is received  
&nbsp;&nbsp;**And** `detail: Non authenticated` is returned. 

---
---

### AUTH_03
#### As a previously logged-in user, I want to be able to logout from the API using /auth/logout endpoint, so that I can no longer use the API.

---

**Given** a user is correctly logged in  
**When** a GET request is sent against auth/logout  
**Then** a 200 response (success) is received

--- 

**Given** a user is not correctly logged in  
**When** a GET request is sent against auth/logout  
**Then** a 401 response (not authorised) is received