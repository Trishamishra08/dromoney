const mongoose = require('mongoose');

// Get password from command line or environment
const dbPassword = process.argv[2] || process.env.DB_PASSWORD;

if (!dbPassword) {
  console.error("Error: Please provide the destination database password.");
  console.error("Usage: node copyDatabase.js <db_password>");
  process.exit(1);
}

const sourceUri = "mongodb+srv://sikarwarnihal191:code4898@cluster0.x4vp5jb.mongodb.net/dromoney";
const destUri = `mongodb+srv://dromoney:${encodeURIComponent(dbPassword)}@cluster0.za8yr5s.mongodb.net/dromoney?retryWrites=true&w=majority`;

const MongoClient = mongoose.mongo.MongoClient;

async function copyDatabase() {
  console.log("------------------------------------------");
  console.log("Starting database migration process...");
  console.log(`Source URI: ${sourceUri}`);
  console.log(`Destination URI: mongodb+srv://dromoney:*****@cluster0.za8yr5s.mongodb.net/dromoney`);
  console.log("------------------------------------------");

  let sourceClient, destClient;

  try {
    console.log("Connecting to source database...");
    sourceClient = await MongoClient.connect(sourceUri);
    const sourceDb = sourceClient.db();
    console.log("Connected to source database successfully.");

    console.log("Connecting to destination database...");
    destClient = await MongoClient.connect(destUri);
    const destDb = destClient.db();
    console.log("Connected to destination database successfully.");

    console.log("Fetching collections from source database...");
    const collections = await sourceDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections to copy.`);

    for (const colInfo of collections) {
      const colName = colInfo.name;
      
      // Skip system collections
      if (colName.startsWith("system.")) {
        console.log(`Skipping system collection: ${colName}`);
        continue;
      }

      console.log(`\n[Collection] "${colName}"`);

      const sourceCol = sourceDb.collection(colName);
      const destCol = destDb.collection(colName);

      const docCount = await sourceCol.countDocuments();
      console.log(`  Source documents count: ${docCount}`);

      if (docCount === 0) {
        console.log(`  Collection is empty. Skipping.`);
        continue;
      }

      // Drop destination collection if it exists to ensure clean copy
      try {
        console.log(`  Dropping existing collection "${colName}" in destination for a clean slate...`);
        await destCol.drop();
      } catch (err) {
        if (err.code !== 26) { // Code 26 is NamespaceNotFound (collection doesn't exist)
          console.warn(`  Warning dropping collection "${colName}":`, err.message);
        }
      }

      // Stream / Batch Copy
      const batchSize = 1000;
      const cursor = sourceCol.find({});
      let batch = [];
      let totalCopied = 0;

      while (await cursor.hasNext()) {
        const doc = await cursor.next();
        batch.push(doc);

        if (batch.length >= batchSize) {
          await destCol.insertMany(batch);
          totalCopied += batch.length;
          console.log(`  Copied ${totalCopied}/${docCount} documents...`);
          batch = [];
        }
      }

      if (batch.length > 0) {
        await destCol.insertMany(batch);
        totalCopied += batch.length;
        console.log(`  Copied all ${totalCopied}/${docCount} documents.`);
      }

      // Copy indexes
      try {
        const indexes = await sourceCol.indexes();
        if (indexes.length > 1) { // More than just default _id index
          console.log(`  Copying ${indexes.length - 1} indexes...`);
          for (const index of indexes) {
            if (index.name === '_id_') continue;
            
            const indexSpec = { ...index };
            const key = indexSpec.key;
            delete indexSpec.key;
            delete indexSpec.v; 
            delete indexSpec.ns;
            
            await destCol.createIndex(key, indexSpec);
          }
          console.log(`  Successfully copied indexes.`);
        }
      } catch (err) {
        console.warn(`  Warning copying indexes for "${colName}":`, err.message);
      }
    }

    console.log("\n==========================================");
    console.log("Database migration completed successfully! 🎉");
    console.log("==========================================");

  } catch (error) {
    console.error("\n❌ An error occurred during database migration:");
    console.error(error);
  } finally {
    if (sourceClient) {
      await sourceClient.close();
      console.log("Source connection closed.");
    }
    if (destClient) {
      await destClient.close();
      console.log("Destination connection closed.");
    }
  }
}

copyDatabase();
