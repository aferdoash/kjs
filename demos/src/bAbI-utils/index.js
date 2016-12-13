/* global word dictionary data */
import unpack from 'ndarray-unpack'
import ndarray from 'ndarray'
import {wordDicts} from './wordDicts-hn.js'

export function locationClasses(outputProbs) {
      const inds = new Float32Array([11,13,14,22,23,24]) 
      const results =[]
      for (let i=0; i<6;i++) {
          var loc = inds[i]
          results.push({name:wordDicts[loc], probability: outputProbs[loc]})

      }
      return results
}