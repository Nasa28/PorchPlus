# Fitness+ Backend System

## Overview
This backend system manages gym memberships with various billing structures and sends reminder emails for upcoming dues.

## Design Choices
- **Nest.js** for building a scalable and maintainable backend system.
- **PostgreSQL** for reliable data storage.
- **TypeORM** for object-relational mapping.
- **@nestjs/schedule** for cron job implementation.
- **@nestjs-modules/mailer** for sending emails.

## Data Model
- **Member**: Stores personal information and membership details.
- **Membership**: Stores information about the type of membership and billing.
- **AddOnService**: Stores optional add-on services.
- **Invoice**: Stores invoice details for members.

## Cron Job
- Runs daily to check for upcoming membership fees.
- Differentiates between annual memberships and add-on services.
- Sends reminder emails for upcoming payments.

## Email Functionality
- Uses Gmail SMTP server for sending emails.
- Sends emails with membership and billing details.

## Assumptions
- The dataset provided includes all necessary details for memberships and add-on services.
- Email templates are located in the `templates` directory.

## How to Run
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables for database and email credentials.
4. Run the application: `npm run start`
5. The cron job will run daily to send reminder emails.

## Data Loading from CSV Files
To load data into the system from CSV files:
1. Place the CSV files in the root directory of the project.
2. Make a GET request to `http://localhost:3000/data-load` after starting the application (`npm run start`).
3. The data from CSV files will be processed and inserted into the database.

## Testing
- Includes unit tests to ensure functionality.

## Conclusion
This system effectively manages gym memberships and sends timely reminders for upcoming payments, ensuring a smooth experience for members.
