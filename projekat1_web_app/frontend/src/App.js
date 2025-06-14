import React, { useState, useEffect } from 'react';

import GoalInput from './components/goals/GoalInput';
import CourseGoals from './components/goals/CourseGoals';
import ErrorAlert from './components/UI/ErrorAlert';

function App() {
  const [loadedGoals, setLoadedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API_URL koristi .env varijablu ili default '/api'
  const API_URL = process.env.REACT_APP_API_URL || '/api';

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);

      try {
        const response = await fetch(`${API_URL}/goals`);
        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message || 'Fetching the goals failed.');
        }

        setLoadedGoals(resData.goals);
      } catch (err) {
        setError(
          err.message ||
            'Fetching goals failed - the server responded with an error.'
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [API_URL]);

  async function addGoalHandler(goalText) {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        body: JSON.stringify({ text: goalText }),
        headers: { 'Content-Type': 'application/json' },
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Adding the goal failed.');
      }

      setLoadedGoals((prevGoals) => [
        { id: resData.goal.id, text: goalText },
        ...prevGoals,
      ]);
    } catch (err) {
      setError(
        err.message ||
          'Adding a goal failed - the server responded with an error.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteGoalHandler(goalId) {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/goals/${goalId}`, {
        method: 'DELETE',
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.message || 'Deleting the goal failed.');
      }

      setLoadedGoals((prevGoals) =>
        prevGoals.filter((goal) => goal.id !== goalId)
      );
    } catch (err) {
      setError(
        err.message ||
          'Deleting the goal failed - the server responded with an error.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      {error && <ErrorAlert errorText={error} />}
      <GoalInput onAddGoal={addGoalHandler} />
      {isLoading && <p>Učitavanje...</p>}
      {!isLoading && (
        <CourseGoals goals={loadedGoals} onDeleteGoal={deleteGoalHandler} />
      )}
    </div>
  );
}

export default App;
