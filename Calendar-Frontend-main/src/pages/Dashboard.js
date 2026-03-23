import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Notifications as NotificationsIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [eventToConfirm, setEventToConfirm] = useState(null);
  const [promptedEventIds, setPromptedEventIds] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const now = new Date();
    const overdueEvent = events.find(
      (event) =>
        new Date(event.dueDate) <= now &&
        event.status !== 'Complete' &&
        event.status !== 'Over Due' &&
        !promptedEventIds.includes(event._id)
    );
    if (overdueEvent) {
      setEventToConfirm(overdueEvent);
      setConfirmDialogOpen(true);
      setPromptedEventIds((prev) => [...prev, overdueEvent._id]);
    }
  }, [events, promptedEventIds]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('https://calendar-backend-80yo.onrender.com/api/events');
      setEvents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://calendar-backend-80yo.onrender.com/api/events/${id}`);
      setEvents(events.filter(event => event._id !== id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleConfirmStatus = async (completed) => {
    if (!eventToConfirm) return;
    const newStatus = completed ? 'Complete' : 'Over Due';
    try {
      await axios.patch(
        `https://calendar-backend-80yo.onrender.com/api/events/${eventToConfirm._id}`,
        { status: newStatus }
      );
      await fetchEvents();
    } catch (error) {
      console.error('Error updating event status:', error);
    }
    setConfirmDialogOpen(false);
    setEventToConfirm(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Complete':
        return 'success';
      case 'Over Due':
        return 'error';
      default:
        return 'primary';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f7fa 100%)',
        py: { xs: 2, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 5,
            p: { xs: 2, md: 4 },
            boxShadow: 4,
            backdropFilter: 'blur(6px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: { xs: 'center', sm: 'space-between' },
              alignItems: { xs: 'center', sm: 'center' },
              mb: 3,
              gap: 2,
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
              <Typography
                variant="h4"
                sx={{
                  color: '#1976d2',
                  fontWeight: 800,
                  letterSpacing: 1,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2.125rem' },
                }}
              >
                Compliance Events
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Stay on top of your compliance tasks and deadlines.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/event/new')}
              size="large"
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                px: 3,
                py: 1.2,
                boxShadow: 3,
                background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)',
                },
                width: { xs: '100%', sm: 'auto' },
                mb: { xs: 1, sm: 0 },
                alignSelf: { xs: 'center', sm: 'auto' },
              }}
            >
              Create New Event
            </Button>
          </Box>
          <Divider sx={{ mb: 4 }} />

          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
            justifyContent="center"
          >
            {events.map((event) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={event._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Card
                  elevation={6}
                  sx={{
                    width: '100%',
                    maxWidth: 370,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.85)',
                    boxShadow: '0 8px 32px 0 rgba(25, 118, 210, 0.10)',
                    backdropFilter: 'blur(4px)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-6px) scale(1.03)',
                      boxShadow: '0 16px 40px 0 rgba(25, 118, 210, 0.18)',
                    },
                    m: { xs: 'auto', sm: 0 },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor:
                            event.status === 'Complete'
                              ? '#2e7d32'
                              : event.status === 'Over Due'
                              ? '#d32f2f'
                              : '#1976d2',
                          mr: 2,
                        }}
                      >
                        <EventIcon />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{
                            fontWeight: 700,
                            color: '#1976d2',
                            mb: 0.5,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {event.heading}
                        </Typography>
                        <Chip
                          label={event.status}
                          color={getStatusColor(event.status)}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            px: 1,
                            background:
                              event.status === 'Complete'
                                ? '#e0f7fa'
                                : event.status === 'Over Due'
                                ? '#ffebee'
                                : '#e3f2fd',
                            color:
                              event.status === 'Complete'
                                ? '#2e7d32'
                                : event.status === 'Over Due'
                                ? '#d32f2f'
                                : '#1976d2',
                          }}
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        minHeight: 40,
                        fontSize: '1rem',
                        fontWeight: 400,
                      }}
                    >
                      {event.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <EventIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        Due: {new Date(event.dueDate).toLocaleString()}
                      </Typography>
                    </Box>

                    {event.peopleInvolved.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {event.peopleInvolved.length} people involved
                        </Typography>
                      </Box>
                    )}

                    {event.reminders.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <NotificationsIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary">
                          {event.reminders.length} reminders set
                        </Typography>
                      </Box>
                    )}

                    {event.notes && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DescriptionIcon fontSize="small" color="action" />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {event.notes}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => navigate(`/event/${event._id}`)}
                        color="primary"
                        sx={{
                          bgcolor: '#e3f2fd',
                          '&:hover': { bgcolor: '#bbdefb' },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => {
                          setSelectedEvent(event);
                          setDeleteDialogOpen(true);
                        }}
                        color="error"
                        sx={{
                          bgcolor: '#ffebee',
                          '&:hover': { bgcolor: '#ffcdd2' },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the event "{selectedEvent?.heading}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={() => handleDelete(selectedEvent?._id)}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
          <DialogTitle>Event Completion</DialogTitle>
          <DialogContent>
            <Typography>
              Did you complete the event "{eventToConfirm?.heading}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleConfirmStatus(false)} color="error">
              No, mark as Over Due
            </Button>
            <Button onClick={() => handleConfirmStatus(true)} color="primary" variant="contained">
              Yes, mark as Complete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default Dashboard;