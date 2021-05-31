/* eslint-disable @typescript-eslint/camelcase */
import { lckServices } from '@/services/lck-api'
import { LckTableView } from '@/services/lck-api/definitions'
import { Paginated } from '@feathersjs/feathers'
import { BaseState } from './state'

class Workspace {
  text = ''
}

class WorkspaceData {
  workspaces: Workspace[] = []
}

class WorkspaceState extends BaseState<WorkspaceData> {
}

export const workspaceState: WorkspaceState = {
  loading: false,
  error: null,
  data: {
    workspaces: []
  }
}

export async function retrieveWorkspaceWithChaptersAndPages (workspaceId: number) {
  workspaceState.loading = true
  try {
    const workspace = await lckServices.workspace.get(workspaceId, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { $eager: 'chapters.[pages]' }
    })
    return {
      ...workspace,
      chapters: workspace.chapters?.map(c => ({
        ...c,
        pages: c.pages?.sort((a, b) => a.position - b.position)
      }))
    }
  } catch (error) {
    workspaceState.error = error
  }
  workspaceState.loading = false
}

export async function retrievePageWithContainersAndBlocks (id: string) {
  workspaceState.loading = true
  try {
    return await lckServices.page.get(id, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: { $eager: 'containers.[blocks]' }
    })
  } catch (error) {
    workspaceState.error = error
  }
  workspaceState.loading = false
}

export async function retrieveViewDefinition (ids: number[], skip = 0) {
  workspaceState.loading = true
  try {
    const result = await lckServices.tableView.find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: {
        $eager: 'columns.[column_type, parents.^]',
        $modifyEager: {
          columns: {
            transmitted: true
          }
        },
        id: {
          $in: ids
        },
        $skip: skip,
        $limit: 10
      }
    }) as Paginated<LckTableView>

    // Reorder the columns of each view
    result.data.forEach(tableView => {
      tableView.columns = tableView.columns?.sort(
        (a: { position: number }, b: { position: number }) => (a.position < b.position ? -1 : 1)
      )
    })
    // Get the next views if there are ones
    if (result.limit + skip < result.total) {
      retrieveViewDefinition(ids, skip + result.limit).then(followingViews => {
        return result.data.concat(followingViews || [])
      })
    }
    return result.data
  } catch (error) {
    workspaceState.error = error
  }
  workspaceState.loading = false
}

export async function retrieveViewData (
  table_view_id: string,
  skip = 0,
  limit = 20,
  sort = {
    createdAt: 1
  },
  filters = {}
) {
  workspaceState.loading = true
  try {
    return await lckServices.tableRow.find({
      // eslint-disable-next-line @typescript-eslint/camelcase
      query: {
        table_view_id,
        $limit: limit,
        $skip: skip,
        $sort: sort,
        ...filters
      }
    })
  } catch (error) {
    workspaceState.error = error
  }
  workspaceState.loading = false
}

export async function retrieveRow (rowId: string) {
  workspaceState.loading = true
  try {
    return await lckServices.tableRow.get(rowId)
  } catch (error) {
    workspaceState.error = error
  }
  workspaceState.loading = false
}
