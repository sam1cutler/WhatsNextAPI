module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://samcutler@localhost/whats-next',
    TEST_DATABASE_URL: process.env.DATABASE_URL || 'postgresql://samcutler@localhost/whats-next-test',
    JWT_SECRET: process.env.JWT_SECRET || 'it-might-work-4-us'
}