import { required } from 'vee-validate/dist/rules'
import { extend } from 'vee-validate'
import 'jest-canvas-mock'
require('jest-fetch-mock').enableMocks()

extend('required', required)
