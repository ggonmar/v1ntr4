## Contact Test Set

### CON_01
#### As a previously logged-in user, I want to be allowed to store new contact data, so that I can create new contacts in the Contacts API and get an unique id.

---

**Given** an authenticated user
**When** a POST request for storing a new contact with all available fields is sent  
**Then** a 201 response is received  
&nbsp;&nbsp;**And** the contact is created

---

**Given** an authenticated user
**When** a POST request for storing a new contact with all only mandatory fields is sent  
**Then** a 201 response is received  
&nbsp;&nbsp;**And** the contact is created

---

**Given** an authenticated user
**When** a POST request for storing a new contact missing the first name of the contact  
**Then** a 422 response is received  
&nbsp;&nbsp;**And** the contact is not created

---

**Given** an authenticated user
**When** a POST request for storing a new contact missing the last name of the contact  
**Then** a 422 response is received  
&nbsp;&nbsp;**And** the contact is not created

---
---

### CON_2
#### As a user, I want to not allow two entries with the same firstNameand lastName, so that I cannot have duplicates in my agenda.

---

**Given** a user is correctly logged in  
&nbsp;&nbsp;**And** an existing contact `John Doe` exists  
**When** a POST request is sent to create a new contact `John Doe`  
**Then** a 400 response is received  
&nbsp;&nbsp;**And** the duplicate is not created

---

**Given** a user is correctly logged in  
&nbsp;&nbsp;**And** an existing contact `John Doe` exists  
**When** a POST request is sent to create a new contact `John Smith`  
**Then** a 201 response is received  
&nbsp;&nbsp;**And** the new contact `John Smith` is created

---

**Given** a user is correctly logged in  
&nbsp;&nbsp;**And** an existing contact `John Doe` exists  
**When** a POST request is sent to create a new contact `Michael Doe`  
**Then** a 201 response is received  
&nbsp;&nbsp;**And** the new contact `Michael Doe` is created

---
---

### CON_03
#### As a previously logged-in user, I want to retrieve all previously created contacts, so I can retrieve my full agenda.

---

**Given** a user is correctly logged in  
&nbsp;&nbsp;**And** no contacts are in place
**When** a GET request is sent to retrieve the agenda  
**Then** a 200 response (success) is received
&nbsp;&nbsp;**And** a list of 0 is returned

---

**Given** a user is correctly logged in  
&nbsp;&nbsp;**And** 1 contact is in place
**When** a GET request is sent to retrieve the agenda  
**Then** a 200 response (success) is received
&nbsp;&nbsp;**And** a list of 1 is returned
&nbsp;&nbsp;**And** said element contains correct data

....

I could not complete more of the user stories