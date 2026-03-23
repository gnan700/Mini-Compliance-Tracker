import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Avatar,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DescriptionIcon from '@mui/icons-material/Description';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';

function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [event, setEvent] = useState({
    heading: '',
    description: '',
    dueDate: new Date(),
    peopleInvolved: [],
    reminders: [],
    notes: '',
    status: 'In Progress',
  });

  const [newEmail, setNewEmail] = useState('');
  const [newReminder, setNewReminder] = useState(new Date());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showPeople, setShowPeople] = useState(true);
  const [showReminders, setShowReminders] = useState(true);
  const [showNotes, setShowNotes] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', value: null });

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
    // eslint-disable-next-line
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'https://calendar-backend-80yo.onrender.com'}/api/events/${id}`);
      const eventData = response.data;
      setEvent({
        ...eventData,
        dueDate: new Date(eventData.dueDate),
        reminders: eventData.reminders.map(reminder => ({
          ...reminder,
          time: new Date(reminder.time)
        }))
      });
      setLoading(false);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error fetching event.', severity: 'error' });
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event.heading.trim() || !event.description.trim()) {
      setSnackbar({ open: true, message: 'Heading and Description are required.', severity: 'warning' });
      return;
    }
    try {
      if (id) {
        await axios.put(`${process.env.REACT_APP_API_URL || 'https://calendar-backend-80yo.onrender.com'}/api/events/${id}`, event);
        setSnackbar({ open: true, message: 'Event updated successfully!', severity: 'success' });
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL || 'https://calendar-backend-80yo.onrender.com'}/api/events`, event);
        setSnackbar({ open: true, message: 'Event created successfully!', severity: 'success' });
      }
      setTimeout(() => navigate('/'), 1200);
    } catch (error) {
      setSnackbar({ open: true, message: 'Error saving event.', severity: 'error' });
    }
  };

  const handleAddPerson = () => {
    if (!newEmail.trim()) {
      setSnackbar({ open: true, message: 'Please enter an email.', severity: 'warning' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setSnackbar({ open: true, message: 'Invalid email format.', severity: 'warning' });
      return;
    }
    if (event.peopleInvolved.includes(newEmail)) {
      setSnackbar({ open: true, message: 'Email already added.', severity: 'info' });
      return;
    }
    setEvent({
      ...event,
      peopleInvolved: [...event.peopleInvolved, newEmail],
    });
    setNewEmail('');
    setSnackbar({ open: true, message: 'Person added!', severity: 'success' });
  };

  const handleAddReminder = () => {
    if (!newReminder || isNaN(newReminder.getTime())) {
      setSnackbar({ open: true, message: 'Please select a valid reminder time.', severity: 'warning' });
      return;
    }
    if (event.reminders.some(r => new Date(r.time).getTime() === newReminder.getTime())) {
      setSnackbar({ open: true, message: 'Reminder already exists for this time.', severity: 'info' });
      return;
    }
    setEvent({
      ...event,
      reminders: [...event.reminders, { time: newReminder, sent: false }],
    });
    setNewReminder(new Date());
    setSnackbar({ open: true, message: 'Reminder added!', severity: 'success' });
  };

  const handleRemovePerson = (email) => {
    setDeleteDialog({ open: true, type: 'person', value: email });
  };

  const handleRemoveReminder = (index) => {
    setDeleteDialog({ open: true, type: 'reminder', value: index });
  };

  const confirmDelete = () => {
    if (deleteDialog.type === 'person') {
      setEvent({
        ...event,
        peopleInvolved: event.peopleInvolved.filter((e) => e !== deleteDialog.value),
      });
      setSnackbar({ open: true, message: 'Person removed.', severity: 'info' });
    } else if (deleteDialog.type === 'reminder') {
      setEvent({
        ...event,
        reminders: event.reminders.filter((_, i) => i !== deleteDialog.value),
      });
      setSnackbar({ open: true, message: 'Reminder removed.', severity: 'info' });
    }
    setDeleteDialog({ open: false, type: '', value: null });
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 2 }}
          variant="outlined"
        >
          Back to Dashboard
        </Button>
        <Paper
          elevation={4}
          sx={{
            p: { xs: 2, sm: 4 },
            background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
            borderRadius: 3,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: '#1976d2',
              fontWeight: 700,
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {id ? 'Edit Event' : 'Create New Event'}
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Card elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                      Basic Information
                    </Typography>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Heading"
                          value={event.heading}
                          onChange={(e) => setEvent({ ...event, heading: e.target.value })}
                          required
                          variant="outlined"
                          inputProps={{ maxLength: 100 }}
                          helperText={`${event.heading.length}/100`}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          //rows={4}
                          label="Description"
                          value={event.description}
                          onChange={(e) => setEvent({ ...event, description: e.target.value })}
                          required
                          variant="outlined"
                          inputProps={{ maxLength: 500 }}
                          helperText={`${event.description.length}/500`}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* Schedule and Status */}
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                      Schedule
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DateTimePicker
                        label="Due Date"
                        value={event.dueDate}
                        onChange={(newValue) => setEvent({ ...event, dueDate: newValue })}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            required: true,
                            variant: 'outlined'
                          }
                        }}
                        minDateTime={new Date()}
                      />
                    </LocalizationProvider>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                      Status
                    </Typography>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={event.status}
                        onChange={(e) => setEvent({ ...event, status: e.target.value })}
                        label="Status"
                      >
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Complete">Complete</MenuItem>
                        <MenuItem value="Over Due">Over Due</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
              </Grid>

              {/* People Involved and Reminders side by side on md+, stacked on xs */}
              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon /> People Involved
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setShowPeople((prev) => !prev)}
                        sx={{ ml: 1 }}
                      >
                        {showPeople ? 'Hide' : 'Show'}
                      </Button>
                    </Box>
                    <Collapse in={showPeople}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={8}>
                          <TextField
                            label="Email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            type="email"
                            variant="outlined"
                            fullWidth
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddPerson(); } }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Tooltip title="Add Person">
                            <span>
                              <Button
                                variant="contained"
                                onClick={handleAddPerson}
                                startIcon={<AddIcon />}
                                disabled={!newEmail}
                                fullWidth
                                sx={{ height: '56px' }}
                              >
                                Add
                              </Button>
                            </span>
                          </Tooltip>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {event.peopleInvolved.map((email) => (
                          <Chip
                            key={email}
                            avatar={<Avatar sx={{ bgcolor: '#1976d2' }}><PersonIcon fontSize="small" /></Avatar>}
                            label={email}
                            onDelete={() => handleRemovePerson(email)}
                            color="primary"
                            variant="outlined"
                            sx={{ fontWeight: 500 }}
                            deleteIcon={
                              <Tooltip title="Remove Person">
                                <DeleteIcon />
                              </Tooltip>
                            }
                          />
                        ))}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationsIcon /> Reminders
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setShowReminders((prev) => !prev)}
                        sx={{ ml: 1 }}
                      >
                        {showReminders ? 'Hide' : 'Show'}
                      </Button>
                    </Box>
                    <Collapse in={showReminders}>
                      <Grid container spacing={1} alignItems="center">
                        <Grid item xs={8}>
                          <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                              label="Reminder Time"
                              value={newReminder}
                              onChange={setNewReminder}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  variant: 'outlined'
                                }
                              }}
                              minDateTime={new Date()}
                            />
                          </LocalizationProvider>
                        </Grid>
                        <Grid item xs={4}>
                          <Tooltip title="Add Reminder">
                            <span>
                              <Button
                                variant="contained"
                                onClick={handleAddReminder}
                                startIcon={<AddIcon />}
                                fullWidth
                                sx={{ height: '56px' }}
                              >
                                Add
                              </Button>
                            </span>
                          </Tooltip>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                        {event.reminders.map((reminder, index) => (
                          <Chip
                            key={index}
                            label={new Date(reminder.time).toLocaleString()}
                            onDelete={() => handleRemoveReminder(index)}
                            color="secondary"
                            variant="outlined"
                            deleteIcon={
                              <Tooltip title="Remove Reminder">
                                <DeleteIcon />
                              </Tooltip>
                            }
                          />
                        ))}
                      </Box>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>

              {/* Notes Section */}
              <Grid item xs={12}>
                <Card elevation={0} sx={{ bgcolor: 'transparent' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Typography variant="h6" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon /> Notes
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setShowNotes((prev) => !prev)}
                        sx={{ ml: 1 }}
                      >
                        {showNotes ? 'Hide' : 'Show'}
                      </Button>
                    </Box>
                    <Collapse in={showNotes}>
                      <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Notes"
                        value={event.notes}
                        onChange={(e) => setEvent({ ...event, notes: e.target.value })}
                        variant="outlined"
                        inputProps={{ maxLength: 500 }}
                        helperText={`${event.notes.length}/500`}
                      />
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/')}
                    size="large"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    size="large"
                    sx={{
                      background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)',
                      color: '#fff',
                      fontWeight: 600,
                      boxShadow: 2,
                      '&:hover': {
                        background: 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)'
                      }
                    }}
                  >
                    {id ? 'Update Event' : 'Create Event'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={2000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, type: '', value: null })}
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this {deleteDialog.type === 'person' ? 'person' : 'reminder'}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, type: '', value: null })}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default EventForm;