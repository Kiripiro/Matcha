const dotenv = require('dotenv');

dotenv.config();

const requiredEnvVars = ['HOST', 'USER', 'PASSWORD', 'DATABASE', 'NODE_PORT', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'EMAIL', 'EMAIL_PASSWORD'];

const missingEnvVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
    process.exit(1);
} else {
    console.log('All required environment variables are set.');
}
