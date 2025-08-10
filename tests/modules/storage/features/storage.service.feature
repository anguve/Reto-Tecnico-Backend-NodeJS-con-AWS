Feature: StorageService storeData

  Scenario: Successfully store data through repository
    Given the repository saves data successfully
    When I call storeData with valid data
    Then the service should complete without error

  Scenario: Repository throws an error during store
    Given the repository throws an error
    When I call storeData with any data
    Then the service should propagate the error
