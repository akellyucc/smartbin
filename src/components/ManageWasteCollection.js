import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap'; // Using Bootstrap for styling
import '../styles/ManageWasteCollection.css'; // Add custom CSS styles for further styling
import { toast } from 'react-toastify'; // For notifications

const ManageWasteCollection = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    status: 'Scheduled', // Default status
  });

  // Mock data for waste collection tasks
  useEffect(() => {
    const fetchedTasks = [
      { id: 1, date: '2024-11-10', time: '08:00 AM', location: 'Portmore', status: 'Scheduled' },
      { id: 2, date: '2024-11-12', time: '10:00 AM', location: 'Kingston', status: 'Completed' },
      { id: 3, date: '2024-11-14', time: '02:00 PM', location: 'St. Andrew', status: 'Pending' },
    ];
    setTasks(fetchedTasks);
  }, []);

  const handleAddTask = () => {
    setShowModal(true);
    setFormData({ date: '', time: '', location: '', status: 'Scheduled' });
    setSelectedTask(null); // Reset selected task for new addition
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setFormData({ date: task.date, time: task.time, location: task.location, status: task.status });
    setShowModal(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTask) {
      // Update the selected task
      setTasks(tasks.map(task => task.id === selectedTask.id ? { ...task, ...formData } : task));
    } else {
      // Add new task
      setTasks([...tasks, { id: tasks.length + 1, ...formData }]);
                toast.success('Task added successfully!');

    }
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="manage-waste-collection-container">
      <h2 className="text-center mb-4">Manage Waste Collection</h2>
      <Button variant="primary" onClick={handleAddTask}>Add New Task</Button>
      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.date}</td>
              <td>{task.time}</td>
              <td>{task.location}</td>
              <td>{task.status}</td>
              <td>
                <Button variant="info" onClick={() => handleEditTask(task)} className="mr-2">Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteTask(task.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal for Add/Edit Task */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTask ? 'Edit Task' : 'Add New Task'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="taskDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="taskTime">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="taskLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="taskStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-3">
              {selectedTask ? 'Save Changes' : 'Add Task'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ManageWasteCollection;
