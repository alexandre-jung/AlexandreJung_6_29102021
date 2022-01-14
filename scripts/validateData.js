// Validate api/data.json data file.
// 1. check photographers for duplicate IDs
// 2. check media for duplicate IDs

const dataFile = "../src/public/api/data.json";
let data = null;

try {
  data = require(dataFile);
} catch(error) {
  console.log(`Could not find ${dataFile}`);
  return;
}

const photographers = data.photographers;
const media = data.media;
const checkedIds = new Set();
let allOk = true;

photographers.forEach((photographer) => {
  const id = photographer.id;
  if (!checkedIds.has(id)) {
    const count = photographers.reduce((previous, current) => {
      if (current.id == id) return previous + 1;
      return previous;
    }, 0);
    if (count > 1) {
      console.error(`Duplicate photographer ID ${id} (found ${count}).`);
      allOk = false;
    }
    checkedIds.add(id);
  }
});
checkedIds.clear();

media.forEach((current) => {
  const id = current.id;
  if (!checkedIds.has(id)) {
    const count = media.reduce((previous, current) => {
      if (current.id == id) return previous + 1;
      return previous;
    }, 0);
    if (count > 1) {
      console.error(`Duplicate media ID ${id} (found ${count}).`);
      allOk = false;
    }
    checkedIds.add(id);
  }
});
checkedIds.clear();

if (allOk) {
  console.log('Everything is ok !');
} else {
  process.exitCode = 1;
}
