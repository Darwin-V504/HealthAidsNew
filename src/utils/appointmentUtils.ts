import { Appointment } from '../infoutils/types';

export const sortAppointmentsByDate = (appointments: Appointment[], ascending: boolean = true): Appointment[] => {
  return [...appointments].sort((a, b) => {
    // Validar que ambas fechas existen
    if (!a.appointmentDate) return 1;
    if (!b.appointmentDate) return -1;
    
    const dateA = new Date(a.appointmentDate).getTime();
    const dateB = new Date(b.appointmentDate).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const filterUpcomingAppointments = (appointments: Appointment[]): Appointment[] => {
  const now = new Date();
  return appointments.filter(a => {
    // Validar que la fecha existe y el estado es 'pending'
    if (!a.appointmentDate) return false;
    return a.status === 'pending' && new Date(a.appointmentDate) >= now;
  });
};

export const filterPastAppointments = (appointments: Appointment[]): Appointment[] => {
  const now = new Date();
  return appointments.filter(a => {
    // Validar que la fecha existe
    if (!a.appointmentDate) return true; 
    
    const isPending = a.status === 'pending';
    const isPast = new Date(a.appointmentDate) < now;
    
    return !isPending || isPast;
  });
};