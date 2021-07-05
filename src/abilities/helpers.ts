import app from '../app'
import { COLUMN_TYPE, USER_PROFILE } from '@locokit/lck-glossary'
import { workspace } from '../models/workspace.model'

import { LckAclSet } from '../models/aclset.model'
import { Group } from '../models/group.model'
import { User } from '../models/user.model'
import { database } from '../models/database.model'
import { Paginated } from '@feathersjs/feathers'
import { TableColumn } from '../models/tablecolumn.model'
import { Table } from '../models/table.model'
import { TableRow } from '../models/tablerow.model'
import { AuthenticationResult } from '@feathersjs/authentication/lib'
import { LocalStrategy } from '@feathersjs/authentication-local/lib/strategy'
// import { LckAclTable } from '../models/acltable.model'

export interface SetupData {
  columnTable1GroupId: string
  columnTable1UserId: string
  columnTable2LkdUpGroupId: string
  columnTable2LkdUpUserId: string
  user1: User
  user2: User
  user3: User
  user4: User
  user1Authentication: AuthenticationResult
  user2Authentication: AuthenticationResult
  user3Authentication: AuthenticationResult
  user4Authentication: AuthenticationResult
  group1: Group
  group2: Group
  group3: Group
  group4: Group
  aclset1: LckAclSet
  aclset2: LckAclSet
  aclset3: LckAclSet
  aclset4: LckAclSet
  table1Id: string
  table2Id: string
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function builderTestEnvironment () {
  /**
   * Create all necessary resources for testing use case
   * * several workspaces
   * * several aclset
   * * several groups
   * * several users
   */
  let workspace1: workspace
  let workspace2: workspace
  let database1: database
  let aclset1: LckAclSet
  // let acltable1: LckAclTable
  let aclset2: LckAclSet
  let aclset3: LckAclSet
  let aclset4: LckAclSet
  let group1: Group
  let group2: Group
  let group3: Group
  let group4: Group
  let user1: User
  let user2: User
  let user3: User
  let user4: User
  let user1Authentication: AuthenticationResult
  let user2Authentication: AuthenticationResult
  let user3Authentication: AuthenticationResult
  let user4Authentication: AuthenticationResult

  let table1: Table
  let table2: Table
  let columnTable1Boolean: TableColumn
  let columnTable1Number: TableColumn
  let columnTable1Date: TableColumn
  let columnTable1DateTime: TableColumn
  let columnTable1String: TableColumn
  let columnTable1Float: TableColumn
  let columnTable1User: TableColumn
  let columnTable1Group: TableColumn
  let columnTable1SingleSelect: TableColumn
  let columnTable1MultiSelect: TableColumn
  let columnTable1Formula: TableColumn
  let columnTable1File: TableColumn
  let columnTable1MultiUser: TableColumn
  let columnTable1MultiGroup: TableColumn
  let columnTable1Text: TableColumn
  let columnTable1URL: TableColumn
  let columnTable1GeomPoint: TableColumn
  let columnTable1GeomPolygon: TableColumn
  let columnTable1GeomLinestring: TableColumn
  let columnTable2Ref: TableColumn
  let columnTable2Name: TableColumn
  let columnTable2RelationBetweenTables: TableColumn
  let columnTable2LkdUpGroup: TableColumn
  let columnTable2LkdUpUser: TableColumn
  let row1Table1: TableRow
  let row2Table1: TableRow
  let row3Table1: TableRow
  let row1Table2: TableRow
  let row2Table2: TableRow
  let row3Table2: TableRow

  async function setupWorkspace (): Promise<SetupData> {
    workspace1 = await app.services.workspace.create({
      text: '[record-abilities] Workspace 1',
    })
    workspace2 = await app.services.workspace.create({
      text: '[record-abilities] Workspace 1',
    })
    const workspaceDatabases = await app.service('database').find({
      query: {
        workspace_id: workspace1.id,
        $limit: 1,
      },
    }) as Paginated<database>
    database1 = workspaceDatabases.data[0]
    aclset1 = await app.services.aclset.create({
      label: '[record-abilities] Acl Set 1',
      workspace_id: workspace1.id,
      manager: true,
    })
    aclset2 = await app.services.aclset.create({
      label: '[record-abilities] Acl Set 2',
      workspace_id: workspace1.id,
    })
    aclset3 = await app.services.aclset.create({
      label: '[record-abilities] Acl Set 3',
      workspace_id: workspace2.id,
      manager: true,
    })
    aclset4 = await app.services.aclset.create({
      label: '[record-abilities] Acl Set 4',
      workspace_id: workspace2.id,
    })
    const userPassword = 'locokit'
    const [localStrategy] = app.service('authentication').getStrategies('local') as LocalStrategy[]
    const passwordHashed = await localStrategy.hashPassword(userPassword, {})
    user1 = await app.services.user._create({
      name: 'User 1',
      email: 'record-abilities-user1@locokit.io',
      isVerified: true,
      password: passwordHashed,
      profile: USER_PROFILE.CREATOR,
    }, {})
    user2 = await app.services.user._create({
      name: 'User 2',
      email: 'record-abilities-user2@locokit.io',
      isVerified: true,
      password: passwordHashed,
    }, {})
    user3 = await app.services.user._create({
      name: 'User 3',
      email: 'record-abilities-user3@locokit.io',
      isVerified: true,
      password: passwordHashed,
    }, {})
    user4 = await app.services.user._create({
      name: 'User 4',
      email: 'record-abilities-user4@locokit.io',
      isVerified: true,
      password: passwordHashed,
    }, {})

    user1Authentication = await app.service('authentication').create({
      strategy: 'local',
      email: 'record-abilities-user1@locokit.io',
      password: userPassword,
    }, {})
    user2Authentication = await app.service('authentication').create({
      strategy: 'local',
      email: 'record-abilities-user2@locokit.io',
      password: userPassword,
    }, {})
    user3Authentication = await app.service('authentication').create({
      strategy: 'local',
      email: 'record-abilities-user3@locokit.io',
      password: userPassword,
    }, {})
    user4Authentication = await app.service('authentication').create({
      strategy: 'local',
      email: 'record-abilities-user4@locokit.io',
      password: userPassword,
    }, {})

    group1 = await app.services.group.create({
      name: '[record-abilities] Group 1',
      aclset_id: aclset1.id,
      users: [user1, user4],
    })
    group2 = await app.services.group.create({
      name: '[record-abilities] Group 2',
      aclset_id: aclset2.id,
      users: [user2, user3],
    })
    group3 = await app.services.group.create({
      name: '[record-abilities] Group 3',
      aclset_id: aclset3.id,
      users: [user2],
    })
    group4 = await app.services.group.create({
      name: '[record-abilities] Group 4',
      aclset_id: aclset4.id,
      users: [user1],
    })

    // let user1: User
    // let group1: Group
    const singleSelectOption1UUID = '1efa77d0-c07a-4d3e-8677-2c19c6a26ecd'
    const singleSelectOption2UUID = 'c1d336fb-438f-4709-963f-5f159c147781'
    const singleSelectOption3UUID = '4b50ce84-2450-47d7-9409-2f319b547efd'
    table1 = await app.service('table').create({
      text: 'table1',
      database_id: database1.id,
    })
    columnTable1Boolean = await app.service('column').create({
      text: 'Boolean',
      column_type_id: COLUMN_TYPE.BOOLEAN,
      table_id: table1.id,
    })
    columnTable1Number = await app.service('column').create({
      text: 'Number',
      column_type_id: COLUMN_TYPE.NUMBER,
      table_id: table1.id,
    })
    columnTable1Date = await app.service('column').create({
      text: 'Date',
      column_type_id: COLUMN_TYPE.DATE,
      table_id: table1.id,
    })
    columnTable1DateTime = await app.service('column').create({
      text: 'Date',
      column_type_id: COLUMN_TYPE.DATETIME,
      table_id: table1.id,
    })
    columnTable1String = await app.service('column').create({
      text: 'String',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table1.id,
    })
    columnTable1Float = await app.service('column').create({
      text: 'Float',
      column_type_id: COLUMN_TYPE.FLOAT,
      table_id: table1.id,
    })
    columnTable1User = await app.service('column').create({
      text: 'User',
      column_type_id: COLUMN_TYPE.USER,
      table_id: table1.id,
    })
    columnTable1Group = await app.service('column').create({
      text: 'Group',
      column_type_id: COLUMN_TYPE.GROUP,
      table_id: table1.id,
    })
    columnTable1SingleSelect = await app.service('column').create({
      text: 'SingleSelect',
      column_type_id: COLUMN_TYPE.SINGLE_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          [singleSelectOption1UUID]: {
            label: 'option 1',
          },
          [singleSelectOption2UUID]: {
            label: 'option 2',
          },
          [singleSelectOption3UUID]: {
            label: 'option 3',
          },
        },
      },
    })
    columnTable1MultiSelect = await app.service('column').create({
      text: 'MultiSelect',
      column_type_id: COLUMN_TYPE.MULTI_SELECT,
      table_id: table1.id,
      settings: {
        values: {
          [singleSelectOption1UUID]: {
            label: 'option 1',
          },
          [singleSelectOption2UUID]: {
            label: 'option 2',
          },
          [singleSelectOption3UUID]: {
            label: 'option 3',
          },
        },
      },
    })
    columnTable1Formula = await app.service('column').create({
      text: 'Formula',
      column_type_id: COLUMN_TYPE.FORMULA,
      table_id: table1.id,
      settings: {
        formula: '"MyFormulaString"',
      },
    })
    columnTable1File = await app.service('column').create({
      text: 'File',
      column_type_id: COLUMN_TYPE.FILE,
      table_id: table1.id,
    })
    columnTable1MultiUser = await app.service('column').create({
      text: 'MultiUser',
      column_type_id: COLUMN_TYPE.MULTI_USER,
      table_id: table1.id,
    })
    columnTable1MultiGroup = await app.service('column').create({
      text: 'MultiGroup',
      column_type_id: COLUMN_TYPE.MULTI_GROUP,
      table_id: table1.id,
    })
    columnTable1Text = await app.service('column').create({
      text: 'Text',
      column_type_id: COLUMN_TYPE.TEXT,
      table_id: table1.id,
    })
    columnTable1URL = await app.service('column').create({
      text: 'URL',
      column_type_id: COLUMN_TYPE.URL,
      table_id: table1.id,
    })
    columnTable1GeomPoint = await app.service('column').create({
      text: 'POINT',
      column_type_id: COLUMN_TYPE.GEOMETRY_POINT,
      table_id: table1.id,
    })
    columnTable1GeomLinestring = await app.service('column').create({
      text: 'LINESTRING',
      column_type_id: COLUMN_TYPE.GEOMETRY_LINESTRING,
      table_id: table1.id,
    })
    columnTable1GeomPolygon = await app.service('column').create({
      text: 'POLYGON',
      column_type_id: COLUMN_TYPE.GEOMETRY_POLYGON,
      table_id: table1.id,
    })

