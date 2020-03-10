const registerConstraints = {
  username: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  email: {
    presence: {
      message: 'cannot be blank.',
    },
    email: {
      message: 'not valid.',
    },
  },
  full_name: {
    presence: 'cannot be blank.',
  },
  password: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 5,
      message: 'must be at least 5 characters',
    },
  },
  confirmPassword: {
    presence: 'cannot be blank.',
    equality: {
      attribute: 'password',
    },
  },
};

const uploadConstraints = {
  title: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  description: {
  },
  location: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  price: {
    presence: {
      message: 'cannot be blank',
    },
    format: {
      pattern: '^\\d+$',
      message: 'must be a number',
    }
  }
};

export {registerConstraints, uploadConstraints};
