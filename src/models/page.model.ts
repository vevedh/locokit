// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from 'objection';
import { Application } from '../declarations';
import { container as LckContainer } from './container.model'

export class page extends Model {
  createdAt!: string;
  updatedAt!: string;

  static get tableName() {
    return 'page';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' }
      }
    };
  }


  static get relationMappings() {
    return {
      containers: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: LckContainer,
        join: {
          from: 'page.id',
          to: 'container.page_id'
        }
      },
    }
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default function (app: Application) {
  return page;
}
