/* global ImageData */
import unpack from 'ndarray-unpack'
import ndarray from 'ndarray'
import {wordDicts} from './wordDicts.js'

export function locationClasses(outputProbs) {
      const inds = new Float32Array([9,10,11,12,15,17]) 
      console.log("herebAbI")
      console.log(outputProbs)
      const results =[]
      for (let i=0; i<6;i++) {
          var loc = inds[i]
          console.log(loc)
          results.push({name:wordDicts[loc], probability: outputProbs[loc-1]})

      }
      return results
}
