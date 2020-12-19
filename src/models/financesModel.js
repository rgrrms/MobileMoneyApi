export default (mongoose) => {
  const schema = mongoose.Schema({
    description: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    valueInNumber: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    month: {
      type: String,
      required: true
    },
    day: {
      type: String,
      required: true
    },
    yearMonth: {
      type: String,
      required: true
    },
    yearMonthDay: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    cpfUser: {
      type: String,
      required: true
    }
  });

  const finances = mongoose.model('finances', schema, 'finances');
  return finances;
};