    table2 = await app.service('table').create({
      text: 'table2',
      database_id: database1.id,
    })
    columnTable2Ref = await app.service('column').create({
      text: 'Ref',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    columnTable2Name = await app.service('column').create({
      text: 'Name',
      column_type_id: COLUMN_TYPE.STRING,
      table_id: table2.id,
    })
    columnTable2RelationBetweenTables = await app.service('column').create({
      text: 'RelationBetweenTables',
      column_type_id: COLUMN_TYPE.RELATION_BETWEEN_TABLES,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
      },
    })
    columnTable2LkdUpUser = await app.service('column').create({
      text: 'LookedUpColumn User',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTables.id,
        foreignField: columnTable1User.id,
      },
    })
    columnTable2LkdUpGroup = await app.service('column').create({
      text: 'LookedUpColumn Group',
      column_type_id: COLUMN_TYPE.LOOKED_UP_COLUMN,
      table_id: table2.id,
      settings: {
        tableId: table1.id,
        localField: columnTable2RelationBetweenTables.id,
        foreignField: columnTable1Group.id,
      },
    })

    row1Table1 = await app.service('row').create({
      table_id: table1.id,
      text: 'Row 1 Table 1',
      data: {
        [columnTable1Boolean.id]: true,
        [columnTable1DateTime.id]: '2021-07-05T12:00:00Z',
        [columnTable1String.id]: 'this is a string',
        [columnTable1User.id]: user1.id,
        [columnTable1Group.id]: group1.id,
      },
    })

