# DATALINK DEVELOPMENT
## FRONTEND TEST DIVISION

This is a precompiled, scaffolded example of the existing DataLink public API. With this you will demonstrate your proficency in consuming complex REST system architectures.

## Getting Started

We will use [Tilt](https://tilt.dev) to manage the live-reloading of our Loopback based express app, making development much faster. Some familiarity with Docker and shared kernel virtualization is nice, but not necessary; since Tilt takes care of this for you.
(Docker desktop or CE must be installed in some capacity)

1) Install tilt on MacOS with the following code:

`curl -fsSL https://raw.githubusercontent.com/tilt-dev/tilt/master/scripts/install.sh | bash`

2) Once you have this installed, navigate to the root directory and run `tilt up` to start the API server. Open Tilt's browser window byy pressing 'space' or you can use the CLI-viewer, in the console output for the core container there will be a URL exposed on your local machine where the API and swagger docs can be accessed.

## Beginning the test

This test will consist of three phases, representitive of how API's are generally interacted with. You must create a simplified interface to perform these actions using a framework of your choosing (preferably React)

1) Account Creation
    - make a POST request to /companies to create a company account, the bare minimum JSON credentials are as follows:
    ```json
     {
    "companyName": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "password": "string"
    }
    ```
2) Account Login
   - Find where the account is hosted by using /directory
   - Log that account in by POSTing their credentials to /logins
    ```json
     {
    "email": "string",
    "password": "string"
    }
    ```
   - Store the body recieved from logging in, including the auth token, in the browser application memory.
3) Be able to perform authenticated actions using the credentials stored, including
   - Creation of employee accounts by posting to /employees
   - Be able to promote/demote employees with a PUT request to /employees/admin