import '@testing-library/jest-dom/extend-expect'; // For extra matchers like toBeInTheDocument
import 'whatwg-fetch'; // For mocking fetch requests

// Polyfill for MutationObserver
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
  unobserve(element) {}
  takeRecords() {
    return [];
  }
};
