// src/TaskContext.js
import PropTypes from 'prop-types';
import { createContext, useState, useContext } from 'react';
import { useAuth } from '../AuthContext';

// Create TaskContext
const TaskContext = createContext();

// Custom hook to use TaskContext
export const useTasks = () => useContext(TaskContext);

// TaskProvider component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState({});
  const { user } = useAuth();

  const addTask = (newTask) => {
    const statusKey = newTask.status.toLowerCase();
    setTasks((prevTasks) => ({
      ...prevTasks,
      [statusKey]: [...(prevTasks[statusKey] || []), newTask]
    }));

    let taskdata = JSON.parse(localStorage.getItem('taskdata')) || [];
    const userIndex = taskdata.findIndex(item => item.user === user.email);

    if (userIndex !== -1) {

      const userData = taskdata[userIndex].data;
      if (!userData[statusKey]) {
        userData[statusKey] = [];
      }
      userData[statusKey].push(newTask);
      taskdata[userIndex].data = userData;
    } else {
      taskdata.push({ user: user.email, data: { [statusKey]: [newTask] } });
    }

    localStorage.setItem('taskdata', JSON.stringify(taskdata));

  };

  const updateTask = (updatedTask) => {
    const statusKey = updatedTask.status.toLowerCase();
  
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
  
      // Ensure the newTasks[statusKey] is an array
      if (!Array.isArray(newTasks[statusKey])) {
        newTasks[statusKey] = [];
      }
  
      // Remove the task from its previous status
      for (const status in newTasks) {
        if (Array.isArray(newTasks[status])) {
          newTasks[status] = newTasks[status].filter(task => task.id !== updatedTask.id);
        }
      }
  
      // Add the updated task to the new status
      newTasks[statusKey].push(updatedTask);
  
      // Update task status in localStorage
      let taskdata = JSON.parse(localStorage.getItem("taskdata")) || [];
      const userEmail = user?.email;
      const userIndex = taskdata.findIndex(item => item.user === userEmail);
  
      if (userIndex !== -1) {
        // Remove the task from its previous status in localStorage
        const userData = taskdata[userIndex];
        const updatedData = { ...userData.data };
  
        for (const status in updatedData) {
          if (Array.isArray(updatedData[status])) {
            updatedData[status] = updatedData[status].filter(task => task.id !== updatedTask.id);
          }
        }
  
        // Add the updated task to the new status in localStorage
        if (!Array.isArray(updatedData[statusKey])) {
          updatedData[statusKey] = [];
        }
  
        updatedData[statusKey].push(updatedTask);
  
        // Replace the user's task data in localStorage
        taskdata[userIndex] = { ...userData, data: updatedData };
        localStorage.setItem("taskdata", JSON.stringify(taskdata));
      }
  
      return newTasks;
    });
  };
  

  const deleteTask = (taskId) => {
    setTasks((prevTasks) => {
      const newTasks = {};
      for (const status in prevTasks) {
        newTasks[status] = prevTasks[status].filter(task => task.id !== taskId);
      }

      let taskdata = JSON.parse(localStorage.getItem("taskdata")) || [];
      const userEmail = user?.email;

      const userIndex = taskdata.findIndex(item => item.user === userEmail);
      if (userIndex !== -1) {
        taskdata[userIndex].data = newTasks;
        localStorage.setItem("taskdata", JSON.stringify(taskdata));
      }
      return newTasks;
    });
  };

  return (
    <TaskContext.Provider value={{ tasks, setTasks, addTask, updateTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
TaskProvider.propTypes = {
  children: PropTypes.node.isRequired,
};