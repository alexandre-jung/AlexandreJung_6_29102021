// Validate api/data.json data file.
// 1. check photographers for duplicate IDs
// 2. check media for duplicate IDs

const data = require("./api/data.json");
const photographers = data.photographers;
const media = data.media;

const checkedIds = new Set();
photographers.forEach((photographer) => {
  const id = photographer.id;
  if (!checkedIds.has(id)) {
    const count = photographers.reduce((previous, current) => {
      if (current.id == id) return previous + 1;
      return previous;
    }, 0);
    if (count > 1) {
      console.error(`Duplicate photographer ID ${id} (found ${count}).`);
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
    }
    checkedIds.add(id);
  }
});
