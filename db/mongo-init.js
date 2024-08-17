db.createUser({
  user: process.env.DB_USER_USERNAME,
  pwd: process.env.DB_USER_PASSWORD,
  roles: [
    {
      role: 'readWrite',
      db: process.env.DB_DATABASE_NAME,
    },
  ],
});

db.createCollection('users');