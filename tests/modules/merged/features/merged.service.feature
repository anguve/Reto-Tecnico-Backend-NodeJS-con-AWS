Feature: MergedService fetchMergedData

  Scenario: Successfully fetch and merge data
    Given the SWAPI API returns character data
    And the weather API returns weather data
    And the repository saves the merged data successfully
    When I call fetchMergedData
    Then the response should include totalCharacters greater than 0
    And the response should include an array of characters with weather data
    And the response should not contain an error

  Scenario: SWAPI API fetch fails
    Given the SWAPI API throws an error
    When I call fetchMergedData
    Then the response should have totalCharacters equal to 0
    And the response characters array should be empty
    And the response should contain an error message

  Scenario: Weather API fetch fails
    Given the SWAPI API returns character data
    And the weather API throws an error for any character
    When I call fetchMergedData
    Then the response should have totalCharacters equal to 0
    And the response characters array should be empty
    And the response should contain an error message
