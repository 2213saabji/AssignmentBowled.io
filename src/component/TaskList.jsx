import { useState } from 'react';
import { Container, Paper, Typography, Card, CardContent, Grid, Button } from '@mui/material';
import { useTasks } from '../context/TaskContext';
import UpdateTask from './UpdateTaskForm';

const TaskList = () => {
  const { tasks, deleteTask, updateTask } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const handleOpenUpdateModal = (task) => {
    setSelectedTask(task);
    setIsUpdateModalOpen(true);
  };

  const handleCloseUpdateModal = () => {
    setSelectedTask(null);
    setIsUpdateModalOpen(false);
  };

  return (
    <Container>
        <Grid container spacing={2}>
            {['to-do', 'in progress', 'done'].map((status) => (
                <Grid item xs={12} sm={4} key={status}>
                    <Paper
                        elevation={3}
                        sx={{ p: 2, height: 'calc(100vh - 80px)', overflowY: 'auto' }}
                    >
                        <Typography variant="h6" gutterBottom>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Typography>
                        {tasks[status]?.map((task) => (
                            <Paper
                                key={task.id}
                                elevation={3}
                                sx={{ mb: 2, p: 2 }}
                            >
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">{task.title}</Typography>
                                        <Typography variant="body2">{task.description}</Typography>
                                        <Typography variant="body2">Due Date: {task.dueDate}</Typography>
                                        <Typography variant="body2">Status: {task.status}</Typography>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => deleteTask(task.id)} // Handle delete task logic
                                            sx={{ mt: 1 }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleOpenUpdateModal(task)} // Handle update task logic
                                            sx={{ mt: 1, ml: 1 }}
                                        >
                                            Update
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Paper>
                        ))}
                    </Paper>
                </Grid>
            ))}
        </Grid>
        <UpdateTask
          open={isUpdateModalOpen}
          onClose={handleCloseUpdateModal}
          task={selectedTask}
          onSave={(updatedTask) => {
            updateTask(updatedTask);
            handleCloseUpdateModal();
          }}
        />
    </Container>
  );
};

export default TaskList;
