import * as React from 'react';
import { ViewState, EditingState, ChangeSet } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,Appointments, MonthView, Toolbar,
  DateNavigator, ViewSwitcher, TodayButton, Resources, AppointmentTooltip, WeekView, EditRecurrenceMenu, AppointmentForm
} from '@devexpress/dx-react-scheduler-material-ui';
import { withStyles, Theme, createStyles} from '@material-ui/core';
import { indigo, blue, teal } from '@material-ui/core/colors';
import Paper from '@material-ui/core/Paper';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { WithStyles } from '@material-ui/styles';
import classNames from 'clsx';
import {resources} from "../db/resources";
import resService,{ReservationsAttributes} from '../services/reservations'



const styles = (theme: Theme) => createStyles({
  appointment: {
    borderRadius: 0,
    borderBottom: 0,
  },
  highPriorityAppointment: {
    borderLeft: `4px solid ${teal[500]}`,
  },
  mediumPriorityAppointment: {
    borderLeft: `4px solid ${blue[500]}`,
  },
  lowPriorityAppointment: {
    borderLeft: `4px solid ${indigo[500]}`,
  },
  weekEndCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    '&:hover': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
    '&:focus': {
      backgroundColor: fade(theme.palette.action.disabledBackground, 0.04),
    },
  },
  weekEndDayScaleCell: {
    backgroundColor: fade(theme.palette.action.disabledBackground, 0.06),
  },
  text: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  content: {
    opacity: 0.7,
  },
  container: {
    width: '100%',
    lineHeight: 1.2,
    height: '100%',
  },
  
});

type AppointmentProps = Appointments.AppointmentProps & WithStyles<typeof styles>;
type AppointmentContentProps = Appointments.AppointmentContentProps & WithStyles<typeof styles>;
type TimeTableCellProps = MonthView.TimeTableCellProps & WithStyles<typeof styles>;
type DayScaleCellProps = MonthView.DayScaleCellProps & WithStyles<typeof styles>;

const isWeekEnd = (date: Date): boolean => date.getDay() === 0 || date.getDay() === 6;
const defaultCurrentDate = new Date(2018, 6, 2, 11, 15);

const DayScaleCell = withStyles(styles)(({
  startDate, classes, ...restProps
}: DayScaleCellProps) => (
  <MonthView.DayScaleCell
    className={classNames({
      [classes.weekEndDayScaleCell]: isWeekEnd(startDate),
    })}
    startDate={startDate}
    {...restProps}
  />
));

const TimeTableCell = withStyles(styles)((
  { startDate, classes, ...restProps }: TimeTableCellProps,
) => (
  <MonthView.TimeTableCell
    className={classNames({
      [classes.weekEndCell]: isWeekEnd(startDate!),
    })}
    startDate={startDate}
    {...restProps}
  />
));

const Appointment = withStyles(styles)(({
  classes, data, ...restProps
}: AppointmentProps) => (
  <Appointments.Appointment
    {...restProps}
    className={classNames({
      [classes.highPriorityAppointment]: data.priority === 1,
      [classes.mediumPriorityAppointment]: data.priority === 2,
      [classes.lowPriorityAppointment]: data.priority === 3,
      [classes.appointment]: true,
    })}
    data={data}
  />
));

// #FOLD_BLOCK
const AppointmentContent = withStyles(styles, { name: 'AppointmentContent' })(({
  classes, data, ...restProps
  // #FOLD_BLOCK
}: AppointmentContentProps) =>  {
  return (
    <Appointments.AppointmentContent {...restProps} data={data}>
      <div className={classes.container}>
        <div className={classes.text}>
          {data.title}
        </div>
        <div className={classNames(classes.text, classes.content)}>
          {`Location: ${data.location}`}
        </div>
      </div>
    </Appointments.AppointmentContent>
  );
});

 const Reservation:React.FC = () => {
  const [data, setData] = React.useState<ReservationsAttributes[]>([]);
  const [editingAppointment, setEditingAppointment] = React.useState();
  const [addedAppointment, setAddedAppointment] = React.useState({});
  const [appointmentChanges, setAppointmentChanges] = React.useState({})  

  React.useEffect(()=>{
    resService.getAll().then(res=> {
      setData(res)});
  },[])

  const onAddedAppointmentChange = (addedAppointment:any)=> {
    setAddedAppointment(addedAppointment)
  }
  const onEditingAppointmentChange = (editingAppointment:any) =>{
    setEditingAppointment(editingAppointment);
  }
  const changeAppointmentChanges = (appointmentChanges:any) =>{
    setAppointmentChanges(appointmentChanges)
  }

  const commitChanges = (props:ChangeSet) =>{
    const {added, changed, deleted} = props
      if (added) {
        const {allDay,...newAp} = added; 
        resService.create(newAp as ReservationsAttributes).then(res =>{
          setData(data.concat(res))
        });
      }
      if (changed) {
        setData(data.map(appointment => {
          if (appointment.id && changed[appointment.id]){
            const changedApp = { ...appointment, ...changed[appointment.id] }
            resService.update(appointment.id,changedApp)
            return changedApp
          }
          return appointment
        }));
      }
      if (deleted !== undefined) {
        resService.delete(Number(deleted))
        setData(data.filter(appointment => appointment.id !== deleted));
      }
  }

  const booleanEditorComponent  = () => {
    return null
    };


   return (
  <Paper>
    <Scheduler
      data={data}
    >
      <ViewState
        defaultCurrentDate={defaultCurrentDate}
      />
      <EditingState
            onCommitChanges={commitChanges}

            addedAppointment={addedAppointment}
            onAddedAppointmentChange={onAddedAppointmentChange}

            editingAppointment={editingAppointment}
            onEditingAppointmentChange={onEditingAppointmentChange}
            
            appointmentChanges={appointmentChanges}
            onAppointmentChangesChange={changeAppointmentChanges}
          />

      <MonthView
        dayScaleCellComponent={DayScaleCell}
        timeTableCellComponent={TimeTableCell}
      />
      <WeekView
        startDayHour={9}
        endDayHour={19}
      />
      <EditRecurrenceMenu />
      {/* <ConfirmationDialog /> */}
      <Appointments
        appointmentComponent={Appointment}
        appointmentContentComponent={AppointmentContent}
        
      />
      <Resources
        data={resources}
      />

      <AppointmentTooltip
        showOpenButton
        showCloseButton
        showDeleteButton
      />
      <Toolbar />
      <DateNavigator />
      <ViewSwitcher />
      <TodayButton />
      <AppointmentForm 
      booleanEditorComponent={booleanEditorComponent}
      />
    </Scheduler>
  </Paper>
)};

export default Reservation;