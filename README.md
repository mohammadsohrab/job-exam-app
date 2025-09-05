# job-exam-app

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)  [![Build Status](https://img.shields.io/github/actions/workflow/status/mohammadsohrab/job-exam-app/main.yml?branch=main)]()

Online Examination Portal using React, Spring Boot & MongoDB with JWT Authentication and Role-Based Access Control.

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech Stack / Key Dependencies](#tech-stack--key-dependencies)
- [File Structure Overview](#file-structure-overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage / Getting Started](#usage--getting-started)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Author/Acknowledgements](#authoracknowledgements)
- [Contact](#contact)

## Description

This project is an online examination portal built with React, Spring Boot, and MongoDB. It incorporates JWT authentication and role-based access control for secure access and management.

## Features

- User authentication and authorization with JWT.
- Role-based access control (RBAC).
- Online examination functionality.
- React-based frontend.
- Spring Boot-based backend.
- MongoDB database.

<!-- TODO: Add screenshots if applicable -->

## Tech Stack / Key Dependencies

- TypeScript
- React
- Spring Boot
- MongoDB
- CSS
- JavaScript
- HTML

## File Structure Overview

```text
.
├── .vscode/
├── README.md
├── demo/
├── hs_err_pid11660.log
├── hs_err_pid19104.log
├── hs_err_pid23168.log
├── hs_err_pid3184.log
├── hs_err_pid584.log
├── hs_err_pid8476.log
└── job-exam-frontend/
```

## Prerequisites

- Node.js (version >= 16)
- Java Development Kit (JDK)
- MongoDB

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mohammadsohrab/job-exam-app.git
   cd job-exam-app
   ```

2. Navigate to the frontend directory:
   ```bash
   cd job-exam-frontend
   ```

3. Install frontend dependencies:
   ```bash
   npm install
   ```

4. Go back to the root directory and navigate to the backend:
   ```bash
   cd ..
   cd demo
   ```

5.  Build the Spring Boot application (you might need to use your IDE or a Maven command here).

## Usage / Getting Started

1.  Start the MongoDB database.

2.  Start the Spring Boot application (backend).

3.  Start the React application (frontend):

    ```bash
    cd job-exam-frontend
    npm start
    ```

4.  Access the application in your browser.


How to build the project:
```bash
npm run build #inside job-exam-frontend
```

How to run tests:
```bash
npm test #inside job-exam-frontend
```

## Configuration

<!-- TODO: Add details about configuration files, e.g., .env, application.properties -->

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author/Acknowledgements

<!-- TODO: Add author and acknowledgements. -->

## Contact

Your Name - [projectlink](https://github.com/mohammadsohrab/job-exam-app) - email@example.com