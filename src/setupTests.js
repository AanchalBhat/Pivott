

global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};

const localStorageMock = (function() {
  let store = {}

  return {
    getItem: function(key) {
      return store[key] || null
    },
    setItem: function(key, value) {
      store[key] = value.toString()
    },
    removeItem: function(key) {
      delete store[key]
    },
    clear: function() {
      store = {}
    }
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

import {installMockStorage} from '@shopify/jest-dom-mocks';

installMockStorage();

const JSDOMEnvironment = require('jest-environment-jsdom');

const mockPathname = jest.fn();
Object.defineProperty(window, 'location', {
  value: {
    get pathname() {
      return mockPathname();
    },
  },
});