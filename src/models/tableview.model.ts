/* eslint-disable camelcase */
// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model, QueryBuilder } from 'objection'
import { Application } from '../declarations'
import { TableColumn } from './tablecolumn.model'
import { TableRow } from './tablerow.model'
import { BaseModel } from './base.model'
import { table } from './table.model'

export type LckColumnFilter = Record<string, string | Array<string | number> | Object>

export class TableColumnDTO extends TableColumn {
  filter?: LckColumnFilter
  sort?: Object
}

export class TableView extends BaseModel {
  columns?: TableColumnDTO[];
  text!: string;
  locked!: boolean;
  position?: number;
  table_id!: string;

  static get tableName () {
    return 'table_view'
  }

  static get jsonSchema () {
    return {
      type: 'object',
      required: ['text'],

      properties: {
        text: { type: 'string' },
        locked: { type: 'boolean' },
        position: { type: ['number', 'null'] }
      }
    }
  }

  static get relationMappings () {
    return {
      columns: {
        relation: Model.ManyToManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use a model
        // subclass constructor `Animal` here.
        modelClass: TableColumn,
        join: {
          from: 'table_view.id',
          through: {
            from: 'table_view_has_table_column.table_view_id',
            to: 'table_view_has_table_column.table_column_id',
            extra: ['displayed', 'filter', 'transmitted', 'position', 'editable', 'style', 'default']
          },
          to: 'table_column.id',
          modify (query: QueryBuilder<TableColumn>) {
            query.clear('limit')
          }
        }
      },
      rows: {
        relation: Model.HasManyRelation,
        modelClass: TableRow,
        join: {
          from: 'table_view.table_id',
          to: 'table_row.table_id'
        }
      },
      table: {
        relation: Model.HasOneRelation,
        modelClass: table,
        join: {
          from: 'table_view.table_id',
          to: 'table.id'
        }
      }
    }
  }
}

export default function (app: Application) {
  return TableView
}
