contract SimpleStorage {
  uint storedData;
  function set(uint valueToStore) {
    storedData = valueToStore;
  }
  function get() constant returns (uint retVal) {
    return storedData;
  }
}