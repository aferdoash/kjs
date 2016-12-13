export const ARCHITECTURE_DIAGRAM = [

  // /////////////////////////////////////////////////////////////////////
  // initial

  {
    name: 'input_encoder',
    className: 'Embedding',
    details: 'Vocabulary size, Story max length -> 64',
    row: 0,
    col: 0
  },
  {
    name: 'dropout_input',
    className: 'Dropout',
    details: 'p=0.3',
    row: 1,
    col: 0
  },
  {
    name: 'query_encoder',
    className: 'Embedding',
    details: 'Vocabulary size, Question max length -> 64',
    row: 0,
    col: 2
  },
  {
    name: 'dropout_query',
    className: 'Dropout',
    details: 'p=0.3',
    row: 1,
    col: 2
  },
  {
    name: 'Merge_1',
    className: 'Merge',
    details: 'Dot',
    row: 2,
    col: 1
  },

  // /////////////////////////////////////////////////////////////////////
  // block 2

  {
    name: 'output_encoder',
    className: 'Embedding',
    details: '64',
    row: 3,
    col: 0
  },
  {
    name: 'dropout_output',
    className: 'Dropout',
    details: 'p=0.3',
    row: 4,
    col: 0
  },
  {
    name: 'Merge_2',
    className: 'Merge',
    details: 'Sum',
    row: 5,
    col: 1
  },
  {
    name: 'Merge_3',
    className: 'Merge',
    details: 'concat',
    row: 6,
    col: 1
  },
  {
    name: 'LSTM_1',
    className: 'LSTM',
    details: '32',
    row: 7,
    col: 1
  },
  {
    name: 'dropout_LSTM',
    className: 'Dropout',
    details: 'p=0.3',
    row: 8,
    col: 1
  },
  {
    name: 'dense_1',
    className: 'Dense',
    details: 'Vocabulary size',
    row: 9,
    col: 1
  },
  {
    name: 'activation_1',
    className: 'Activation',
    details: 'Softmax',
    row: 10,
    col: 1
  } 
]

export const ARCHITECTURE_CONNECTIONS = [

  // main

  {
    from: 'activation_1',
    to: 'Merge_3'
  },

  {
    from: 'dropout_query',
    to: 'Merge_3',
    corner:'bottom-right'
  },

  {
    from: 'Merge_3',
    to: 'Merge_2'
  },


  {
    from: 'dropout_output',
    to: 'Merge_2',
    corner:'bottom-left'
  },

  {
    from: 'output_encoder',
    to: 'dropout_output'
  },

  {
    from: 'Merge_1',
    to: 'Merge_2'
  },

  // identity block 3c

  {
    from: 'dropout_input',
    to: 'Merge_1',
    corner:'bottom-left'
  },

  // identity block 3d

  {
    from: 'dropout_query',
    to: 'Merge_1',
    corner:'bottom-right'
  },

  // conv block 4a

  {
    from: 'input_encoder',
    to: 'dropout_input'
  },

  // identity block 4b

  {
    from: 'query_encoder',
    to: 'dropout_query'
  },
   
]
