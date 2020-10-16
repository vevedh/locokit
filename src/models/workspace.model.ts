// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection'
import { Application } from '../declarations'
import { chapter as LckChapter } from './chapter.model'
import { database as LckDatabase } from './database.model'

export class workspace extends Model {
  id!: string;
  createdAt!: string;
  updatedAt!: string;
  text!: string;
  chapters?: LckChapter[];
  databases?: LckDatabase[];

  static get tableName () {
    return 'workspace'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' }
      }
    }
  }

  static get relationMappings () {
    return {
      chapters: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckChapter,
        join: {
          from: 'workspace.id',
          to: 'chapter.workspace_id'
        }
      },
      databases: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckDatabase,
        join: {
          from: 'workspace.id',
          to: 'database.workspace_id'
        }
      }
    }
  }

  $beforeInsert () {
    this.createdAt = this.updatedAt = new Date().toISOString()
  }

  $beforeUpdate () {
    this.updatedAt = new Date().toISOString()
  }
}

export default function (app: Application) {
  return workspace
}
