// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { BaseModel } from './base.model'
import { Application } from '../declarations'
import { Table as LckTable } from './table.model'
import { Model, RelationMappings, JSONSchema } from 'objection'
import { workspace } from './workspace.model'

export class database extends BaseModel {
  text!: string

  static get tableName (): string {
    return 'database'
  }

  static get jsonSchema (): JSONSchema {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
      },
    }
  }

  static get relationMappings (): RelationMappings {
    return {
      tables: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckTable,
        join: {
          from: 'database.id',
          to: 'table.database_id',
        },
      },
      workspace: {
        relation: Model.HasOneRelation,
        modelClass: workspace,
        join: {
          from: 'database.workspace_id',
          to: 'workspace.id',
        },
      },
    }
  }
}

export default function (app: Application): typeof database {
  return database
}
