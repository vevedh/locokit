import WKT from 'ol/format/WKT'
import Feature from 'ol/Feature'
import GeoJSON, {
  GeoJSONFeature,
  GeoJSONFeatureCollection
} from 'ol/format/GeoJSON'
import {
  CircleLayer,
  CircleLayout,
  CirclePaint,
  FillLayer,
  FillLayout,
  FillPaint,
  LineLayer,
  LineLayout,
  LinePaint,
  LngLatBounds,
  LngLatLike
} from 'mapbox-gl'

import { TranslateResult } from 'vue-i18n'

import {
  BLOCK_TYPE,
  COLUMN_GEO_TYPE,
  COLUMN_TYPE,
  MapSettings,
  MapSourceSettings
} from '@locokit/lck-glossary'

import {
  LckTableColumn,
  LckTableRow,
  LckTableRowData,
  LckTableView,
  LckTableViewColumn
} from '@/services/lck-api/definitions'
import {
  getColumnTypeId,
  getDataFromTableViewColumn
} from '@/services/lck-utils/columns'
import { getArrayDepth } from '@/services/lck-utils/arrays'

const LCK_GEO_STYLE_POINT: CircleLayer = {
  id: 'layer-type-circle',
  type: 'circle',
  paint: {
    'circle-radius': 10,
    'circle-color': '#ea0e0e',
    'circle-stroke-width': 2,
    'circle-stroke-color': '#FFFFFF'
  }
}
const LCK_GEO_STYLE_LINESTRING: LineLayer = {
  id: 'layer-type-line',
  type: 'line',
  paint: {
    'line-width': 15,
    'line-color': '#ea0e0e'
  }
}
const LCK_GEO_STYLE_POLYGON: FillLayer = {
  id: 'layer-type-fill',
  type: 'fill',
  paint: {
    'fill-color': '#ea0e0e'
  }
}

export const GEO_STYLE = {
  Point: LCK_GEO_STYLE_POINT,
  Linestring: LCK_GEO_STYLE_LINESTRING,
  Polygon: LCK_GEO_STYLE_POLYGON
}

export type LckImplementedLayers = CircleLayer | FillLayer | LineLayer

interface LckPopupI18nOptions {
  noReference: string | TranslateResult;
  noData: string | TranslateResult;
  dateFormat: string | TranslateResult;
}

export interface LckGeoResource {
  id: string;
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
  layers: LckImplementedLayers[];
  displayPopup: boolean;
  pageDetailId?: string;
}

export type LckImplementedPaintProperty = keyof (CirclePaint | FillPaint | LinePaint)
export type LckImplementedLayoutProperty = keyof (CircleLayout | FillLayout | LineLayout)

export const isGEOColumn = (columnTypeId: number) => {
  return Object.values(COLUMN_GEO_TYPE).includes(columnTypeId)
}

export const isGeoBlock = (blockType: BLOCK_TYPE) => {
  return [BLOCK_TYPE.MAPVIEW, BLOCK_TYPE.MAPDETAILVIEW].includes(blockType)
}

export const transformEWKTtoFeature = (ewkt: string) => {
  // Split EWKT to get reference coordinate system and geometry object
  const formattedData = ewkt.split(';', 2)
  const srid = formattedData[0].substring(5)
  const wkt = formattedData[1]

  // Transform WKT in OL Feature
  const format = new WKT()
  return format.readFeature(wkt, {
    dataProjection: `EPSG:${srid}`,
    featureProjection: 'EPSG:4326'
  })
}

export function getStyleLayers (geoColumns: LckTableColumn[]): LckImplementedLayers[] {
  const geoTypes = new Set()
  const layers: LckImplementedLayers[] = []

  geoColumns.forEach(geoColumn => geoTypes.add(getColumnTypeId(geoColumn)))
  geoTypes.forEach(geoType => {
    switch (geoType) {
      case COLUMN_TYPE.GEOMETRY_POINT:
        layers.push(GEO_STYLE.Point)
        break
      case COLUMN_TYPE.GEOMETRY_LINESTRING:
        layers.push(GEO_STYLE.Linestring)
        break
      case COLUMN_TYPE.GEOMETRY_POLYGON:
        layers.push(GEO_STYLE.Polygon)
        break
      default:
        console.error('Column type unknown')
    }
  })
  return layers
}

/**
 * Get geo columns
 *  Two possible scenarios:
 *   - if the source field is a valid geo column, only data of this column will be display
 *   - otherwise all data of geo columns
 * @param columns
 * @param sourceSettings
 */
export function getOnlyGeoColumn (
  columns: LckTableViewColumn[],
  sourceSettings: MapSourceSettings
): LckTableViewColumn[] {
  if (sourceSettings.field) {
    const sourceGeoColumn = columns.find(column => column.id === sourceSettings.field && isGEOColumn(column.column_type_id))
    if (sourceGeoColumn) return [sourceGeoColumn]
  }
  return columns.filter(column => isGEOColumn(getColumnTypeId(column)))
}

