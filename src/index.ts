/* eslint-disable camelcase */
export enum COLUMN_TYPE {
  BOOLEAN = 1,
  STRING = 2,
  NUMBER = 3,
  FLOAT = 4,
  DATE = 5,
  USER = 6,
  GROUP = 7,
  RELATION_BETWEEN_TABLES = 8,
  LOOKED_UP_COLUMN = 9,
  SINGLE_SELECT = 10,
  MULTI_SELECT = 11,
  FORMULA = 12,
  FILE = 13,
  MULTI_USER = 14,
  MULTI_GROUP = 15,
  TEXT = 16,
  URL = 17,
  GEOMETRY_POINT = 18,
  GEOMETRY_POLYGON = 19,
  GEOMETRY_LINESTRING = 20,
}

export enum COLUMN_GEO_TYPE {
  POINT = COLUMN_TYPE.GEOMETRY_POINT,
  LINESTRING = COLUMN_TYPE.GEOMETRY_LINESTRING,
  POLYGON = COLUMN_TYPE.GEOMETRY_POLYGON,
}

export enum ACTION_BUTTON_TYPE {
  PAGE_DETAIL_TO = 'page_detail_to',
  PROCESS_TRIGGER = 'process_trigger',
}

export enum BUTTON_CLASS {
  DANGER = 'danger',
  WARNING = 'warning',
  SUCCESS = 'success',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

export enum AGGREGATE_FUNCTION {
  SUM = 'SUM',
  AVERAGE = 'AVG',
  COUNT = 'COUNT',
}

export enum USER_PROFILE {
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  USER = 'USER',
  CREATOR = 'CREATOR',
}

export enum GROUP_ROLE {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum BLOCK_TYPE {
  TABLE_VIEW = 'TableView',
  DETAIL_VIEW = 'DetailView',
  PARAGRAPH = 'Paragraph',
  MARKDOWN = 'Markdown',
  // HEADING = "Heading",
  MEDIA = 'Media',
  KANBAN_VIEW = 'KanbanView',
  // GRIDVIEW = "GridView",
  MAPVIEW = 'MapView',
  MAPDETAILVIEW = 'MapDetailView',
  SYNTHESIS = 'Synthesis',
  ACTIONBUTTON = 'ActionButton',
}

export enum MEDIA_TYPE {
  IMAGE = 'image',
  VIDEO = 'video',
  GALLERY = 'gallery',
  CAROUSEL = 'carousel',
}

export enum ERROR_CODE {
  VIEW_LOCKED = 'VIEW_LOCKED',
  VIEW_USED_IN_BLOCK = 'VIEW_USED_IN_BLOCK',
}

export enum ERROR_LABEL {
  VIEW_LOCKED = 'View is locked',
  VIEW_USED_IN_BLOCK = 'View is used in a Block',
}

export enum GEOMETRY_TYPE {
  POINT = 'Point',
  LINESTRING = 'Linestring',
  POLYGON = 'Polygon',
}

export interface TableViewDefinition {
  id: string;
  columns: {
    id: string;
    column_type_id: COLUMN_TYPE;
    position: number;
    editable: boolean;
    text: string;
    settings: Record<string, unknown>;
    table_id: string;
  }[];
}

export interface TableViewContent {
  data: {
    id: string;
    text: string;
    table_id: string;
    data: Record<string, unknown>;
  }[];
}

export interface Block {
  id: string;
  type: BLOCK_TYPE;
}

export interface ParagraphSettings {
  content: string;
}

export interface BlockParagraph extends Block {
  type: BLOCK_TYPE.PARAGRAPH;
  settings: ParagraphSettings;
}

export interface MarkdownSettings {
  content: string;
}

export interface BlockMarkdown extends Block {
  type: BLOCK_TYPE.MARKDOWN;
  settings: MarkdownSettings;
}

export interface TableViewSettings {
  id: string;
  pageDetailId: string;
  addAllowed: boolean;
  exportAllowed: boolean;
}

export interface BlockTableView extends Block {
  type: BLOCK_TYPE.TABLE_VIEW;
  settings: TableViewSettings;
}

export interface BlockTableViewEnhanced extends BlockTableView {
  definition: TableViewDefinition;
  content: TableViewContent;
}

export interface KanbanSettings {
  /**
   * Id of the table_view in database
   */
  id: string;
  /**
   * View's column id on which the kanban's columns is displayed
   */
  columnId: string;
  /**
   * View's column values to use for creating kanban's columns
   */
  columnValues: {
    valueId: string;
    position: number;
  }[];
}

export interface BlockKanbanView extends Block {
  type: BLOCK_TYPE.KANBAN_VIEW;
  settings: KanbanSettings;
}

export interface MediaSettings {
  displayMode: MEDIA_TYPE;
  medias: {
    name: string;
    srcURL: string;
    type: MEDIA_TYPE.IMAGE | MEDIA_TYPE.VIDEO;
  }[];
}

export interface BlockMedia extends Block {
  type: BLOCK_TYPE.MEDIA;
  settings: MediaSettings;
}

export interface MapSettings {
  id: string;// Id of the table_view in database
  pageDetailId: string; // Id of the detail page
  sources: {
    geometry: GEOMETRY_TYPE; // POINT, LINESTRING, POLYGON
    field: string; // column / field 's UUID
    popup: boolean; // do we display a popup
    popupSettings: { // a popup is like a card
      title: string; // column / field 's UUID
      contentFields: {
        field: string; // column / field's UUID
        class: string; // css class to apply on this field
      }[]
    }
  }[];
}

export interface MapView extends Block {
  type: BLOCK_TYPE.MAPVIEW;
  settings: MapSettings;
}

export interface MapDetailView extends Block {
  type: BLOCK_TYPE.MAPDETAILVIEW;
  settings: MapSettings;
}

export interface SynthesisSettings {
  id: string;// Id of the table_view in database.
  columnId: string; // Id of the column. Select data to display.
  prefix: string; // Add a prefix.
  suffix: string; // Add a suffix.
  aggregate: AGGREGATE_FUNCTION; // Parse data according to a function
}

export interface Synthesis extends Block {
  type: BLOCK_TYPE.SYNTHESIS;
  settings: SynthesisSettings;
}

export interface ActionButtonSettings {
  label: string; // Title of the button
  classButton: BUTTON_CLASS; // Class applied to the button,
  icon: string; // Class icon injected in the button, at the beginning, like NavBar,
  action: ACTION_BUTTON_TYPE; // type
  processId: string; // uuid trigger
  pageDetailId: string; // uuid pageDetail
  pageQueryFieldId: string; // uuid rowId from reference relation_between_table
  options: {
    displayFieldId: string; // "uuid-of-the-field-used-for-display-purpose",
    displayFieldValue: boolean; // true // for the first iteration, we only use BOOLEAN fields
  }
}

export interface ActionButton extends Block {
  type: BLOCK_TYPE.ACTIONBUTTON;
  settings: ActionButtonSettings;
}
