Feature: StorageController store

  Scenario: Successfully validate and store data
    Given the storage service stores data successfully
    When I call store with valid data
    Then the response statusCode should be 201
    And the response body should contain a success message

  Scenario: Validation or storage failure
    Given the storage service throws an error
    When I call store with invalid data
    Then the response statusCode should be 502
    And the response body should contain an error message
