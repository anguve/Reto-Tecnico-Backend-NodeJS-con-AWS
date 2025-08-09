Feature: Data validation with storage.validator

  Scenario: Valid data passes validation
    Given I have valid data
    When I validate the data
    Then the validation should succeed

  Scenario: Missing required fields fail validation
    Given I have data missing required fields
    When I validate the data
    Then the validation should fail with the corresponding errors

  Scenario: Timestamp is invalid
    Given I have data with invalid timestamp
    When I validate the data
    Then the validation should fail with timestamp errors
