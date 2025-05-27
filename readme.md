# Feel Fluent

A website that's designed to teach people soft skills

## Features

### For Students
- Browse and enroll in courses
- Track learning progress
- Read educational blogs
- User profile management
- Subscription management

### For Instructors
- Create and manage courses
- Write and publish blogs
- Track student engagement
- Analytics dashboard
- Profile management

### For Administrators
- User management
- Instructor verification
- Content moderation
- Analytics and reporting
- Subscription management
- System-wide settings

## Tech Stack

### Frontend
- React 19.1.0

### Backend
- PHP Laravel
- MySQL Database
- RESTful API Architecture


## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- PHP 8.0 or higher
- Composer
- MySQL
- npm or yarn

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Configure database in .env file

6. Run migrations:
```bash
php artisan migrate
```

7. Start the development server:
```bash
php artisan serve
```