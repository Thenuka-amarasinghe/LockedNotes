# LockedNotes: Secure Online Note-Taking

LockedNotes is a web application designed for secure online note management. It prioritizes security through end-to-end encryption and offers user-friendly functionalities for note creation, editing, and management.

## Table of Contents

1. [Introduction](#introduction)
2. [Project Overview and features](#project-overview-and-features)
3. [Getting Started](#getting-started)
4. [Installation](#installation)
5. [Important Links](#important-links)
6. [Guide to test the application](#guide-to-test-the-application)

## Introduction

This repository contains the source code and documentation for the LockedNotes project. The purpose of this project is to provide users with a secure platform for taking and managing notes online.

## Project Overview and Features

LockedNotes is a secure online note-taking application. It employs various security measures such as JWT authentication and crypto JS encryption to ensure data confidentiality and integrity.

- **User Registration and Authentication**: Users can register and authenticate securely using JWT authentication.
- **Note Creation and Editing**: Users can create, edit, and delete notes, which are stored securely and encrypted.
- **Session Management**: Users sessions are managed individually to display each users with their notes.

## Getting Started

To get started with LockedNotes, follow the installation instructions provided below.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Thenuka-amarasinghe/LockedNotes.git
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Set up the database:

    Download and install MongoDb Compass and connect to connection uri: mongodb://127.0.0.1:27017

4. Run application

    ```bash
    npm start
    ```
	Launch http://localhost:3000 and you will see Home Page with buttons for Login/Signup that launch the signup page
	
## Important Links
1. [Trello Dashboard](https://trello.com/b/03fT4G5J/lockednotes)
2. [GitHub Repository](https://github.com/Thenuka-amarasinghe/LockedNotes)

## Guide to test the application
1. On launching the application, you will see the Home Page at [http://localhost:3000](http://localhost:3000)
2. Ensure you have connected MongoDB Compass to connection URI: `mongodb://127.0.0.1:27017`
3. On the Home page of the LockedNotes web app, you can click Signup.
4. This opens 'Signup Page' where you can sign up as a new user, compliant to input validation.
5. Ensure that the username and password are greater than 6 characters and that the email id is valid, as these will be checked.
6. You will be able to see a successful user as a record in the database now with the password hashed securely and not in plain text.
7. 'Login' with the signed-up user details and the web app will direct to `AccountPage.html` for the successfully logged-in user.
8. The plus button on this page adds new notes using fields 'Title' and 'Description'.
9. New notes can be seen as dynamically added Cards (materialize) in the UI and as encrypted records in the database.
10. Every note's card on the UI has an update and delete button to allow for these features.
11. Any POST, PUT, or DELETE operation on the note triggers a GET operation automatically, generating cards for each note corresponding to the username logged in successfully.
12. The database may contain records for many users at any time, but the application is configured to rightfully do CRUD only on the records corresponding to the logged-in username, not disturbing other users' records in the db.
13. The sign-out feature destroys the JWT session of the user through the token.
14. GET API called after sign out rightfully diplays no records.