import * as authentication from '@feathersjs/authentication'
import { HookContext } from '@feathersjs/feathers'
import hooks from 'feathers-hooks-common'
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = authentication.hooks

const isAction = (...args:string[]) => (hook: HookContext) => args.includes(hook.data.action)

export default {
  before: {
    create: [
      hooks.iff(
        isAction('passwordChange', 'identityChange'),
        authenticate('jwt')
      )
    ]
  }
}
