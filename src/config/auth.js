// AUTH TOKEN EXPIRES AFTER 5 HOURS CREATED

export default {
  secret: process.env.APP_SECRET,
  expiresIn: '5h',
};