    row2Table1 = await app.service('row').create({
      table_id: table1.id,
      text: 'Row 2 Table 1',
      data: {
        [columnTable1Boolean.id]: false,
        [columnTable1DateTime.id]: '2021-07-05T13:00:00Z',
        [columnTable1String.id]: 'this is a string',
        [columnTable1User.id]: user3.id,
        [columnTable1Group.id]: group3.id,
      },
    })

    row3Table1 = await app.service('row').create({
      table_id: table1.id,
      text: 'Row 3 Table 1',
      data: {
        [columnTable1Boolean.id]: true,
        [columnTable1DateTime.id]: '2021-07-05T14:00:00Z',
        [columnTable1String.id]: 'this is a string',
        [columnTable1User.id]: user4.id,
        [columnTable1Group.id]: group2.id,
      },
    })

    row1Table2 = await app.service('row').create({
      table_id: table2.id,
      text: 'Row 1 Table 2',
      data: {
        [columnTable2Name.id]: 'Name 1',
        [columnTable2Ref.id]: 'Ref 1',
        [columnTable2RelationBetweenTables.id]: row1Table1.id,
      },
    })

    row2Table2 = await app.service('row').create({
      table_id: table2.id,
      text: 'Row 2 Table 2',
      data: {
        [columnTable2Name.id]: 'Name 2',
        [columnTable2Ref.id]: 'Ref 2',
        [columnTable2RelationBetweenTables.id]: row2Table1.id,
      },
    })

