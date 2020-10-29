import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { workspace } from '../../models/workspace.model'
import { Group } from '../../models/group.model'

import { BadRequest, NotAcceptable } from '@feathersjs/errors'

describe('checkColumnDefinitionMatching hook', () => {
  let workspace: workspace
  let database: database
  let table1: table
  let table2: table
  let columnTable1Boolean: TableColumn
  let columnTable1Number: TableColumn
  let columnTable1Date: TableColumn
  let columnTable1String: TableColumn
  let columnTable1Float: TableColumn
  let columnTable1User: TableColumn
  let columnTable1Group: TableColumn
  let columnTable1RelationBetweenTables: TableColumn
  let columnTable1LookedUpColumn: TableColumn
  let columnTable1SingleSelect: TableColumn
  let columnTable1MultiSelect: TableColumn
  let columnTable1Formula: TableColumn
  let columnTable1File: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable1MultiGroup: TableColumn
  let columnTable1Text: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2Name: TableColumn
  // let user1: User
  // let group1: Group
  const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
  const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
  const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'

  beforeAll(async () => {
    workspace = await app.service('workspace').create({ text: 'pouet' })
    database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database.id
    })
    table2 = await app.service('table').create({
      text: 'table2',
      database_id: database.id
    })
    columnTable2Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id
    })
    columnTable2Name = await app.service('column').create({
      text: 'Name',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id
    })
    columnTable1Boolean = await app.service('column').create({
      text: 'Boolean',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      table_id: table1.id
    })
    columnTable1Number = await app.service('column').create({
      text: 'Number',
      column_type_id: COLUMN_TYPE.NUMBER,
      table_id: table1.id
    })
    columnTable1Date = await app.service('column').create({
      text: 'Date',
      column_type_id: COLUMN_TYPE.DATE,
      table_id: table1.id
    })
    columnTable1String = await app.service('column').create({
      text: 'String',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id
    })
    columnTable1Float = await app.service('column').create({
      text: 'Float',
      column_type_id: COLUMN_TYPE.FLOAT,
      table_id: table1.id
    })
    columnTable1User = await app.service('column').create({
      text: 'User',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table1.id
    })
    columnTable1Group = await app.service('column').create({
      text: 'Group',
      column_type_id: COLUMN_TYPE.GROUP,
      table_id: table1.id
    })
    columnTable1RelationBetweenTables = await app.service('column').create({
      text: 'RelationBetweenTables',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table1.id,
      settings: {
        tableId: table2.id
      }
    })
    columnTable1LookedUpColumn = await app.service('column').create({
      text: 'LookedUpColumn',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table1.id,
      settings: {
        tableId: table1.id,
        localField: columnTable1RelationBetweenTables.id,
        foreignField: columnTable2Name.id
      }
    })
    columnTable1SingleSelect = await app.service('column').create({
      text: 'SingleSelect',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          [singleSelectOption1UUID]: {
            label: 'option 1'
          },
          [singleSelectOption2UUID]: {
            label: 'option 2'
          },
          [singleSelectOption3UUID]: {
            label: 'option 3'
          }
        }
      }
    })
    columnTable1MultiSelect = await app.service('column').create({
      text: 'MultiSelect',
      column_type_id: COLUMN_TYPE.MULTI_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          [singleSelectOption1UUID]: {
            label: 'option 1'
          },
          [singleSelectOption2UUID]: {
            label: 'option 2'
          },
          [singleSelectOption3UUID]: {
            label: 'option 3'
          }
        }
      }
    })
    columnTable1Formula = await app.service('column').create({
      text: 'Formula',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id
    })
    columnTable1File = await app.service('column').create({
      text: 'File',
      column_type_id: COLUMN_TYPE.FILE,
      table_id: table1.id
    })
    columnTable1MultiUser = await app.service('column').create({
      text: 'MultiUser',
      column_type_id: COLUMN_TYPE.MULTI_USER,
      table_id: table1.id
    })
    columnTable1MultiGroup = await app.service('column').create({
      text: 'MultiGroup',
      column_type_id: COLUMN_TYPE.MULTI_GROUP,
      table_id: table1.id
    })
    columnTable1Text = await app.service('column').create({
      text: 'Text',
      column_type_id: COLUMN_TYPE.TEXT,
      table_id: table1.id
    })
  })

  it('throw an error if a boolean column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Boolean.id]: 'you lose'
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a boolean column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Boolean.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a boolean value for a boolean column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Boolean.id]: true
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a number column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Number.id]: 'you lose'
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a number column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Number.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a number value for a number column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Number.id]: 123456
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a float column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Float.id]: 'you lose'
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a float column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Float.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a float value for a float column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Float.id]: 123.456
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a date column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Date.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a date column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Date.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a date column receive a non ISO8601 string', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Date.id]: 'you lose...'
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept an ISO8601 string value for a date column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Date.id]: '2020-10-29'
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a SINGLE_SELECT column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1SingleSelect.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a SINGLE_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1SingleSelect.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a SINGLE_SELECT column receive a string that is not an option from column settings', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1SingleSelect.id]: 'you lose...'
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a string value from values settings for a SINGLE_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1SingleSelect.id]: singleSelectOption1UUID
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a MULTI_SELECT column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a MULTI_SELECT column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: 'you lose'
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a MULTI_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept an empty array value for a MULTI_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: []
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a MULTI_SELECT column receive an array with a string that is not an option from column settings', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: [
            'you lose...'
          ]
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('throw an error if a MULTI_SELECT column receive an array from which one string is not an option from column settings', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: [
            singleSelectOption1UUID,
            'you lose...'
          ]
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a string array from values settings for a MULTI_SELECT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiSelect.id]: [
            singleSelectOption1UUID,
            singleSelectOption2UUID
          ]
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a STRING column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1String.id]: 123
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a STRING column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1String.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a string value for a STRING column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1String.id]: 'that works'
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a TEXT column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Text.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a TEXT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Text.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('accept a string value for a TEXT column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Text.id]: 'that works'
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a RELATION_BETWEEN_TABLES column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1RelationBetweenTables.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a RELATION_BETWEEN_TABLES column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1RelationBetweenTables.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a RELATION_BETWEEN_TABLES column receive a string value not referencing a row from the good table', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1RelationBetweenTables.id]: 'you lose'
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a string value referencing another row from the good table for a RELATION_BETWEEN_TABLES column type', async () => {
    expect.assertions(2)
    const rowTable2 = await app.service('row')
      .create({
        data: {
          [columnTable2Name.id]: 'I\'m jack',
          [columnTable2Ref.id]: 'do not know'
        },
        table_id: table2.id
      })
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1RelationBetweenTables.id]: rowTable2.id
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
    await app.service('row').remove(rowTable2.id)
  })

  it('throw an error if a USER column receive a string value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1User.id]: 'you lose'
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a USER column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1User.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a USER column receive a number value not referencing a user', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1User.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a number value referencing a user for a USER column type', async () => {
    expect.assertions(2)
    const user = await app.service('user')
      .create({
        name: 'Jack',
        email: 'hello-check@locokit.io'
      })
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1User.id]: user.id
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
    await app.service('user').remove(user.id)
  })

  it('throw an error if a GROUP column receive a number value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Group.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a GROUP column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Group.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a GROUP column receive a string value not referencing a group', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Group.id]: 'you lose'
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a string value referencing a group for a GROUP column type', async () => {
    expect.assertions(2)
    const group = await app.service('group')
      .create({
        name: 'Jack'
      })
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Group.id]: group.id
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
    await app.service('group').remove(group.id)
  })

  it('throw an error if a LOOKED_UP_COLUMN column receive a value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1LookedUpColumn.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a LOOKED_UP_COLUMN column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1LookedUpColumn.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a FORMULA column receive a value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1Formula.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a FORMULA column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1Formula.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a FILE column receive a value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1File.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a FILE column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1File.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a MULTI_USER column receive a value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiUser.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a MULTI_USER column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiUser.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  it('throw an error if a MULTI_GROUP column receive a value', async () => {
    expect.assertions(1)
    await expect(app.service('row')
      .create({
        data: {
          [columnTable1MultiGroup.id]: 123456
        },
        table_id: table1.id
      }))
      .rejects.toThrow(NotAcceptable)
  })

  it('accept a null value for a MULTI_GROUP column type', async () => {
    expect.assertions(2)
    const rowTable1 = await app.service('row')
      .create({
        data: {
          [columnTable1MultiGroup.id]: null
        },
        table_id: table1.id
      })
    expect(rowTable1).toBeTruthy()
    expect(rowTable1.data).toBeDefined()
    await app.service('row').remove(rowTable1.id)
  })

  afterAll(async () => {
    // await app.service('group').remove(group1.id)
    // await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable1Boolean.id)
    await app.service('column').remove(columnTable1Number.id)
    await app.service('column').remove(columnTable1Date.id)
    await app.service('column').remove(columnTable1String.id)
    await app.service('column').remove(columnTable1Float.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Group.id)
    await app.service('column').remove(columnTable1RelationBetweenTables.id)
    await app.service('column').remove(columnTable1LookedUpColumn.id)
    await app.service('column').remove(columnTable1SingleSelect.id)
    await app.service('column').remove(columnTable1MultiSelect.id)
    await app.service('column').remove(columnTable1Formula.id)
    await app.service('column').remove(columnTable1File.id)
    await app.service('column').remove(columnTable1MultiUser.id)
    await app.service('column').remove(columnTable1MultiGroup.id)
    await app.service('column').remove(columnTable1Text.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2Name.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
