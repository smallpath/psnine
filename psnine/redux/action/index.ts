import app from './app'
import community from './community'
import battle from './battle'
import qa from './qa'
import game from './game'
import rank from './rank'
import gene from './gene'
import circle from './circle'
import store from './store'
import trade from './trade'
import discount from './discount'

const actions = {}

Object.assign(actions, app)
Object.assign(actions, community)
Object.assign(actions, qa)
Object.assign(actions, battle)
Object.assign(actions, rank)
Object.assign(actions, game)
Object.assign(actions, gene)
Object.assign(actions, circle)
Object.assign(actions, store)
Object.assign(actions, trade)
Object.assign(actions, discount)

export default actions
