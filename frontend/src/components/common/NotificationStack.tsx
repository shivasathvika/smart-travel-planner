import React, { useEffect, useState } from 'react';
import { Alert, AlertTitle, Snackbar, Stack } from '@mui/material';
import { Notification } from '../../services/notifications/notificationService';
import notificationService from '../../services/notifications/notificationService';

const NotificationStack: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const subscription = notificationService.getNotifications().subscribe((notification) => {
      setNotifications((prev) => [...prev, notification]);

      // Auto remove notification after duration (if specified)
      if (notification.duration) {
        setTimeout(() => {
          handleClose(notification.id);
        }, notification.duration);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Stack spacing={2} sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000 }}>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => handleClose(notification.id)}
            severity={notification.type}
            sx={{ width: '100%' }}
            action={
              notification.action && (
                <button onClick={notification.action.onClick}>
                  {notification.action.label}
                </button>
              )
            }
          >
            {notification.title && <AlertTitle>{notification.title}</AlertTitle>}
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default NotificationStack;
