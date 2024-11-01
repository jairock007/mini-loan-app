# Mini Loan App

Welcome to the **Mini Loan App**! This platform enables efficient loan management for both administrators and clients, including features for loan requests, approvals, and repayments.

---

## Key Features

- **User Registration and Loan Request**: New users can register and request loans.
- **Loan Approval Process**: Admins can review and approve loan applications.
- **Repayment Management**: Track and manage loan repayments.
- **Additional Loan Requests**: Users can apply for additional loans as needed.

---

## Setup Instructions

### 1. Cloning the Project

To start, clone the Mini Loan App repository from GitHub:

```bash
git clone https://github.com/jairock007/mini-loan-app.git
cd mini-loan-app
```

---

### 2. Running the App Locally

Follow these steps to run the application on your local server.

#### Client Setup (Frontend)

1. Move to the client directory:

   ```bash
   cd client
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Start the client:

   ```bash
   npm run dev
   ```

#### Server Setup (Backend)

1. Navigate to the server directory:

   ```bash
   cd ../server
   ```

2. Install server dependencies:

   ```bash
   npm install
   ```

3. Start the server using Nodemon:

   ```bash
   nodemon
   ```

> **Note**: Ensure the server runs on Port `5000` and the client on Port `5173`.

---

### 3. Admin Access

To grant a user admin privileges:

1. Log in with the admin credentials provided.
2. Go to the **User Management** section.
3. Select the user to promote.
4. Modify the `user_type` field in the MongoDB database from `"user"` to `"admin"`.
5. The user now has access to admin features within the app.

---

Enjoy managing loans effortlessly with the Mini Loan App!
