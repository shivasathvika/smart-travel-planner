import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Alert,
  AlertTitle,
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  NotificationsActive as NotificationsActiveIcon,
  ExpandMore as ExpandMoreIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { WeatherAlert } from '../../services/api/weatherAlertApi';
import { format } from 'date-fns';

interface WeatherAlertsProps {
  alerts: WeatherAlert[];
  onDismiss?: (alertId: string) => void;
  onSubscribe?: () => void;
}

const getSeverityIcon = (severity: WeatherAlert['severity']) => {
  switch (severity) {
    case 'extreme':
    case 'severe':
      return <ErrorIcon color="error" />;
    case 'moderate':
      return <WarningIcon color="warning" />;
    case 'minor':
      return <InfoIcon color="info" />;
    default:
      return <InfoIcon />;
  }
};

const getSeverityColor = (severity: WeatherAlert['severity']) => {
  switch (severity) {
    case 'extreme':
    case 'severe':
      return 'error';
    case 'moderate':
      return 'warning';
    case 'minor':
      return 'info';
    default:
      return 'default';
  }
};

const WeatherAlertItem: React.FC<{
  alert: WeatherAlert;
  onDismiss?: (alertId: string) => void;
}> = ({ alert, onDismiss }) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Alert
      severity={getSeverityColor(alert.severity) as any}
      icon={getSeverityIcon(alert.severity)}
      action={
        <Box display="flex" alignItems="center">
          <IconButton
            aria-label="expand"
            size="small"
            onClick={() => setExpanded(!expanded)}
          >
            <ExpandMoreIcon
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
            />
          </IconButton>
          {onDismiss && (
            <IconButton
              aria-label="dismiss"
              size="small"
              onClick={() => onDismiss(alert.id)}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      }
      sx={{ mb: 1 }}
    >
      <AlertTitle>{alert.title}</AlertTitle>
      <Box display="flex" flexDirection="column" gap={1}>
        <Typography variant="body2" component="div">
          {expanded ? alert.description : `${alert.description.slice(0, 100)}...`}
        </Typography>
        <Collapse in={expanded}>
          <Box mt={1}>
            <Typography variant="body2" color="text.secondary">
              Valid from:{' '}
              {format(new Date(alert.startTime), 'MMM d, yyyy h:mm a')} to{' '}
              {format(new Date(alert.endTime), 'MMM d, yyyy h:mm a')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Areas affected: {alert.areas.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Source: {alert.source}
            </Typography>
          </Box>
        </Collapse>
      </Box>
    </Alert>
  );
};

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({
  alerts,
  onDismiss,
  onSubscribe,
}) => {
  if (!alerts.length) {
    return null;
  }

  return (
    <Paper elevation={0} sx={{ p: 2, bgcolor: 'transparent' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h6" component="div">
          Weather Alerts
        </Typography>
        {onSubscribe && (
          <IconButton
            color="primary"
            onClick={onSubscribe}
            title="Subscribe to alerts"
          >
            <NotificationsActiveIcon />
          </IconButton>
        )}
      </Box>
      <Box display="flex" flexDirection="column">
        {alerts.map((alert) => (
          <WeatherAlertItem
            key={alert.id}
            alert={alert}
            onDismiss={onDismiss}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default WeatherAlerts;
