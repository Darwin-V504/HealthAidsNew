export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatTime = (timeString?: string): string => {
  // Si no hay timeString, intentar extraer la hora de appointmentDate
  if (!timeString) return 'Hora no especificada';
  
  // Si es una fecha ISO completa, extraer solo la hora
  if (timeString.includes('T')) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  // Si es solo hora (HH:MM)
  return timeString.substring(0, 5);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return '#FFA500';
    case 'completed': return '#4CAF50';
    case 'cancelled': return '#D32F2F';
    default: return '#666666';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pendiente';
    case 'completed': return 'Completada';
    case 'cancelled': return 'Cancelada';
    default: return status;
  }
};