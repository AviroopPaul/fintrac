# Transaction Management Application

A modern web application built with Next.js for managing transactions, featuring user authentication and MongoDB integration.

## Tech Stack

- [Next.js](https://nextjs.org) - React framework for production
- MongoDB - Database
- TypeScript
- Tailwind CSS - Styling
- Authentication system

## Getting Started

1. Clone the repository

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your environment variables:
   Create a `.env.local` file in the root directory with the necessary environment variables (see `.env.example` for required variables)

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Features

- User authentication (login/logout)
- Transaction management
- Responsive design with Tailwind CSS
- MongoDB integration for data persistence

## Project Structure

- `/app` - Next.js app router pages and API routes
- `/components` - Reusable React components
- `/lib` - Utility functions and database configuration
- `/models` - Database models and constants
- `/types` - TypeScript type definitions
- `/scripts` - Utility scripts including database migrations

## Scripts

- `dev` - Start development server
- `build` - Build for production
- `start` - Start production server
- `migrate-add-users` - Run user migration script

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
