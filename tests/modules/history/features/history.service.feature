Feature: HistoryService fetchHistory

  Scenario: Successfully fetch history data from repository
    Given the repository returns valid data
    When I call fetchHistory with limit 5, lastKey and ascending order
    Then the service should return the data from repository

  Scenario: Repository throws an error
    Given the repository throws an error
    When I call fetchHistory
    Then the service should propagate the error
