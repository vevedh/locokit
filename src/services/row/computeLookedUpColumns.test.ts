import { COLUMN_TYPE } from '@locokit/lck-glossary'
import app from '../../app'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { workspace } from '../../models/workspace.model'

describe('computeLookedUpColumns hook', () => {
  let workspace: workspace
  let database: database
  let table1: table
  let table2: table
  let columnTable1Ref: TableColumn
  let columnTable1User: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2RelationBetweenTable1: TableColumn
  let columnTable2LookedUpColumnTable1User: TableColumn
  let columnTable2LookedUpColumnTable1MultiUser: TableColumn
  let user1: User
  let rowTable1: TableRow
  let rowTable2: TableRow
  let user2: User

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
    columnTable1Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id
    })
    columnTable1User = await app.service('column').create({
      text: 'User',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table1.id
    })
    columnTable1MultiUser = await app.service('column').create({
      text: 'MultiUser',
      column_type_id: COLUMN_TYPE.MULTI_USER,
      table_id: table1.id
    })
    columnTable2Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id
    })
    columnTable2RelationBetweenTable1 = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id
      }
    })
    columnTable2LookedUpColumnTable1User = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1User.id
      }
    })
    columnTable2LookedUpColumnTable1MultiUser = await app.service('column').create({
      text: 'RefMulti',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTable1.id,
        foreignField: columnTable1MultiUser.id
      }
    })
    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1-lkdpup@locokit.io',
      password: 'locokit'
    })
  })

  beforeEach(async () => {
    const service = app.service('row')
    rowTable1 = await service.create({
      table_id: table1.id,
      text: 'table 1 ref',
      data: {
        [columnTable1User.id]: user1.id,
        [columnTable1MultiUser.id]: [user1.id]
      }
    })
    rowTable2 = await service.create({
      table_id: table2.id,
      text: 'table 2 ref',
      data: {
        [columnTable2RelationBetweenTable1.id]: rowTable1.id
      }
    })
    user2 = await app.service('user').create({
      name: 'User 2',
      email: 'user2@locokit.io',
      password: 'locokit'
    })
  })

  it('compute the lookedup column of other rows related', async () => {
    expect.assertions(16)
    const currentColumnTable1User = rowTable1.data[columnTable1User.id] as {reference: string, value: string}
    const currentColumnTable1MultiUser = rowTable1.data[columnTable1MultiUser.id] as {reference: string, value: string}
    const currentColumnTable2User = rowTable2.data[columnTable2LookedUpColumnTable1User.id] as {reference: string, value: string}
    const currentColumnTable2MultiUser = rowTable2.data[columnTable2LookedUpColumnTable1MultiUser.id] as {reference: string, value: string}
    // User
    expect(currentColumnTable1User.reference).toBe(user1.id)
    expect(currentColumnTable1User.value).toBe(user1.name)
    expect(currentColumnTable2User.reference).toBe(user1.id)
    expect(currentColumnTable2User.value).toBe(user1.name)
    // MultiUser
    expect(currentColumnTable1MultiUser.reference).toEqual([user1.id])
    expect(currentColumnTable1MultiUser.value).toEqual([user1.name])
    expect(currentColumnTable2MultiUser.reference).toEqual([user1.id])
    expect(currentColumnTable2MultiUser.value).toBe(user1.name)

    const newRowTable1 = await app.service('row').patch(rowTable1.id, {
      data: {
        [columnTable1User.id]: user2.id,
        [columnTable1MultiUser.id]: [user1.id, user2.id]
      }
    })
    const newRowTable2 = await app.service('row').get(rowTable2.id)
    const newColumnTable1User = newRowTable1.data[columnTable1User.id] as {reference: string, value: string}
    const newColumnTable1MultiUser = newRowTable1.data[columnTable1MultiUser.id] as {reference: string, value: string}
    const newColumnTable2User = newRowTable2.data[columnTable2LookedUpColumnTable1User.id] as {reference: string, value: string}
    const newColumnTable2MultiUser = newRowTable2.data[columnTable2LookedUpColumnTable1MultiUser.id] as {reference: string, value: string}
    // User
    expect(newColumnTable1User.reference).toBe(user2.id)
    expect(newColumnTable1User.value).toBe(user2.name)
    expect(newColumnTable2User.reference).toBe(user2.id)
    expect(newColumnTable2User.value).toBe(user2.name)
    // MultiUser
    expect(newColumnTable1MultiUser.reference).toEqual([user1.id, user2.id])
    expect(newColumnTable1MultiUser.value).toEqual([user1.name, user2.name])
    expect(newColumnTable2MultiUser.reference).toEqual([user1.id, user2.id])
    expect(newColumnTable2MultiUser.value).toBe(`${user1.name}, ${user2.name}`)
  })

  afterEach(async () => {
    await app.service('user').remove(user2.id)
    await app.service('row').remove(rowTable2.id)
    await app.service('row').remove(rowTable1.id)
  })

  afterAll(async () => {
    await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1MultiUser.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1MultiUser.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
