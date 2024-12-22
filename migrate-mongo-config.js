// Load environment variables if not in production
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

const config = {
  mongodb: {
    url: process.env.MONGODB_URI || process.env.NEXT_PUBLIC_MONGODB_URI,
    databaseName: process.env.MONGODB_DB || process.env.NEXT_PUBLIC_MONGODB_DB,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
};

module.exports = config; 