    row3Table2 = await app.service('row').create({
      table_id: table2.id,
      text: 'Row 3 Table 2',
      data: {
        [columnTable2Name.id]: 'Name 3',
        [columnTable2Ref.id]: 'Ref 3',
        [columnTable2RelationBetweenTables.id]: row3Table1.id,
      },
    })

    return {
      table1Id: table1.id,
      table2Id: table2.id,
      columnTable1GroupId: columnTable1Group.id,
      columnTable1UserId: columnTable1User.id,
      columnTable2LkdUpUserId: columnTable2LkdUpUser.id,
      columnTable2LkdUpGroupId: columnTable2LkdUpGroup.id,
      user1,
      user2,
      user3,
      user4,
      user1Authentication,
      user2Authentication,
      user3Authentication,
      user4Authentication,
      group1,
      group2,
      group3,
      group4,
      aclset1,
      aclset2,
      aclset3,
      aclset4,
    }
  }

  async function teardownWorkspace (): Promise<void> {
    await app.service('row').remove(row1Table1.id)
    await app.service('row').remove(row2Table1.id)
    await app.service('row').remove(row3Table1.id)
    await app.service('row').remove(row1Table2.id)
    await app.service('row').remove(row2Table2.id)
    await app.service('row').remove(row3Table2.id)

    await app.service('column').remove(columnTable2RelationBetweenTables.id)
    await app.service('column').remove(columnTable2LkdUpGroup.id)
    await app.service('column').remove(columnTable2LkdUpUser.id)
    await app.service('column').remove(columnTable2Ref.id)
    await app.service('column').remove(columnTable2Name.id)

    await app.service('column').remove(columnTable1Boolean.id)
    await app.service('column').remove(columnTable1Number.id)
    await app.service('column').remove(columnTable1Date.id)
    await app.service('column').remove(columnTable1String.id)
    await app.service('column').remove(columnTable1Float.id)
    await app.service('column').remove(columnTable1User.id)
    await app.service('column').remove(columnTable1Group.id)
    await app.service('column').remove(columnTable1SingleSelect.id)
    await app.service('column').remove(columnTable1MultiSelect.id)
    await app.service('column').remove(columnTable1Formula.id)
    await app.service('column').remove(columnTable1File.id)
    await app.service('column').remove(columnTable1MultiUser.id)
    await app.service('column').remove(columnTable1MultiGroup.id)
    await app.service('column').remove(columnTable1Text.id)
    await app.service('column').remove(columnTable1URL.id)
    await app.service('column').remove(columnTable1GeomPoint.id)
    await app.service('column').remove(columnTable1GeomPolygon.id)
    await app.service('column').remove(columnTable1GeomLinestring.id)
    await app.service('table').remove(table1.id)
    await app.service('table').remove(table2.id)

    await app.services.usergroup.remove(`${user4.id},${group1.id}`)
    await app.services.usergroup.remove(`${user1.id},${group1.id}`)
    await app.services.usergroup.remove(`${user3.id},${group1.id}`)
    await app.services.usergroup.remove(`${user2.id},${group2.id}`)
    await app.services.usergroup.remove(`${user3.id},${group2.id}`)
    await app.services.usergroup.remove(`${user2.id},${group3.id}`)
    await app.services.usergroup.remove(`${user1.id},${group4.id}`)

    await app.services.user.remove(user4.id)
    await app.services.user.remove(user3.id)
    await app.services.user.remove(user2.id)
    await app.services.user.remove(user1.id)
    await app.services.group.remove(group4.id)
    await app.services.group.remove(group3.id)
    await app.services.group.remove(group2.id)
    await app.services.group.remove(group1.id)
    await app.services.aclset.remove(aclset4.id)
    await app.services.aclset.remove(aclset3.id)
    await app.services.aclset.remove(aclset2.id)
    await app.services.aclset.remove(aclset1.id)
    await app.services.workspace.remove(workspace1.id)
    await app.services.workspace.remove(workspace2.id)
  }

  return {
    setupWorkspace,
    teardownWorkspace,
  }
}
