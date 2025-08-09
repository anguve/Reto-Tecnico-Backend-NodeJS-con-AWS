Feature: MergedController getMergedData

  Scenario: Successfully fetch merged data
    Given the merged service returns valid data
    When I call getMergedData
    Then the response statusCode should be 200
    And the response body should contain a success message and data

  Scenario: Failed to fetch merged data
    Given the merged service throws an error
    When I call getMergedData
    Then the response statusCode should be 502
    And the response body should contain an error message