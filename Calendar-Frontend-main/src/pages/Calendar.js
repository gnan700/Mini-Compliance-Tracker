import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import {
  Container,
  Paper,
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Chip,
  Fab,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './CalendarCustom.css';

const locales = {
  ' // <-- Add this line for custom CSSen-US': require('date-fns/locale/en-US'),
};


const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function Calendar() {
  const navigate = useNavigate();
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date()); // <-- Add this line
  const [events, setEvents] = useState([]);
  const [hoveredEvent, setHoveredEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'https://calendar-backend-80yo.onrender.com'}/api/events`
      );
      const formattedEvents = response.data.map(event => ({
        id: event._id,
        title: event.heading,
        start: new Date(event.dueDate),
        end: new Date(event.dueDate),
        status: event.status,
        description: event.description,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleNavigate = (newDate) => {
    setDate(newDate);
  };

  const handleSelectEvent = (event) => {
    navigate(`/event/${event.id}`);
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#1976d2';
    if (event.status === 'Complete') {
      backgroundColor = '#2e7d32'; 
    } else if (event.status === 'Over Due') {
      backgroundColor = '#d32f2f'; 
    }
    return {
      style: {
        backgroundColor,
        borderRadius: '8px',
        opacity: 0.95,
        color: 'white',
        border: '0px',
        display: 'block',
        fontWeight: 500,
        fontSize: '1rem',
        padding: '6px 10px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)',
        transition: 'box-shadow 0.2s',
      },
    };
  };


  const CustomEvent = ({ event }) => (
    <Tooltip
      title={
        <Box sx={{ p: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
            {event.title}
          </Typography>
          <Chip
            label={event.status}
            size="small"
            sx={{
              backgroundColor:
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
              mb: 0.5,
              fontWeight: 500,
            }}
          />
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {event.description}
          </Typography>
        </Box>
      }
      arrow
      placement="top"
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.7,
          fontWeight: 500,
          fontSize: '0.82rem',
          px: 1.3,
          py: 0.32,
          borderRadius: '999px',
          background:
            event.status === 'Complete'
              ? 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)'
              : event.status === 'Over Due'
              ? 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)'
              : 'linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%)',
          border: '1.5px solid rgba(255,255,255,0.4)',
          boxShadow: '0 4px 18px 0 rgba(30, 136, 229, 0.13), 0 1.5px 8px 0 rgba(0,0,0,0.07)',
          minHeight: 30,
          color:
            event.status === 'Complete'
              ? '#065c36'
              : event.status === 'Over Due'
              ? '#7a1c00'
              : '#0d3057',
          cursor: 'pointer',
          backdropFilter: 'blur(2px)',
          transition: 'box-shadow 0.2s, border 0.2s, background 0.2s',
          '&:hover': {
            background:
              event.status === 'Complete'
                ? 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)'
                : event.status === 'Over Due'
                ? 'linear-gradient(90deg, #ff512f 0%, #dd2476 100%)'
                : 'linear-gradient(90deg, #4776e6 0%, #8e54e9 100%)',
            border: '2px solid #fff',
            boxShadow: '0 6px 24px 0 rgba(30, 136, 229, 0.18), 0 2px 12px 0 rgba(0,0,0,0.10)',
          },
        }}
      >
        <Box
          sx={{
            width: 13,
            height: 13,
            borderRadius: '50%',
            background:
              event.status === 'Complete'
                ? '#2ecc71'
                : event.status === 'Over Due'
                ? '#ff1744'
                : '#2979ff',
            border: '2.5px solid #fff',
            boxShadow: '0 0 4px 1px rgba(0,0,0,0.10)',
            mr: 1,
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        />
        <span style={{
          fontWeight: 500,
          fontSize: '0.76rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          letterSpacing: 0.1,
        }}>
          {event.title}
        </span>
      </Box>
    </Tooltip>
  );


  const CustomAgendaEvent = ({ event }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {event.title}
          </Typography>
          <Chip
            label={event.status}
            size="small"
            sx={{
              backgroundColor:
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
              fontWeight: 500,
              border: 'none',
            }}
          />
        </Box>
        {event.description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {event.description}
          </Typography>
        )}
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl">
      <Paper
        elevation={1}
        sx={{
          p: { xs: 1, sm: 3 },
          mt: 4,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
          borderRadius: 2,
          boxShadow: 1,
          minHeight: '80vh',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="calendar view"
            size="small"
          >
            <ToggleButton value="day" aria-label="day view">
              Day
            </ToggleButton>
            <ToggleButton value="week" aria-label="week view">
              Week
            </ToggleButton>
            <ToggleButton value="month" aria-label="month view">
              Month
            </ToggleButton>
          </ToggleButtonGroup>
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => navigate('/event/new')}
            sx={{ boxShadow: 2 }}
            size="medium"
          >
            <AddIcon />
          </Fab>
        </Box>
        <Box
          sx={{
            height: { xs: '60vh', sm: '70vh', md: '75vh' },
            background: 'rgba(255,255,255,0.7)',
            borderRadius: 3,
            p: 1,
          }}
        >
          {events.length === 0 ? (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No events to display.
              </Typography>
            </Box>
          ) : (
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              date={date} 
              onView={setView}
              onNavigate={handleNavigate} 
              onSelectEvent={handleSelectEvent}
              eventPropGetter={eventStyleGetter}
              components={{
                event: CustomEvent,
                agenda: {
                  event: CustomAgendaEvent,
                },
              }}
              style={{ height: '100%' }}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}

export default Calendar;