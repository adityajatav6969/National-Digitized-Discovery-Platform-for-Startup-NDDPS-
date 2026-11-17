const { users, schemes, startups, resources } = require('../seed/seedData');
const bcrypt = require('bcryptjs');

// In-memory data store
const store = {
  users: [],
  startups: [],
  schemes: [],
  resources: [],
};

let initialized = false;

function initialize() {
  if (initialized) return;

  // Seed users with hashed passwords and IDs
  store.users = users.map((u, i) => {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(u.password, salt);
    return {
      ...u,
      _id: `u${i + 1}`,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });

  // Seed schemes
  store.schemes = schemes.map((s, i) => ({
    ...s,
    _id: `sc${i + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // Seed startups with owner
  const startupUser = store.users.find((u) => u.role === 'startup');
  store.startups = startups.map((s, i) => ({
    ...s,
    _id: `s${i + 1}`,
    owner: startupUser ? startupUser._id : 'u2',
    matchedSchemes: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  // Seed resources
  store.resources = resources.map((r, i) => ({
    ...r,
    _id: `r${i + 1}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  initialized = true;
}

// Auto-initialize on require
initialize();

let idCounters = {
  users: store.users.length,
  startups: store.startups.length,
  schemes: store.schemes.length,
  resources: store.resources.length,
};

function getAll(collection) {
  return [...store[collection]];
}

function getById(collection, id) {
  return store[collection].find((item) => String(item._id) === String(id)) || null;
}

function create(collection, item) {
  idCounters[collection] = (idCounters[collection] || 0) + 1;
  const prefix = collection === 'users' ? 'u' : collection === 'startups' ? 's' : collection === 'schemes' ? 'sc' : 'r';
  const newItem = {
    ...item,
    _id: `${prefix}${idCounters[collection]}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  store[collection].push(newItem);
  return newItem;
}

function update(collection, id, updates) {
  const index = store[collection].findIndex((item) => String(item._id) === String(id));
  if (index === -1) return null;
  store[collection][index] = {
    ...store[collection][index],
    ...updates,
    _id: store[collection][index]._id,
    updatedAt: new Date().toISOString(),
  };
  return store[collection][index];
}

function remove(collection, id) {
  const index = store[collection].findIndex((item) => String(item._id) === String(id));
  if (index === -1) return false;
  store[collection].splice(index, 1);
  return true;
}

function query(collection, filters) {
  return store[collection].filter((item) => {
    return Object.keys(filters).every((key) => {
      const filterVal = filters[key];
      const itemVal = item[key];

      if (filterVal === undefined || filterVal === null || filterVal === '') return true;
      if (itemVal === undefined || itemVal === null) return false;

      // Handle nested object (e.g., location.state)
      if (typeof filterVal === 'object' && !Array.isArray(filterVal)) {
        return Object.keys(filterVal).every((subKey) => {
          if (!filterVal[subKey]) return true;
          if (!itemVal[subKey]) return false;
          return String(itemVal[subKey]).toLowerCase().includes(String(filterVal[subKey]).toLowerCase());
        });
      }

      // Partial match for strings
      if (typeof itemVal === 'string' && typeof filterVal === 'string') {
        return itemVal.toLowerCase().includes(filterVal.toLowerCase());
      }

      return itemVal === filterVal;
    });
  });
}

module.exports = { getAll, getById, create, update, remove, query, store };
