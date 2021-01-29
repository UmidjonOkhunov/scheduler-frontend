import { indigo, blue, teal } from '@material-ui/core/colors';

export const resources = [{
    fieldName: 'location',
    title: 'Location',
    instances: [
      { id: 'Room 1', text: 'Room 1', color: indigo },
      { id: 'Room 2', text: 'Room 2', color: blue },
      { id: 'Room 3', text: 'Room 3', color: teal },
    ],
  }, {
    fieldName: 'priority',
    title: 'Priority',
    instances: [
      { id: 1, text: 'High Priority', color: teal },
      { id: 2, text: 'Medium Priority', color: blue },
      { id: 3, text: 'Low Priority', color: indigo },
    ],
  }];