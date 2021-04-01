import app from '../../app'
import {
  getColumnIdsFromFormula,
} from '.'
import { TableColumn } from '../../models/tablecolumn.model'
import { database } from '../../models/database.model'
import { TableRow } from '../../models/tablerow.model'
import { Table } from '../../models/table.model'
import { User } from '../../models/user.model'
import { workspace } from '../../models/workspace.model'
import { COLUMN_TYPE, GROUP_ROLE } from '@locokit/lck-glossary'
import { Group } from '../../models/group.model'

describe('formula utility functions', () => {
  let workspace: workspace
  let database: database
  let table1: Table
  let table2: Table
  let columnTable1Group: TableColumn
  let columnTable1RelationBetweenTables: TableColumn
  let columnTable1SingleSelect: TableColumn
  let columnTable1String: TableColumn
  let columnTable1Text: TableColumn
  let columnTable1URL: TableColumn
  let columnTable1User: TableColumn
  let columnTable1Float: TableColumn
  let columnTable1Number: TableColumn
  let columnTable1Date: TableColumn
  let columnTable1Boolean: TableColumn
  let columnTable1LookedUpColumn: TableColumn
  let columnTable1Formula: TableColumn
  let columnTable2String: TableColumn
  let user1: User
  let user2: User
  let group: Group
  let rowTable1: TableRow
  let rowTable2: TableRow

  beforeAll(async () => {
    // Create workspace
    workspace = await app.service('workspace').create({ text: 'pouet' })
    // Create database
    database = await app.service('database').create({ text: 'pouet', workspace_id: workspace.id })
    // Create tables
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database.id,
    })
    table2 = await app.service('table').create({
      text: 'table2',
      database_id: database.id,
    })
    // // Create table 2 columns
    columnTable2String = await app.service('column').create({
      text: 'T2-STRING',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    // Create table 1 columns
    columnTable1Group = await app.service('column').create({
      text: 'T1-GROUP',
      column_type_id: COLUMN_TYPE.GROUP,
      table_id: table1.id,
    })
    columnTable1RelationBetweenTables = await app.service('column').create({
      text: 'T1-RELATIONBETWEENTABLES',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table1.id,
      settings: {
        tableId: table2.id,
      },
    })
    columnTable1SingleSelect = await app.service('column').create({
      text: 'T1-SINGLESELECT',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          idA: { label: 'mylabelA', color: 'white', backgroundColor: 'black' },
          idB: { label: 'mylabelB', color: 'white', backgroundColor: 'black' },
        },
      },
    })
    columnTable1String = await app.service('column').create({
      text: 'T1-STRING',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    columnTable1Text = await app.service('column').create({
      text: 'T1-Text',
      column_type_id: COLUMN_TYPE.TEXT,
      table_id: table1.id,
    })
    columnTable1URL = await app.service('column').create({
      text: 'T1-URL',
      column_type_id: COLUMN_TYPE.URL,
      table_id: table1.id,
    })
    columnTable1User = await app.service('column').create({
      text: 'T1-USER',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table1.id,
    })
    columnTable1Float = await app.service('column').create({
      text: 'T1-TEXT',
      column_type_id: COLUMN_TYPE.FLOAT,
      table_id: table1.id,
    })
    columnTable1Number = await app.service('column').create({
      text: 'T1-NUMBER',
      column_type_id: COLUMN_TYPE.NUMBER,
      table_id: table1.id,
    })
    columnTable1Date = await app.service('column').create({
      text: 'T1-DATE',
      column_type_id: COLUMN_TYPE.DATE,
      table_id: table1.id,
    })
    columnTable1Boolean = await app.service('column').create({
      text: 'T1-BOOLEAN',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      table_id: table1.id,
    })
    columnTable1LookedUpColumn = await app.service('column').create({
      text: 'T1-LOOKEDUPCOLUMN',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table1.id,
      settings: {
        tableId: table1.id,
        localField: columnTable1RelationBetweenTables.id,
        foreignField: columnTable2String.id,
      },
    })
    columnTable1Formula = await app.service('column').create({
      text: 'T1-FORMULA',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: '""',
      },
    })
    columnTable1LookedUpColumn = await app.service('column').get(columnTable1LookedUpColumn.id,
      {
        query: {
          $eager: 'parents.^',
        },
      })
    // Create user
    user1 = await app.service('user').create({
      name: 'User 1',
      email: 'user1@locokit.io',
      password: 'locokit',
    })
    user2 = await app.service('user').create({
      name: 'User 2',
      email: 'user2@locokit.io',
      password: 'locokit',
    })
    // Create group
    group = await app.service('group').create({
      workspace: workspace.id,
      workspace_role: GROUP_ROLE.MEMBER,
      name: 'Locokit group',
      users: [user1, user2],
    })
    // Create rows
    rowTable2 = await app.service('row').create({
      table_id: table2.id,
      text: 'table 2 row',
      data: {
        [columnTable2String.id]: 'mySecondString',
      },
    })

    rowTable1 = await app.service('row').create({
      table_id: table1.id,
      text: 'table 1 row',
      data: {
        [columnTable1Group.id]: group.id,
        [columnTable1RelationBetweenTables.id]: rowTable2.id,
        [columnTable1SingleSelect.id]: 'idA',
        [columnTable1String.id]: 'myFirstString',
        [columnTable1Text.id]: 'myFirstText',
        [columnTable1URL.id]: 'https://www.mylocokiturl.io',
        [columnTable1User.id]: user1.id,
        [columnTable1Float.id]: 3.14,
        [columnTable1Number.id]: 10,
        [columnTable1Date.id]: '2021-01-15',
        [columnTable1Boolean.id]: true,
      },
    })
  })

  afterAll(async () => {
    await app.service('user').remove(user1.id)
    await app.service('user').remove(user2.id)
    await app.service('group').remove(group.id)
    await app.service('row').remove(rowTable1.id)
    await app.service('row').remove(rowTable2.id)
    await app.service('column').remove(columnTable1Group.id)
    await app.service('column').remove(columnTable1RelationBetweenTables.id)
    await app.service('column').remove(columnTable1SingleSelect.id)
    await app.service('column').remove(columnTable1String.id)
    await app.service('column').remove(columnTable1Text.id)
    await app.service('column').remove(columnTable1URL.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Float.id)
    await app.service('column').remove(columnTable1Number.id)
    await app.service('column').remove(columnTable1Date.id)
    await app.service('column').remove(columnTable1Boolean.id)
    await app.service('column').remove(columnTable1LookedUpColumn.id)
    await app.service('column').remove(columnTable2String.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)
    await app.service('database').remove(database.id)
    await app.service('workspace').remove(workspace.id)
  })
  describe('getColumnIdsFromFormula, return a list of columns ids specified in a formula', () => {
    it('When only one column is specified', () => {
      const formula = `COLUMN.${columnTable1String.id}`
      const usedColumns = getColumnIdsFromFormula(formula)
      expect(usedColumns.length).toBe(1)
      expect(usedColumns).toStrictEqual([columnTable1String.id])
    })
    it('When several columns are specified', () => {
      const formula = `TEXT.CONCAT(COLUMN.${columnTable1String.id}, COLUMN.${columnTable1Text.id})`
      const usedColumns = getColumnIdsFromFormula(formula)
      expect(usedColumns.length).toBe(2)
      expect(usedColumns).toStrictEqual([columnTable1String.id, columnTable1Text.id])
    })
    it('When the same column is specified twice', () => {
      const formula = `TEXT.CONCAT(COLUMN.${columnTable1String.id}, COLUMN.${columnTable1String.id})`
      const usedColumns = getColumnIdsFromFormula(formula)
      expect(usedColumns.length).toBe(1)
      expect(usedColumns).toStrictEqual([columnTable1String.id])
    })
    it('When the uuid is not a valid one', () => {
      const formula = `TEXT.CONCAT(COLUMN.A${columnTable1String.id},)`
      const usedColumns = getColumnIdsFromFormula(formula)
      expect(usedColumns.length).toBe(0)
    })
    it('When no column is specified', () => {
      const formula = 'TEXT.CONCAT("abc", "def")'
      const usedColumns = getColumnIdsFromFormula(formula)
      expect(usedColumns.length).toBe(0)
    })
  })
  describe('Available functions in a formula', () => {
    async function patchTable1Formula (formula: string): Promise<void> {
      columnTable1Formula = await app.service('column').patch(columnTable1Formula.id, {
        column_type_id: columnTable1Formula.column_type_id,
        table_id: columnTable1Formula.table_id,
        settings: {
          formula,
        },
      })
      rowTable1 = await app.service('row').get(rowTable1.id)
    }
    afterAll(async () => {
      await patchTable1Formula('""')
    })
    describe('Basic types', () => {
      it('Return the specified integer value', async () => {
        await patchTable1Formula('20')
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(20)
      })
      it('Return the specified decimal value', async () => {
        await patchTable1Formula('3.14')
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(3.14)
      })
      it('Return the specified string value', async () => {
        await patchTable1Formula('"myString"')
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.STRING)
        expect(rowTable1.data[columnTable1Formula.id]).toBe('myString')
      })
    })
    describe('Column', () => {
      it('Return the specified value for a number column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1Number.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(rowTable1.data[columnTable1Number.id])
      })
      it('Return the specified value for a float column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1Float.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(rowTable1.data[columnTable1Float.id])
      })
      it('Return the specified value for a date column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1Date.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(rowTable1.data[columnTable1Date.id])
      })
      it('Return the specified value for a boolean column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1Boolean.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(rowTable1.data[columnTable1Boolean.id])
      })
      it('Return the specified value for a group column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1Group.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.GROUP)
        expect(rowTable1.data[columnTable1Formula.id]).toBe((rowTable1.data[columnTable1Group.id] as { value: string, reference: string }).value)
      })
      it('Return the specified value for a relation between table column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1RelationBetweenTables.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.RELATION_BETWEEN_TABLES)
        expect(rowTable1.data[columnTable1Formula.id]).toBe((rowTable1.data[columnTable1RelationBetweenTables.id] as { value: string, reference: string }).value)
      })
      it('Return the specified value for a single select column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1SingleSelect.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.SINGLE_SELECT)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(columnTable1SingleSelect.settings.values?.[rowTable1.data[columnTable1SingleSelect.id] as string].label)
      })
      it('Return the specified value for a string column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1String.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.STRING)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(rowTable1.data[columnTable1String.id])
      })
      it('Return the specified value for a text column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1Text.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(rowTable1.data[columnTable1Text.id])
      })
      it('Return the specified value for a url column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1URL.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.URL)
        expect(rowTable1.data[columnTable1Formula.id]).toBe(rowTable1.data[columnTable1URL.id])
      })
      it('Return the specified value for a user column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1User.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.USER)
        expect(rowTable1.data[columnTable1Formula.id]).toBe((rowTable1.data[columnTable1User.id] as { value: string, reference: string }).value)
      })
      it('Return the specified value for a looked-up column', async () => {
        await patchTable1Formula(`COLUMN.${columnTable1LookedUpColumn.id}`)
        expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.STRING)
        expect(rowTable1.data[columnTable1Formula.id]).toBe((rowTable1.data[columnTable1LookedUpColumn.id] as { value: string, reference: string }).value)
      })
    })
    describe('Date functions', () => {
      describe('DATEADD', () => {
        it('Return the date a specified number of years after the original one.', async () => {
          await patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, 2, "year")`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2023-01-15')
        })
        it('Return the date a specified number of years before the original one.', async () => {
          await patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, -2, "year")`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2019-01-15')
        })
        it('Return the date a specified number of months after the original one.', async () => {
          await patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, 2, "month")`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2021-03-15')
        })
        it('Return the date a specified number of weeks after the original one.', async () => {
          await patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, 2, "week")`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2021-01-29')
        })
        it('Return the date a specified number of days after the original one.', async () => {
          await patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, 2, "day")`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2021-01-17')
        })
        it('Return the date a specified number of hours after the original one.', async () => {
          await patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, 24, "hour")`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2021-01-16')
        })
        it('Return the date a specified number of minutes after the original one.', async () => {
          await patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, ${24 * 60}, "minute")`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2021-01-16')
        })
        it('Return the date a specified number of seconds after the original one.', async () => {
          await patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, ${24 * 60 * 60}, "second")`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2021-01-16')
        })
        it('Return null if the unit is unknown.', async () => {
          await patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, 2, "unknown")`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(null)
        })
        it('Throw an error if no unit is specified', async () => {
          await expect(
            patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id}, 2)`),
          ).rejects.toThrowError('Invalid formula: an argument is missing (unit).')
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula(`DATE.DATEADD(COLUMN.${columnTable1Date.id})`),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.DATEADD()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (startDate).')
        })
      })
      describe('DAY', () => {
        it('Return a number corresponding to the day in the month of the date.', async () => {
          await patchTable1Formula(`DATE.DAY(COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(15)
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.DAY()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (date).')
        })
      })
      describe('DAYS', () => {
        it('Return the number of days between two dates.', async () => {
          await patchTable1Formula(`DATE.DAYS(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, 2, "day"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2)
        })
        it('Return the number of days between two dates.', async () => {
          await patchTable1Formula(`DATE.DAYS(COLUMN.${columnTable1Date.id}, COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Throw an error if no end date is specified', async () => {
          await expect(
            patchTable1Formula(`DATE.DAYS(COLUMN.${columnTable1Date.id})`),
          ).rejects.toThrowError('Invalid formula: an argument is missing (endDate).')
        })
        it('Throw an error if no start date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.DAYS()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (startDate).')
        })
      })
      describe('EARLIER', () => {
        it('Return true if the first date is earlier than the second one', async () => {
          await patchTable1Formula(`DATE.EARLIER(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, 2, "day"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if the two dates are equal', async () => {
          await patchTable1Formula(`DATE.EARLIER(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, 0, "day"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Return false if the first date is later than the second one', async () => {
          await patchTable1Formula(`DATE.EARLIER(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, -2, "day"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if only one date is specified', async () => {
          await expect(
            patchTable1Formula(`DATE.EARLIER(COLUMN.${columnTable1Date.id})`),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondDate).')
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.EARLIER()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstDate).')
        })
      })
      describe('EQUAL', () => {
        it('Return true if two dates are equal', async () => {
          await patchTable1Formula(`DATE.EQUAL(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, 0, "day"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if two dates are not equal', async () => {
          await patchTable1Formula(`DATE.EQUAL(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, 1, "day"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if only one date is specified', async () => {
          await expect(
            patchTable1Formula(`DATE.EQUAL(COLUMN.${columnTable1Date.id})`),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondDate).')
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.EQUAL()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstDate).')
        })
      })
      describe('EOMONTH', () => {
        it('Return the date of the last day of the month of the specified date.', async () => {
          await patchTable1Formula(`DATE.EOMONTH(COLUMN.${columnTable1Date.id}, 0)`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2021-01-31')
        })
        it('Return the date of the last day of the month n months before the specified date.', async () => {
          await patchTable1Formula(`DATE.EOMONTH(COLUMN.${columnTable1Date.id}, -3)`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2020-10-31')
        })
        it('Return the date of the last day of the month n months after the specified date.', async () => {
          await patchTable1Formula(`DATE.EOMONTH(COLUMN.${columnTable1Date.id}, 3)`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.DATE)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2021-04-30')
        })
        it('Throw an error if the number of months is not specified', async () => {
          await expect(
            patchTable1Formula(`DATE.EOMONTH(COLUMN.${columnTable1Date.id})`),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numMonths).')
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.EOMONTH()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (date).')
        })
      })
      describe('HOUR', () => {
        it('Return a number corresponding to the hour of the date.', async () => {
          await patchTable1Formula(`DATE.HOUR(COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.HOUR()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (date).')
        })
      })
      describe('LATER', () => {
        it('Return true if the first date is later than the second one', async () => {
          await patchTable1Formula(`DATE.LATER(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, -2, "day"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if the two dates are equal', async () => {
          await patchTable1Formula(`DATE.LATER(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, 0, "day"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Return false if the first date is earlier than the second one', async () => {
          await patchTable1Formula(`DATE.LATER(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, 2, "day"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if only one date is specified', async () => {
          await expect(
            patchTable1Formula(`DATE.LATER(COLUMN.${columnTable1Date.id})`),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondDate).')
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.LATER()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstDate).')
        })
      })
      describe('MINUTE', () => {
        it('Return a number corresponding to the minutes of the date.', async () => {
          await patchTable1Formula(`DATE.MINUTE(COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.MINUTE()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (date).')
        })
      })
      describe('MONTH', () => {
        it('Return a number corresponding to the month of the date.', async () => {
          await patchTable1Formula(`DATE.MONTH(COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(1)
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.MONTH()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (date).')
        })
      })
      describe('MONTHS', () => {
        it('Return the number of months between two dates (from one column and one function).', async () => {
          await patchTable1Formula(`DATE.MONTHS(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, 5, "month"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(5)
        })
        it('Return the number of months between two dates (from two columns).', async () => {
          await patchTable1Formula(`DATE.MONTHS(COLUMN.${columnTable1Date.id}, COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Throw an error if no end date is specified', async () => {
          await expect(
            patchTable1Formula(`DATE.MONTHS(COLUMN.${columnTable1Date.id})`),
          ).rejects.toThrowError('Invalid formula: an argument is missing (endDate).')
        })
        it('Throw an error if no start date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.MONTHS()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (startDate).')
        })
      })
      describe('SECOND', () => {
        it('Return a number corresponding to the seconds of the date.', async () => {
          await patchTable1Formula(`DATE.SECOND(COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.SECOND()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (date).')
        })
      })
      describe('WEEKDAY', () => {
        it('Return a number corresponding to the day in the week of the date.', async () => {
          await patchTable1Formula(`DATE.WEEKDAY(COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(5)
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.DAY()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (date).')
        })
      })
      describe('WEEKNUM', () => {
        it('Return a number corresponding to the week of the date in the year.', async () => {
          await patchTable1Formula(`DATE.WEEKNUM(COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2)
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.WEEKNUM()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (date).')
        })
      })
      describe('YEAR', () => {
        it('Return a number corresponding to the year of the date.', async () => {
          await patchTable1Formula(`DATE.YEAR(COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2021)
        })
        it('Throw an error if no date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.YEAR()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (date).')
        })
      })
      describe('YEARS', () => {
        it('Return the number of years between two dates (from one column and one function).', async () => {
          await patchTable1Formula(`DATE.YEARS(COLUMN.${columnTable1Date.id}, DATE.DATEADD(COLUMN.${columnTable1Date.id}, 5, "year"))`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(5)
        })
        it('Return the number of years between two dates (from two columns).', async () => {
          await patchTable1Formula(`DATE.YEARS(COLUMN.${columnTable1Date.id}, COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Throw an error if no end date is specified', async () => {
          await expect(
            patchTable1Formula(`DATE.YEARS(COLUMN.${columnTable1Date.id})`),
          ).rejects.toThrowError('Invalid formula: an argument is missing (endDate).')
        })
        it('Throw an error if no start date is specified', async () => {
          await expect(
            patchTable1Formula('DATE.YEARS()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (startDate).')
        })
      })
    })

    describe('Logic functions', () => {
      describe('AND', () => {
        it('Return true if all conditions are true.', async () => {
          await patchTable1Formula('LOGIC.AND(LOGIC.TRUE(), LOGIC.TRUE(), LOGIC.TRUE())')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if one condition is false.', async () => {
          await patchTable1Formula('LOGIC.AND(LOGIC.TRUE(), LOGIC.FALSE(), LOGIC.TRUE())')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if no condition is specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.AND()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (conditions).')
        })
      })
      describe('FALSE', () => {
        it('Return false.', async () => {
          await patchTable1Formula('LOGIC.FALSE()')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
      })
      describe('IF', () => {
        it('Return the first result (string -> text) if the condition is true.', async () => {
          await patchTable1Formula('LOGIC.IF(LOGIC.TRUE(), "IS_TRUE", "IS_FALSE")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('IS_TRUE')
        })
        it('Return the second result (string -> text) if the condition is false.', async () => {
          await patchTable1Formula('LOGIC.IF(LOGIC.FALSE(), "IS_TRUE", "IS_FALSE")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('IS_FALSE')
        })
        it('Return the first result (number -> text) if the condition is true.', async () => {
          await patchTable1Formula('LOGIC.IF(LOGIC.TRUE(), 10.5, 0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('10.5')
        })
        it('Return the first result (boolean -> text) if the condition is true.', async () => {
          await patchTable1Formula('LOGIC.IF(LOGIC.TRUE(), LOGIC.TRUE(), LOGIC.FALSE())')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('true')
        })
        it('Return the first result (date -> text) if the condition is true.', async () => {
          await patchTable1Formula(`LOGIC.IF(LOGIC.TRUE(), COLUMN.${columnTable1Date.id}, COLUMN.${columnTable1Date.id})`)
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(`${rowTable1.data[columnTable1Date.id] as string} 00:00:00`)
        })
        it('Throw an error if the result to return if the condition is false is not specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.IF(LOGIC.FALSE(), "IS_TRUE")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (resultIfFalse).')
        })
        it('Throw an error if the result to return if the condition is true is not specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.IF(LOGIC.FALSE())'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (resultIfTrue).')
        })
        it('Throw an error if the the condition is not specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.IF()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (condition).')
        })
      })
      describe('IFS', () => {
        it('Return the second result associated to the first true condition.', async () => {
          await patchTable1Formula('LOGIC.IFS(LOGIC.FALSE(), "FIRST_RESULT", LOGIC.TRUE(), "SECOND_RESULT")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('SECOND_RESULT')
        })
        it('Return the first result associated to the first true condition.', async () => {
          await patchTable1Formula('LOGIC.IFS(LOGIC.TRUE(), "FIRST_RESULT", LOGIC.FALSE(), "SECOND_RESULT")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('FIRST_RESULT')
        })
        it('Return the first result associated to the first true condition.', async () => {
          await patchTable1Formula('LOGIC.IFS(LOGIC.TRUE(), "FIRST_RESULT", LOGIC.TRUE(), "SECOND_RESULT")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('FIRST_RESULT')
        })
        it('Throw an error if the result to return if the first condition is true is not specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.IFS(LOGIC.TRUE())'),
          ).rejects.toThrowError('Invalid formula: invalid argument (resultIfTrue).')
        })
        it('Throw an error if the result to return if the second condition is true is not specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.IFS(LOGIC.TRUE(), "FIRST_RESULT", LOGIC.FALSE())'),
          ).rejects.toThrowError('Invalid formula: invalid arguments')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.IFS()'),
          ).rejects.toThrowError('Invalid formula: invalid argument (condition).')
        })
      })
      describe('NOT', () => {
        it('Return true is the condition is false.', async () => {
          await patchTable1Formula('LOGIC.NOT(LOGIC.TRUE())')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Return false if one condition is false.', async () => {
          await patchTable1Formula('LOGIC.NOT(LOGIC.FALSE())')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Throw an error if no condition is specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.NOT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (condition).')
        })
      })
      describe('OR', () => {
        it('Return true if at least one condition is true.', async () => {
          await patchTable1Formula('LOGIC.OR(LOGIC.FALSE(), LOGIC.FALSE(), LOGIC.TRUE())')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if all conditions are false.', async () => {
          await patchTable1Formula('LOGIC.OR(LOGIC.FALSE(), LOGIC.FALSE(), LOGIC.FALSE())')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if no condition is specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.OR()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (conditions).')
        })
      })
      describe('SWITCH', () => {
        it('Return the first result associated to the first true condition.', async () => {
          await patchTable1Formula('LOGIC.SWITCH("abcdef", "abcdef", 1, "def", 2, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('1')
        })
        it('Return the second result associated to the first true condition.', async () => {
          await patchTable1Formula('LOGIC.SWITCH("abcdef", "abc", 1, "abcdef", 2, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('2')
        })
        it('Return the default result if there is no matching value and one default value is specified.', async () => {
          await patchTable1Formula('LOGIC.SWITCH("abcdef", "abc", 1, "def", 2, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('3')
        })
        it('Return null if there is no matching value and no default value is specified.', async () => {
          await patchTable1Formula('LOGIC.SWITCH("abcdef", "abc", 1, "def", 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(null)
        })
        it('Throw an error if the result to return if the first condition is true is not specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.SWITCH("abcdef", "abc")'),
          ).rejects.toThrowError('Invalid formula: invalid argument (resultIfMatching).')
        })
        it('Throw an error if only the expression is specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.SWITCH("abcdef")'),
          ).rejects.toThrowError('Invalid formula: invalid argument (pattern)')
        })
        it('Throw an error if no expression is specified', async () => {
          await expect(
            patchTable1Formula('LOGIC.SWITCH()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (expression).')
        })
      })
      describe('TRUE', () => {
        it('Return true.', async () => {
          await patchTable1Formula('LOGIC.TRUE()')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
      })
    })
    describe('Numeric functions', () => {
      describe('ABS', () => {
        it('Return the absolute value of a positive number.', async () => {
          await patchTable1Formula('NUMERIC.ABS(10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Return the absolute value of a negative number.', async () => {
          await patchTable1Formula('NUMERIC.ABS(-10.2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10.2)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.ABS()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
      })
      describe('AVERAGE', () => {
        it('Return the average of several integers.', async () => {
          await patchTable1Formula('NUMERIC.AVERAGE(2, 3, 4, 1)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2.5)
        })
        it('Return the average of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.AVERAGE(2.0, 3.0, 4.0, 1.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2.5)
        })
        it('Return the average of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.AVERAGE(3, 4, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10 / 3)
        })
        it('Return the average of several integer and float numbers.', async () => {
          await patchTable1Formula('NUMERIC.AVERAGE(2, 3.0, 4, 1.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2.5)
        })
        it('Return the specified number if it is the only one.', async () => {
          await patchTable1Formula('NUMERIC.AVERAGE(10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.AVERAGE()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numbers).')
        })
      })
      describe('CEILING', () => {
        it('Round up a positive number to the nearest integer.', async () => {
          await patchTable1Formula('NUMERIC.CEILING(10.2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(11)
        })
        it('Round up a negative number to the nearest integer.', async () => {
          await patchTable1Formula('NUMERIC.CEILING(-10.2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(-10)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.CEILING()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
      })
      describe('DIVIDE', () => {
        it('Return the division of several integers.', async () => {
          await patchTable1Formula('NUMERIC.DIVIDE(10, 2, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2)
        })
        it('Return the division of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.DIVIDE(10.0, 2.0, 2.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2.5)
        })
        it('Return the division of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.DIVIDE(10.0, 3.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10 / 3)
        })
        it('Return the division of several integer and float numbers.', async () => {
          await patchTable1Formula('NUMERIC.DIVIDE(10.0, 2, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2.5)
        })
        it('Return the specified number if it is the only one.', async () => {
          await patchTable1Formula('NUMERIC.DIVIDE(10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Return null if a divisor is zero', async () => {
          await patchTable1Formula('NUMERIC.DIVIDE(10, 0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(null)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.DIVIDE()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numbers).')
        })
      })
      describe('E', () => {
        it('Return the euler number.', async () => {
          await patchTable1Formula('NUMERIC.E()')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(Math.E)
        })
      })
      describe('EQUAL', () => {
        it('Return true if two numbers are equal', async () => {
          await patchTable1Formula('NUMERIC.EQUAL(1, 1)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return true if one integer number is equal to a decimal one', async () => {
          await patchTable1Formula('NUMERIC.EQUAL(1, 1.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if two numbers are not equal', async () => {
          await patchTable1Formula('NUMERIC.EQUAL(1, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if more than two numbers are specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.EQUAL(1, 3, 3)'),
          ).rejects.toThrowError('Invalid formula: invalid arguments.')
        })
        it('Throw an error if only one number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.EQUAL(1)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondNumber).')
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.EQUAL()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstNumber).')
        })
      })
      describe('FLOOR', () => {
        it('Round down a positive number to the nearest integer.', async () => {
          await patchTable1Formula('NUMERIC.FLOOR(10.2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Round down a negative number to the nearest integer.', async () => {
          await patchTable1Formula('NUMERIC.FLOOR(-10.2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(-11)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.FLOOR()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
      })
      describe('GREATER', () => {
        it('Return true if the first number is greater than the second one', async () => {
          await patchTable1Formula('NUMERIC.GREATER(2, 1)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return true if one integer number is greater to a decimal one', async () => {
          await patchTable1Formula('NUMERIC.GREATER(2, 1.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if the numbers are equal', async () => {
          await patchTable1Formula('NUMERIC.GREATER(2, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Return false if the first number is lower than the second one', async () => {
          await patchTable1Formula('NUMERIC.GREATER(1, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if more than two numbers are specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.GREATER(1, 3, 3)'),
          ).rejects.toThrowError('Invalid formula: invalid arguments.')
        })
        it('Throw an error if only one number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.GREATER(1)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondNumber).')
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.GREATER()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstNumber).')
        })
      })
      describe('GREATEREQ', () => {
        it('Return true if the first number is greater than the second one', async () => {
          await patchTable1Formula('NUMERIC.GREATEREQ(2, 1)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return true if one integer number is greater to a decimal one', async () => {
          await patchTable1Formula('NUMERIC.GREATEREQ(2, 1.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return true if the numbers are equal', async () => {
          await patchTable1Formula('NUMERIC.GREATEREQ(2, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if the first number is lower than the second one', async () => {
          await patchTable1Formula('NUMERIC.GREATEREQ(1, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if more than two numbers are specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.GREATEREQ(1, 3, 3)'),
          ).rejects.toThrowError('Invalid formula: invalid arguments.')
        })
        it('Throw an error if only one number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.GREATEREQ(1)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondNumber).')
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.GREATEREQ()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstNumber).')
        })
      })
      describe('INT', () => {
        it('Round down a positive number to the nearest integer.', async () => {
          await patchTable1Formula('NUMERIC.INT(10.2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Round up a positive number to the nearest integer.', async () => {
          await patchTable1Formula('NUMERIC.INT(10.7)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(11)
        })
        it('Round up a negative number to the nearest integer.', async () => {
          await patchTable1Formula('NUMERIC.INT(-10.2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(-10)
        })
        it('Round down a negative number to the nearest integer.', async () => {
          await patchTable1Formula('NUMERIC.INT(-10.7)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(-11)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.INT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
      })
      describe('LESS', () => {
        it('Return true if the first number is lower than the second one', async () => {
          await patchTable1Formula('NUMERIC.LESS(1, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return true if one integer number is lower to a decimal one', async () => {
          await patchTable1Formula('NUMERIC.LESS(1, 2.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if the numbers are equal', async () => {
          await patchTable1Formula('NUMERIC.LESS(2, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Return false if the first number is greater than the second one', async () => {
          await patchTable1Formula('NUMERIC.LESS(2, 1)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if more than two numbers are specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.LESS(1, 3, 3)'),
          ).rejects.toThrowError('Invalid formula: invalid arguments.')
        })
        it('Throw an error if only one number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.LESS(1)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondNumber).')
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.LESS()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstNumber).')
        })
      })
      describe('LESSEQ', () => {
        it('Return true if the first number is lower than the second one', async () => {
          await patchTable1Formula('NUMERIC.LESSEQ(1, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return true if one integer number is lower to a decimal one', async () => {
          await patchTable1Formula('NUMERIC.LESSEQ(1, 2.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return true if the numbers are equal', async () => {
          await patchTable1Formula('NUMERIC.LESSEQ(2, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if the first number is greater than the second one', async () => {
          await patchTable1Formula('NUMERIC.LESSEQ(2, 1)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if more than two numbers are specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.LESSEQ(1, 3, 3)'),
          ).rejects.toThrowError('Invalid formula: invalid arguments.')
        })
        it('Throw an error if only one number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.LESSEQ(1)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondNumber).')
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.LESSEQ()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstNumber).')
        })
      })
      describe('LOG', () => {
        it('Return the result of the logarithm function applied to the number with the specified base.', async () => {
          await patchTable1Formula('NUMERIC.LOG(5, 10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBeCloseTo(Math.log10(5), 5)
        })
        it('Return null if the number is not positive.', async () => {
          await patchTable1Formula('NUMERIC.LOG(0, 10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(null)
        })
        it('Return null if the base is not positive.', async () => {
          await patchTable1Formula('NUMERIC.LOG(5, 0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(null)
        })
        it('Throw an error if the base is not specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.LOG(5)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (base).')
        })
        it('Throw an error if the number is not specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.LOG()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
      })
      describe('MAX', () => {
        it('Return the largest number among the specified ones (integer).', async () => {
          await patchTable1Formula('NUMERIC.MAX(10, 2, 3, 4)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Return the largest number among the specified ones (integer and decimal).', async () => {
          await patchTable1Formula('NUMERIC.MAX(10, 2, 3, 10.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Return the largest number among the specified ones (decimal).', async () => {
          await patchTable1Formula('NUMERIC.MAX(1.2, 1.3, 1.5)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(1.5)
        })
        it('Return the number is only one is specified.', async () => {
          await patchTable1Formula('NUMERIC.MAX(10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.MAX()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numbers).')
        })
      })
      describe('MIN', () => {
        it('Return the smallest number among the specified ones (integer).', async () => {
          await patchTable1Formula('NUMERIC.MIN(10, 2, 3, 4)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2)
        })
        it('Return the smallest number among the specified ones (integer and decimal).', async () => {
          await patchTable1Formula('NUMERIC.MIN(10, 2, 3, 2.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(2)
        })
        it('Return the smallest number among the specified ones (decimal).', async () => {
          await patchTable1Formula('NUMERIC.MIN(1.2, 1.3, 1.5)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(1.2)
        })
        it('Return the number is only one is specified.', async () => {
          await patchTable1Formula('NUMERIC.MIN(10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.MIN()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numbers).')
        })
      })
      describe('MOD', () => {
        it('Return the remainder from the division of two integer numbers.', async () => {
          await patchTable1Formula('NUMERIC.MOD(10, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(1)
        })
        it('Return the remainder from the division of two float numbers.', async () => {
          await patchTable1Formula('NUMERIC.MOD(36.5, 5.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(1.5)
        })
        it('Return the remainder from the division of one integer number by a decimal one.', async () => {
          await patchTable1Formula('NUMERIC.MOD(10, 4.5)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(1)
        })
        it('Return null if the divisor is zero', async () => {
          await patchTable1Formula('NUMERIC.MOD(10, 0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(null)
        })
        it('Throw an error if no divisor is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.MOD(10)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (divisor).')
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.MOD()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
      })
      describe('PI', () => {
        it('Return the PI number.', async () => {
          await patchTable1Formula('NUMERIC.PI()')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(Math.PI)
        })
      })
      describe('PRODUCT', () => {
        it('Return the product of several integers.', async () => {
          await patchTable1Formula('NUMERIC.PRODUCT(10, 2, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(40)
        })
        it('Return the product of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.PRODUCT(10.0, 2.0, 2.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(40)
        })
        it('Return the product of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.PRODUCT(10.5, 3.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(31.5)
        })
        it('Return the product of several integer and float numbers.', async () => {
          await patchTable1Formula('NUMERIC.PRODUCT(10.0, 2.5, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(50)
        })
        it('Return the specified number if it is the only one.', async () => {
          await patchTable1Formula('NUMERIC.PRODUCT(10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.PRODUCT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numbers).')
        })
      })
      describe('ROUND', () => {
        it('Round down a positive number to a specified number of digits.', async () => {
          await patchTable1Formula('NUMERIC.ROUND(10.224, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10.22)
        })
        it('Round up a positive number to a specified number of digits.', async () => {
          await patchTable1Formula('NUMERIC.ROUND(10.226, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10.23)
        })
        it('Round up a negative number to a specified number of digits.', async () => {
          await patchTable1Formula('NUMERIC.ROUND(-10.224, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(-10.22)
        })
        it('Round down a negative number to a specified number of digits.', async () => {
          await patchTable1Formula('NUMERIC.ROUND(-10.227, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(-10.23)
        })
        it('Throw an error if no number of digits is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.ROUND(10.224)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numDigits).')
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.ROUND()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
      })
      describe('SIGN', () => {
        it('Return 1 if the number is positive.', async () => {
          await patchTable1Formula('NUMERIC.SIGN(10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(1)
        })
        it('Return 0 if the number is zero.', async () => {
          await patchTable1Formula('NUMERIC.SIGN(0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Return -1 if the number is negative.', async () => {
          await patchTable1Formula('NUMERIC.SIGN(-10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(-1)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.SIGN()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
      })
      describe('SQRT', () => {
        it('Return the square root of the number.', async () => {
          await patchTable1Formula('NUMERIC.SQRT(9)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(3)
        })
        it('Return the square root of zero.', async () => {
          await patchTable1Formula('NUMERIC.SQRT(0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Return null if the number is negative.', async () => {
          await patchTable1Formula('NUMERIC.SQRT(-10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(null)
        })
        it('Throw an error if the number is not specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.SQRT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
      })
      describe('SUBTRACT', () => {
        it('Return the subtraction of several integers.', async () => {
          await patchTable1Formula('NUMERIC.SUBTRACT(10, 2, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(6)
        })
        it('Return the subtraction of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.SUBTRACT(10.0, 2.0, 2.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(6)
        })
        it('Return the subtraction of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.SUBTRACT(10.5, 3.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(7.5)
        })
        it('Return the subtraction of several integer and float numbers.', async () => {
          await patchTable1Formula('NUMERIC.SUBTRACT(10.0, 2.5, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(5.5)
        })
        it('Return the specified number if it is the only one.', async () => {
          await patchTable1Formula('NUMERIC.SUBTRACT(10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.SUBTRACT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numbers).')
        })
      })
      describe('SUM', () => {
        it('Return the sum of several integers.', async () => {
          await patchTable1Formula('NUMERIC.SUM(10, 2, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(14)
        })
        it('Return the sum of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.SUM(10.0, 2.0, 2.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(14)
        })
        it('Return the sum of several float numbers.', async () => {
          await patchTable1Formula('NUMERIC.SUM(10.5, 3.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(13.5)
        })
        it('Return the sum of several integer and float numbers.', async () => {
          await patchTable1Formula('NUMERIC.SUM(10.0, 2.5, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(14.5)
        })
        it('Return the specified number if it is the only one.', async () => {
          await patchTable1Formula('NUMERIC.SUM(10)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.FLOAT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(10)
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.SUM()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numbers).')
        })
      })
      describe('UNEQUAL', () => {
        it('Return true if two numbers are not equal', async () => {
          await patchTable1Formula('NUMERIC.UNEQUAL(1, 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return true if one integer number is not equal to a decimal one', async () => {
          await patchTable1Formula('NUMERIC.UNEQUAL(1, 2.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if two numbers are equal', async () => {
          await patchTable1Formula('NUMERIC.UNEQUAL(1, 1.0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if more than two numbers are specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.UNEQUAL(1, 3, 3)'),
          ).rejects.toThrowError('Invalid formula: invalid arguments.')
        })
        it('Throw an error if only one number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.UNEQUAL(1)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondNumber).')
        })
        it('Throw an error if no number is specified', async () => {
          await expect(
            patchTable1Formula('NUMERIC.UNEQUAL()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstNumber).')
        })
      })
    })
    describe('Text functions', () => {
      describe('CONCAT', () => {
        it('Return the concatenation of several strings', async () => {
          await patchTable1Formula('TEXT.CONCAT("abc", "def")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abcdef')
        })
        it('Return the string if only one is specified', async () => {
          await patchTable1Formula('TEXT.CONCAT("abc")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abc')
        })
        it('Throw an error if no string is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.CONCAT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (texts).')
        })
      })
      describe('EXACT', () => {
        it('Return true if two strings are equal', async () => {
          await patchTable1Formula('TEXT.EXACT("abc", "abc")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(true)
        })
        it('Return false if two string are not equal', async () => {
          await patchTable1Formula('TEXT.EXACT("abc", "def")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.BOOLEAN)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(false)
        })
        it('Throw an error if more than two strings are specified', async () => {
          await expect(
            patchTable1Formula('TEXT.EXACT("abc", "def", "ghi")'),
          ).rejects.toThrowError('Invalid formula: invalid arguments.')
        })
        it('Throw an error if only one string is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.EXACT("abc")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (secondText).')
        })
        it('Throw an error if no string is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.EXACT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (firstText).')
        })
      })
      describe('FIND', () => {
        it('Return the index of the first occurence of one string into another one', async () => {
          await patchTable1Formula('TEXT.FIND("def", "abcdefghidef")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(4)
        })
        it('Return 0 if one string is not found into another one', async () => {
          await patchTable1Formula('TEXT.FIND("uv", "abcdefghidef")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Throw an error if only one string is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.FIND("abc")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (withinText).')
        })
        it('Throw an error if no string is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.FIND()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (findText).')
        })
      })
      describe('LEFT', () => {
        it('Return the first count characters of a string.', async () => {
          await patchTable1Formula('TEXT.LEFT("abcdef", 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abc')
        })
        it('Return all the characters except the last count ones if the specified number is negative', async () => {
          await patchTable1Formula('TEXT.LEFT("abcdef", -2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abcd')
        })
        it('Throw an error if the number of characters to extract is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.LEFT("abcdef")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numChars).')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.LEFT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (text).')
        })
      })
      describe('LEN', () => {
        it('Return the length of a string.', async () => {
          await patchTable1Formula('TEXT.LEN("abcdef")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(6)
        })
        it('Return the length of a string.', async () => {
          await patchTable1Formula('TEXT.LEN("")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.NUMBER)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(0)
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.LEN()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (text).')
        })
      })
      describe('LOWER', () => {
        it('Return a lowercase copy of a string.', async () => {
          await patchTable1Formula('TEXT.LOWER("AbCdeF")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abcdef')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.LOWER()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (text).')
        })
      })
      describe('MID', () => {
        it('Returns count characters from a specific position of a string.', async () => {
          await patchTable1Formula('TEXT.MID("abcdef", 1, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abc')
        })
        it('Returns count characters from a specific negative position of a string.', async () => {
          await patchTable1Formula('TEXT.MID("abcdef", -1, 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('a')
        })
        it('Returns null if the number of chars is not positive.', async () => {
          await patchTable1Formula('TEXT.MID("abcdef", 1, 0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(null)
        })
        it('Throw an error if the number of characters to extract is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.MID("abcdef", 1)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numChars).')
        })
        it('Throw an error if the start position is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.MID("abcdef")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (startPos).')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.MID()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (text).')
        })
      })
      describe('REPLACE', () => {
        it('Return a copy of the original string in which 2 characters are replaced by a pattern from a specific character.', async () => {
          await patchTable1Formula('TEXT.REPLACE("abcdef", 2, 2, "uv")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('auvdef')
        })
        it('Return a copy of the original string in which 10 characters are replaced by a pattern from a specific character.', async () => {
          await patchTable1Formula('TEXT.REPLACE("abcdef", 2, 10, "uv")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('auv')
        })
        it('Return a copy of the original string in which a negative number of characters are replaced by a pattern from a specific character.', async () => {
          await patchTable1Formula('TEXT.REPLACE("abcdef", 3, -10, "uv")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abuvabcdef')
        })
        it('Returns null if the start position is not positive.', async () => {
          await patchTable1Formula('TEXT.REPLACE("abcdef", 0, 2, "uv")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe(null)
        })
        it('Throw an error if the new pattern is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.REPLACE("abcdef", 2, 10)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (newPattern).')
        })
        it('Throw an error if the number of chars to replace is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.REPLACE("abcdef", 2)'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numChars).')
        })
        it('Throw an error if the start position is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.REPLACE("abcdef")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (startPos).')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.REPLACE()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (text).')
        })
      })
      describe('REPT', () => {
        it('Return a string containing n times the original string.', async () => {
          await patchTable1Formula('TEXT.REPT("abcdef", 2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abcdefabcdef')
        })
        it('Return an empty string if the number of repetitions is equal to zero.', async () => {
          await patchTable1Formula('TEXT.REPT("abcdef", 0)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('')
        })
        it('Return an empty string if the number of repetitions is negative.', async () => {
          await patchTable1Formula('TEXT.REPT("abcdef", -2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('')
        })
        it('Throw an error if the number of repetitions is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.REPT("abcdef")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (number).')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.REPT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (text).')
        })
      })
      describe('RIGHT', () => {
        it('Return the last count characters of a string.', async () => {
          await patchTable1Formula('TEXT.RIGHT("abcdef", 3)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('def')
        })
        it('Return all the characters except the first count ones if the specified number is negative', async () => {
          await patchTable1Formula('TEXT.RIGHT("abcdef", -2)')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('cdef')
        })
        it('Throw an error if the number of characters to extract is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.RIGHT("abcdef")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (numChars).')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.RIGHT()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (text).')
        })
      })
      describe('SUBSTITUTE', () => {
        it('Return a copy of the original string in which a pattern is replaced by a newer one.', async () => {
          await patchTable1Formula('TEXT.SUBSTITUTE("cd", "abcdefcdghi", "UVW")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abUVWefUVWghi')
        })
        it('Return a copy of the original string in which a pattern is replaced by an empty string.', async () => {
          await patchTable1Formula('TEXT.SUBSTITUTE("cd", "abcdefcdghi", "")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abefghi')
        })
        it('Throw an error if the new pattern is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.SUBSTITUTE("cd", "abcdefcdghi")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (newPattern).')
        })
        it('Throw an error if the original text is not specified', async () => {
          await expect(
            patchTable1Formula('TEXT.SUBSTITUTE("cd")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (originalText).')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.SUBSTITUTE()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (searchedText).')
        })
      })
      describe('TEXTJOIN', () => {
        it('Return the concatenation of several strings, separated by a specified separator.', async () => {
          await patchTable1Formula('TEXT.TEXTJOIN("-", "abc", "def")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abc-def')
        })
        it('Return the string if only one is specified', async () => {
          await patchTable1Formula('TEXT.TEXTJOIN("-", "abc")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('abc')
        })
        it('Throw an error if no string is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.TEXTJOIN("-")'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (texts).')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.TEXTJOIN()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (separator).')
        })
      })
      describe('TRIM', () => {
        it('Return a copy of the original string without any spaces at the starting and the ending.', async () => {
          await patchTable1Formula('TEXT.TRIM(" AbC deF ")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('AbC deF')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.TRIM()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (text).')
        })
      })
      describe('UPPER', () => {
        it('Return an uppercase copy of a string.', async () => {
          await patchTable1Formula('TEXT.UPPER("AbCdeF")')
          expect(columnTable1Formula.settings.formula_type_id).toBe(COLUMN_TYPE.TEXT)
          expect(rowTable1.data[columnTable1Formula.id]).toBe('ABCDEF')
        })
        it('Throw an error if no parameter is specified', async () => {
          await expect(
            patchTable1Formula('TEXT.UPPER()'),
          ).rejects.toThrowError('Invalid formula: an argument is missing (text).')
        })
      })
    })
  })
})
