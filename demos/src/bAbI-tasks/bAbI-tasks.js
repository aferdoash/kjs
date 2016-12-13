/* global Vue */
import './bAbI-tasks.css'
import ndarray from 'ndarray'
import axios from 'axios'
import random from 'lodash/random'
import findIndex from 'lodash/findIndex'
import ops from 'ndarray-ops'
import Tensor from '../../../src/Tensor'
import * as utils from '../bAbI-utils'
import {word_dict} from './hn_dict.js'

const MODEL_FILEPATHS_DEV = {
  model: '/demos/data/bAbI-tasks/TASK11_hn.json',
  weights: '/demos/data/bAbI-tasks/TASK11_hn_weights.buf',
  metadata: '/demos/data/bAbI-tasks/TASK11_hn_metadata.json'
}
const MODEL_FILEPATHS_PROD = {
  model: '/demos/data/bAbI-tasks/TASK11_hn.json',
  weights: '/demos/data/bAbI-tasks/TASK11_hn_weights.buf',
  metadata: '/demos/data/bAbI-tasks/TASK11_hn_metadata.json'
}
const MODEL_CONFIG = {
  filepaths: (process.env.NODE_ENV === 'production') ? MODEL_FILEPATHS_PROD : MODEL_FILEPATHS_DEV
}

const ADDITIONAL_DATA_FILEPATHS_DEV = {
  testSamples: '/demos/data/bAbI-tasks/bAbI_hindi_test.json'
}
const ADDITIONAL_DATA_FILEPATHS_PROD = {
  testSamples: '/demos/data/bAbI-tasks/bAbI_hindi_test.json'
}
const ADDITIONAL_DATA_FILEPATHS = (process.env.NODE_ENV === 'production')
  ? ADDITIONAL_DATA_FILEPATHS_PROD
  : ADDITIONAL_DATA_FILEPATHS_DEV

const QUERY_LIST = [
    {name:'डेनियल कहाँ है ?', value:'1'},
    {name:'जॉन कहाँ है ?', value: '2'},
    { name:'मैरी कहाँ है ?', value: '3'},
    {name:'सांड्रा कहाँ है ?', value:'4'}
    ]
   

const MAXLEN = 65
const ANSLEN = 27
const QRYLEN = 4

/**
 *
 * VUE COMPONENT
 *
 */
export const bAbITasks = Vue.extend({
  props: ['hasWebgl'],

  template: require('raw-loader!./bAbI-tasks.template.html'),

  data: function () {
    return {
      showInfoPanel: true,
      useGpu: false,
      model: new KerasJS.Model(Object.assign({ gpu: false }, MODEL_CONFIG)),
      modelLoading: true,
      modelRunning: false,
      output: '',
      inputText: '',
      wordIndex: word_dict,
      testSamples: [],
      values : new Float32Array(MAXLEN),
      queryInput : null,
      querySelectList : QUERY_LIST,
      query :new Float32Array(QRYLEN)
    }
  },

  computed: {
    loadingProgress: function () {
      return this.model.getLoadingProgress()
    },
    outputClasses: function () {
      if (!this.output) {
        let empty = []
        for (let i = 0; i < 6; i++) {
          empty.push({ name: '-', probability: 0 })
        }
        return empty
      }
      return utils.locationClasses(this.output) 
    }
  },
  ready: function () {
    this.model.ready().then(() => {
      this.modelLoading = false
      this.loadAdditionalData()
    })
  },

  methods: {

    closeInfoPanel: function () {
      this.showInfoPanel = false
    },
    querySelectChanged: function (e) {
      this.loadQuery(this.queryInput)
    },
    clear: function (e) {
      this.inputText = ''
  //    this.queryInput = null
      this.queryInput = null
      this.output = ''
    },

    loadAdditionalData: function () {
      this.modelLoading = true
      const reqs = ['testSamples'].map(key => {
        return axios.get(ADDITIONAL_DATA_FILEPATHS[key])
      })
      axios.all(reqs)
        .then(axios.spread((testSamples) => {
          this.testSamples = testSamples.data
          this.modelLoading = false
        }))
    },
    randomSample: function() {
          
          const randSampleIdx = random(0, this.testSamples.length - 1)
          this.values = this.testSamples[randSampleIdx].story 
          const words = (this.values).map(idx => {
            if (idx === 0)  {
              return ''
            } else {
              return this.wordIndex[idx]
            }
          })   
          this.inputText = words.join(' ').trim()
    },
    loadQuery: function (question) {
          if (!question) {
              return
          }
         this.modelRunning = true
         if(question == '1') {
             this.query = new Float32Array([3,18,17,2])
         }
         else if (question == '2') {
             this.query = new Float32Array([4,18,17,2])
         }
         else if (question == '3') {
             this.query = new Float32Array([5,18,17,2])
         }
         else if (question == '4') {
             this.query = new Float32Array([7,18,17,2])
         }
        
        
        this.getOutput()
    },
      
    getOutput: function(){
        var inputData = {
           'input_4': new Float32Array(this.values),
           'input_5': this.query,
           'input_6': new Float32Array(this.values)
          }
         this.model.predict(inputData).then(outputData => {
             this.output = outputData['activation_4']
             this.modelRunning = false
          })
    }     
  }
})
