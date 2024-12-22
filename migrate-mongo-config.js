// In migrate-mongo, we use CommonJS modules
const dotenv = require('dotenv');

// Load environment variables if not in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env.local" });
}

// Ensure we have required environment variables
if (!process.env.MONGODB_URI && !process.env.NEXT_PUBLIC_MONGODB_URI) {
  console.warn('Warning: MONGODB_URI is not set in environment variables');
}

if (!process.env.MONGODB_DB && !process.env.NEXT_PUBLIC_MONGODB_DB) {
  console.warn('Warning: MONGODB_DB is not set in environment variables');
}

// Configuration object
const config = {
  mongodb: {
    url: process.env.MONGODB_URI || 
         process.env.NEXT_PUBLIC_MONGODB_URI || 
         "mongodb://localhost:27017",
    
    databaseName: process.env.MONGODB_DB || 
                  process.env.NEXT_PUBLIC_MONGODB_DB || 
                  "your_default_db_name",

    options: {
      useNewUrlParser: true, // Note: These options are actually not needed for newer MongoDB drivers
      useUnifiedTopology: true,
    }
  },

  // Migrations settings
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  moduleSystem: 'commonjs'
};

// Use module.exports for CommonJS
module.exports = config;
