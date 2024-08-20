# Campaign Management Web Application

### Note: The application is down due to insufficient credits to support Rate limiting serverless infra at Upstash.

## Introduction
This project is a web application designed to help restaurant chains manage their marketing campaigns on food delivery platforms. The application allows users to schedule campaigns to run at specific times of the day and on selected weekdays. The key features include creating, editing, and displaying campaigns with detailed schedules.

**I have already added some dummy campaigns so that it will be easier for the review.**
## Getting Started

First, run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features
- **Display Campaigns**: View a list of campaigns with details such as campaign type, start date, end date, and next scheduled activation.
- **Create Campaign**: Add new campaigns with specific types, start and end dates, and custom schedules.
- **Edit Campaign**: Modify existing campaigns with the same fields available during creation.

## Routes

### Campaign Management
- **`/create-campaign`**: This route is used to create a new campaign. It accepts details such as campaign type, start date, end date, and campaign schedule.
- **`/update-campaign`**: This route allows for editing an existing campaign. It accepts the same fields as the create campaign route.
- **`/campaigns`**: This route retrieves a list of all campaigns, including their type, start date, end date, and the next activation schedule.

### Schedule Management
- **`/create-schedule`**: This route is used to create a new campaign schedule. It allows for selecting multiple weekdays and start & end time combinations.
- **`/update-schedule`**: This route enables the updating of an existing campaign schedule with new weekdays and time combinations.
- **`/all-schedules`**: This route fetches all the campaign schedules available in the system.

## Tech Stack

- **Front-End**
  - Next.js 14(AppRouter), React with TypeScript
  - Tailwind CSS for styling
  - Shadcn for using components
  - Framer motion for animation
  - React Hook Form to manage form states and fields
  - Tanstack Query for caching queries and data fetching

- **Back-End**
  - Node.js with Hono framework for routing and handling API requests
  - Upstash Ratelimit to protect serverless function from DDos

- **Database**
  - PostsgreSQL for storing campaign and schedule data
  - Drizzle ORM to communicate to DB

- **Styling**
  - Tailwind CSS for modern and responsive design

## Setup Instructions
1. Clone the repository: 
   ```sh
   git clone <repository-url>