export function makeGeoJsonFeaturesCollection (
  rows: LckTableRow[],
  geoColumns: LckTableViewColumn[],
  definitionColumns: LckTableViewColumn[],
  sources: MapSourceSettings[],
  i18nOptions: LckPopupI18nOptions
): GeoJSONFeatureCollection {
  const features: Feature[] = []

  const getEWKTFromGeoColumn = (geoColumn: LckTableColumn, data: Record<string, LckTableRowData>): string => {
    switch (geoColumn.column_type_id) {
      case COLUMN_TYPE.LOOKED_UP_COLUMN:
        return (data[geoColumn.id] as { value: string })?.value
      default:
        return data[geoColumn.id] as string
    }
  }

  rows.forEach(row => {
    geoColumns.forEach(geoColumn => {
      const data = getEWKTFromGeoColumn(geoColumn, row.data)
      if (data) {
        const feature = transformEWKTtoFeature(data)
        if (Array.isArray(sources)) {
          sources.forEach(source => {
            /**
             * Add page detail information if needed
             */
            if (source.pageDetailId) {
              feature.setProperties({
                rowId: row.id,
                title: row.text || i18nOptions.noReference
              })
            }
            /**
             * Manage popup information
             */
            if (source.popup && source.popupSettings) {
              feature.setProperties({
                title: row.data[source.popupSettings.title]
              })
              if (source.popupSettings?.contentFields?.length > 0) {
                const allContent: {
                  class?: string;
                  field: {
                    label: string;
                    value: string|number;
                    color?: string;
                    backgroundColor?: string;
                  };
                }[] = []
                source.popupSettings.contentFields.forEach(contentField => {
                  // Get column's title
                  const matchingColumnField = definitionColumns.find(({ id }) => id === contentField.field)
                  if (matchingColumnField) {
                    // Get data from row
                    const data = getDataFromTableViewColumn(
                      matchingColumnField,
                      row.data[contentField.field],
                      i18nOptions
                    )
                    allContent.push({
                      ...contentField,
                      field: data
                    })
                  }
                })

                // Set data in Feature properties
                feature.setProperties({
                  content: allContent
                })
              }
            }
          })
        }
        features.push(feature)
      }
    })
  })

  // Transform OL Feature in Geojson
  const geojsonFormat = new GeoJSON()
  return geojsonFormat.writeFeaturesObject(features)
}

export function getLckGeoResources (
  tableViews: Record<string, LckTableView>,
  data: Record<string, LckTableRow[]>,
  settings: MapSettings,
  i18nOptions: LckPopupI18nOptions
): LckGeoResource[] {
  const lckGeoResources: LckGeoResource[] = []
  settings.sources.forEach((source, index) => {
    const columns = tableViews[source.id]?.columns || []
    // Get the specified column of the source and check that it is a geographic one
    const geoColumn = getOnlyGeoColumn(columns, source)

    if (geoColumn.length > 0) {
      const features: GeoJSONFeatureCollection = makeGeoJsonFeaturesCollection(
        data[source.id],
        geoColumn,
        columns,
        [source],
        i18nOptions
      )
      const layers: LckImplementedLayers[] = getStyleLayers(geoColumn)

      const displayPopup = !!(source.pageDetailId || source.popup)

      lckGeoResources.push({
        id: `features-collection-source-${index}`,
        layers,
        type: features.type,
        features: features.features,
        displayPopup,
        pageDetailId: source.pageDetailId
      })
    }
  })
  return lckGeoResources
}

export function computeBoundingBox (resources: LckGeoResource[]): LngLatBounds {
  const coordinates: LngLatLike[] = []
  /**
   * Collect all coordinates from all features of all resources
   */
  resources.forEach((resource: LckGeoResource) => {
    resource.features.forEach(feature => {
      if (feature.geometry.type !== 'GeometryCollection') {
        // Get at least an Array of array hence the 2
        const featureCoord = feature.geometry.coordinates.flat(getArrayDepth(feature.geometry.coordinates) - 2)
        if (feature.geometry.type === 'Point') {
          coordinates.push(featureCoord as [number, number])
        } else {
          coordinates.push(...(featureCoord as [number, number][]))
        }
      }
    })
  })

  /**
   * if we only have one coordinates, for a bbox, we need two, minimum
   * so we add another coordinates, with the first one
   */
  if (coordinates.length === 1) coordinates.push(coordinates[0])

  /**
   * Now we can compute bounds of all coordinates...
   */
  return coordinates.reduce((bounds, coordinate) => {
    return bounds.extend(coordinate)
  }, new LngLatBounds(coordinates[0], coordinates[1]))
}
