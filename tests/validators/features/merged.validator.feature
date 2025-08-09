Feature: Data validation with merged.validator

  Background:
    Given I have loaded the validation functions and schemas

  Scenario: Convert string to number
    When I convert "123" using toNumber
    Then the result should be 123

  Scenario: Convert non-numeric string
    When I convert "abc" using toNumber
    Then the result should be undefined

  Scenario: Normalize valid string
    When I normalize " valid string "
    Then the result should be " valid string "

  Scenario: Normalize invalid values
    When I normalize "n/a"
    Then the result should be undefined

  Scenario: Normalize valid date
    When I normalize the date "2023-01-01"
    Then the result should be "2023-01-01"

  Scenario: Normalize invalid date
    When I normalize the date "invalid-date"
    Then the result should be undefined

  Scenario: Validate valid character
    Given a valid character with all required fields
    When I validate it with characterSchema
    Then the validation should pass

  Scenario: Validate incomplete character
    Given a character without required fields
    When I validate it with characterSchema
    Then the validation should fail

  Scenario: Validate list of characters
    Given a list of valid characters
    When I validate it with charactersListSchema
    Then the validation should pass

  Scenario: Validate valid weather data
    Given complete and correct weather data
    When I validate it with weatherDataSchema
    Then the validation should pass

  Scenario: Validate incomplete weather data
    Given weather data without required fields
    When I validate it with weatherDataSchema
    Then the validation should fail
