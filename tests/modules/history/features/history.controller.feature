Feature: HistoryController getHistory

  Scenario: Successfully fetch history
    Given the history service returns valid data
    When I call getHistory with query parameters
    Then the response statusCode should be 200
    And the response body should contain a success message and data

  Scenario: Failed to fetch history
    Given the history service throws an error
    When I call getHistory with query parameters
    Then the response statusCode should be 502
    And the response body should contain an error message
