const mongoose = require('mongoose');

let mongoServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sales_intelligence';

  try {
    // Attempt connecting to the configured URI with a 2.5 second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] Connected to MongoDB at: ${uri}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to external MongoDB (${error.message}).`);
    console.log('[Database] Starting in-memory MongoDB server for seamless zero-config operation...');

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServerInstance = await MongoMemoryServer.create();
      const memUri = mongoServerInstance.getUri();
      
      await mongoose.connect(memUri);
      console.log(`[Database] Connected successfully to In-Memory MongoDB at: ${memUri}`);
    } catch (memErr) {
      console.error('[Database] Failed to start In-Memory MongoDB:', memErr.message);
      throw memErr;
    }
  }

  mongoose.connection.on('error', (err) => {
    console.error('[Database] MongoDB runtime error:', err);
  });
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServerInstance) {
    await mongoServerInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
