export const recordsSchema = {
  properties: {
    date: {
      type: 'integer'
    },
    distance: {
      type: 'integer'
    },
    time: {
      type: 'integer'
    }
  },
  required: [
    'date',
    'distance',
    'time'
  ]
};