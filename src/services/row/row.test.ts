import { COLUMN_TYPE } from '@locokit/lck-glossary';
import app from '../../app';
import { column } from '../../models/column.model';
import { database } from '../../models/database.model';
import { row } from '../../models/row.model';
import { table } from '../../models/table.model';
import { user } from '../../models/user.model';
import { workspace } from '../../models/workspace.model';

describe('\'row\' service', () => {
  it('registered the service', () => {
    const service = app.service('row');
    expect(service).toBeTruthy();
  });

  let workspace: workspace
  let database: database
  let table: table
  beforeAll(async () => {
    workspace = await app.service('workspace').create({text: 'pouet'})
    database = await app.service('database').create({text: 'pouet', workspace_id: workspace.id})
    table = await app.service('table').create({text: 'pouet', database_id: database.id})
  })

  it('throw if table_id is not present', async () => {
    const service = app.service('row');
    expect.assertions(1);
    await expect(service.create({
      text: 'test',
    })).rejects.toThrow()
  })
  it('throw if table_id is present but did not exist', async () => {
    const service = app.service('row');
    expect.assertions(1);
    await expect(service.create({
      text: 'test',
      table_id: 'you lose'
    })).rejects.toThrow()
  })
  it('succeed if table_id is present and exist', async () => {
    const service = app.service('row');
    expect.assertions(1);
    const row: row = await service.create({
      text: 'test',
      table_id: table.id
    })
    expect(row).toBeTruthy()
  })

  it('patch only the "text" property when patching "text" (bug of crush "data" property)', async () => {
    const service = app.service('row');
    const tableColumn = await app.service('column').create({
      text: 'myColumn',
      table_id: table.id,
      column_type_id: COLUMN_TYPE.STRING
    })
    const currentRow: row = await service.create({
      text: 'test',
      data: {
        [tableColumn.id]: 'myValue'
      },
      table_id: table.id
    })
    const patchedRow: row = await service.patch(currentRow.id, {
      text: 'new test'
    })
    expect(patchedRow.text).toEqual('new test');
    expect(patchedRow.data[tableColumn.id]).toEqual('myValue');
  });

  afterAll(async () => {
    await app.service('table').remove(table.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
});


describe ('hooks for row service', () => {

  let workspace: workspace
  let database: database
  let table1: table
  let table2: table
  let columnTable1Ref: column
  let columnTable1User: column
  let columnTable2Ref: column
  let columnTable2RelationBetweenTable1: column
  let columnTable2LookedUpColumnTable1User: column
  let user1: user

  beforeAll(async() => {
    workspace = await app.service('workspace').create({text: 'pouet'})
    database = await app.service('database').create({text: 'pouet', workspace_id: workspace.id})
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
    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1@world.com',
      password: 'locokit'
    })
  })

  describe('enhanceComplexColumns', () => {
    let rowTable1: row
    let rowTable2: row
    it('enhance the user data field with the user name in value when creating a row with a USER column type', async () => {
      const service = app.service('row')
      rowTable1 = await service.create({
        table_id: table1.id,
        text: 'table 1 ref',
        data: {
          [columnTable1User.id]: user1.id
        }
      })
      expect.assertions(3)
      expect(rowTable1).toBeTruthy()
      expect(( rowTable1.data[columnTable1User.id] as { reference: string, value: string }).value).toBe('User 1')
      expect(( rowTable1.data[columnTable1User.id] as { reference: string, value: string }).reference).toBe(user1.id)
    })
    it('enhance the relation data field with the relation table in value when creating a row with a USER column type', async () => {
      const service = app.service('row')
      rowTable2 = await service.create({
        table_id: table2.id,
        text: 'table 2 ref',
        data: {
          [columnTable2RelationBetweenTable1.id]: rowTable1.id
        }
      })
      expect.assertions(3)
      expect(rowTable2).toBeTruthy()
      expect(( rowTable2.data[columnTable2RelationBetweenTable1.id] as { reference: string, value: string }).value).toBe('table 1 ref')
      expect(( rowTable2.data[columnTable2RelationBetweenTable1.id] as { reference: string, value: string }).reference).toBe(rowTable1.id)
    })

    afterAll(async () => {
      await app.service('row').remove(rowTable2.id)
      await app.service('row').remove(rowTable1.id)
    })
  })

  describe('restrictRemoveIfRelatedRows', () => {
    let rowTable1: row
    let rowTable2: row
    beforeEach(async () => {
      const service = app.service('row')
      rowTable1 = await service.create({
        table_id: table1.id,
        text: 'table 1 ref',
        data: {
          [columnTable1User.id]: user1.id
        }
      })
      rowTable2 = await service.create({
        table_id: table2.id,
        text: 'table 2 ref',
        data: {
          [columnTable2RelationBetweenTable1.id]: rowTable1.id
        }
      })
    })
    it('restrict the deletion of a row if there is a related row', async () => {
      expect.assertions(1)
      try {
        await app.service('row').remove(rowTable1.id)
      } catch (e) {
        expect(e).toBeTruthy()
      }
    })
    it('let the removal execute if deletion are ordered correctly', async () => {
      expect.assertions(4)
      await app.service('row').remove(rowTable2.id)
      await app.service('row').remove(rowTable1.id)
      try {
        await app.service('row').get(rowTable2.id)
      } catch(e) {
        expect(e).toBeTruthy()
        expect(e.code).toBe(404)
      }
      try {
        await app.service('row').get(rowTable1.id)
      } catch(e) {
        expect(e).toBeTruthy()
        expect(e.code).toBe(404)
      }
    })

  })

  describe('upsertRowRelation', () => {
    let rowTable1: row
    let rowTable2: row

    beforeEach(async () => {
      const service = app.service('row')
      rowTable1 = await service.create({
        table_id: table1.id,
        text: 'table 1 ref',
        data: {
          [columnTable1User.id]: user1.id
        }
      })
      rowTable2 = await service.create({
        table_id: table2.id,
        text: 'table 2 ref',
        data: {
          [columnTable2RelationBetweenTable1.id]: rowTable1.id
        }
      })
    })
    it('create a relation between 2 rows when columns are related', async () => {
      expect.assertions(1)
      const relation = await app.services.trr._find({
        query: {
          table_row_from_id: rowTable1.id,
          table_row_to_id: rowTable2.id,
          table_column_to_id: columnTable2RelationBetweenTable1.id
        }
      })
      expect(relation.total).toBe(1)
    })

    afterEach(async () => {
      await app.service('row').remove(rowTable2.id)
      await app.service('row').remove(rowTable1.id)
    })
  })

  describe('computeRowLookedUpColumns', () => {
    let rowTable1: row
    let rowTable2: row

    beforeEach(async () => {
      const service = app.service('row')
      rowTable1 = await service.create({
        table_id: table1.id,
        text: 'table 1 ref',
        data: {
          [columnTable1User.id]: user1.id
        }
      })
      rowTable2 = await service.create({
        table_id: table2.id,
        text: 'table 2 ref',
        data: {
          // [columnTable2RelationBetweenTable1.id]: rowTable1.id
        }
      })
    })

    it('compute the lookedup column of the currentRow', async () => {
      expect.assertions(1)
      expect(rowTable2.data[columnTable2RelationBetweenTable1.id]).toBeNull()
    })

    afterEach(async () => {
      await app.service('row').remove(rowTable2.id)
      await app.service('row').remove(rowTable1.id)
    })

  })
  describe('completeDefaultValues', () => {
    it('complete all columns for data field', async () => {
      const service = app.service('row')
      const rowTable1 = await service.create({
        table_id: table1.id,
        text: 'table 1 ref',
        data: {}
      })
      expect.assertions(2)
      const targetKeys = [
        columnTable1Ref.id,
        columnTable1User.id,
      ]
      Object.keys(rowTable1.data).forEach(key => {
        expect(targetKeys.indexOf(key) > -1).toBe(true)
      })
      await app.service('row').remove(rowTable1.id)
    })
    it('even if data is not passed in param', async () => {
      const service = app.service('row')
      const rowTable1 = await service.create({
        table_id: table1.id,
        text: 'table 1 ref',
      })
      expect.assertions(2)
      const targetKeys = [
        columnTable1Ref.id,
        columnTable1User.id,
      ]
      Object.keys(rowTable1.data).forEach(key => {
        expect(targetKeys.indexOf(key) > -1).toBe(true)
      })
      await app.service('row').remove(rowTable1.id)
    })

  })

  afterAll(async () => {
    await app.service('user').remove(user1.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Ref.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2LookedUpColumnTable1User.id)
    await app.service('column').remove(columnTable2RelationBetweenTable1.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
})
