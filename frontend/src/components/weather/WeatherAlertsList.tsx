import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  Paper
} from '@mui/material';
import {
  Warning as WarningIcon,
  ErrorOutline as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { WeatherAlert } from '../../services/api/weatherService';
import { format } from 'date-fns';

interface WeatherAlertsListProps {
  alerts: WeatherAlert[];
}

const WeatherAlertsList: React.FC<WeatherAlertsListProps> = ({ alerts }) => {
  const theme = useTheme();

  const getSeverityColor = (severity: WeatherAlert['severity']): string => {
    switch (severity) {
      case 'high':
        return theme.palette.error.main;
      case 'medium':
        return theme.palette.warning.main;
      case 'low':
        return theme.palette.info.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const getSeverityIcon = (severity: WeatherAlert['severity']) => {
    switch (severity) {
      case 'high':
        return <ErrorIcon color="error" />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const formatTimeRange = (startTime: string, endTime: string): string => {
    return `${format(new Date(startTime), 'PPp')} - ${format(
      new Date(endTime),
      'PPp'
    )}`;
  };

  if (alerts.length === 0) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <WarningIcon sx={{ mr: 1 }} />
        Weather Alerts
      </Typography>

      <List>
        {alerts.map((alert, index) => (
          <ListItem
            key={`${alert.type}-${index}`}
            component={Paper}
            elevation={2}
            sx={{
              mb: 2,
              borderLeft: 6,
              borderColor: getSeverityColor(alert.severity),
              borderRadius: 1,
            }}
          >
            <ListItemIcon>{getSeverityIcon(alert.severity)}</ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" component="span">
                    {alert.type}
                  </Typography>
                  <Chip
                    label={alert.severity.toUpperCase()}
                    size="small"
                    sx={{
                      ml: 2,
                      backgroundColor: getSeverityColor(alert.severity),
                      color: 'white',
                    }}
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatTimeRange(alert.startTime, alert.endTime)}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      mt: 1,
                    }}
                  >
                    {alert.description}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default WeatherAlertsList;
