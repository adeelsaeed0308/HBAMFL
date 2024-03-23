const fs = require('fs').promises;
const mongoose = require('mongoose');
require('./db');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Import into DB
const importData = async () => {
  const dir = await fs.readdir('./models');
  const promises = dir.map(async (file) => {
    let model = require(`./models/${file}`);
    let promise;
    try {
      const json = await fs.readFile(resolveFakeDataFilename(file));
      promise = model.create(JSON.parse(json));
      return promise;
    } catch (error) {
      console.log(error);
      console.log(resolveFakeDataFilename(file));
      process.exit();
    }
  });
  try {
    await Promise.all(promises);
    console.log('Data Imported...');
  } catch (err) {
    console.error(err);
  }
};

// Delete data
const deleteData = async () => {
  const dir = await fs.readdir('./models');
  const promises = dir.map((file) => {
    let model = require(`./models/${file}`);
    return model.deleteMany({});
  });
  try {
    await Promise.all(promises);
    console.log('Data Destroyed...');
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === '-i') {
  importData().then(() => process.exit());
} else if (process.argv[2] === '-d') {
  deleteData().then(() => process.exit());
} else if (process.argv[2] === '-di') {
  deleteData()
    .then(importData)
    .then(() => process.exit());
} else {
  console.log('No option provided. Exiting...');
  process.exit();
}

function resolveFakeDataFilename(file) {
  let filename = './fakeData/';
  filename += file[0].toLowerCase();
  filename += file.slice(1, -3);
  if (filename.endsWith('s')) {
    filename += 'es';
  } else {
    filename += 's';
  }
  return filename + '.json';
}
