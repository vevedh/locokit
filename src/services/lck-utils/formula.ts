/* eslint-disable @typescript-eslint/interface-name-prefix */
import * as monaco from 'monaco-editor'
import i18n from '@/plugins/i18n'

import { COLUMN_TYPE } from '@locokit/lck-glossary'
import { LckTableColumn } from '../lck-api/definitions'

// Common code with API
interface IFormulaBasicParameter {
  name: string;
  type: COLUMN_TYPE | COLUMN_TYPE[];
}

interface IFormulaParameter extends IFormulaBasicParameter {
  required?: boolean;
  multiple?: boolean;
}

interface IFormula {
  params?: Array<IFormulaParameter | IFormulaBasicParameter[]>;
  returnType: COLUMN_TYPE | COLUMN_TYPE[];
}

interface IParsedFormula {
  type: COLUMN_TYPE;
  value: string;
}

// The list of the columns types assimiled to strings to use them in the formulas
export const EQUATED_TO_STRING_TYPES = [
  COLUMN_TYPE.SINGLE_SELECT
]

// The list of the columns types that can be used as function text parameters.
export const TEXT_TYPES = [
  ...EQUATED_TO_STRING_TYPES,
  COLUMN_TYPE.GROUP,
  COLUMN_TYPE.RELATION_BETWEEN_TABLES,
  COLUMN_TYPE.STRING,
  COLUMN_TYPE.TEXT,
  COLUMN_TYPE.URL,
  COLUMN_TYPE.USER
]

// The list of the columns types that can be used as function numeric parameters.
const NUMERIC_TYPES = [
  COLUMN_TYPE.FLOAT,
  COLUMN_TYPE.NUMBER
]

// The list of the original columns types that can be used in a formula
export const implementedInFormulaColumnTypes = [
  ...TEXT_TYPES,
  ...NUMERIC_TYPES,
  COLUMN_TYPE.DATE,
  COLUMN_TYPE.BOOLEAN
]

// Fonctions

enum FUNCTION_CATEGORY {
  DATE = 'DATE',
  LOGIC = 'LOGIC',
  NUMERIC = 'NUMERIC',
  TEXT = 'TEXT',
}

export const functions: Record<FUNCTION_CATEGORY, Record<string, IFormula>> = {
  DATE: {
    DATEADD: {
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE
        },
        {
          name: 'number',
          type: NUMERIC_TYPES
        },
        {
          name: 'unit',
          type: COLUMN_TYPE.STRING
        }
      ],
      returnType: COLUMN_TYPE.DATE
    },
    DAY: {
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    DAYS: {
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE
        },
        {
          name: 'endDate',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    EARLIER: {
      params: [
        {
          name: 'firstDate',
          type: COLUMN_TYPE.DATE
        },
        {
          name: 'secondDate',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    EQUAL: {
      params: [
        {
          name: 'firstDate',
          type: COLUMN_TYPE.DATE
        },
        {
          name: 'secondDate',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    EOMONTH: {
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        },
        {
          name: 'numMonths',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.DATE
    },
    HOUR: {
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    LATER: {
      params: [
        {
          name: 'firstDate',
          type: COLUMN_TYPE.DATE
        },
        {
          name: 'secondDate',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    MINUTE: {
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    MONTH: {
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    MONTHS: {
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE
        },
        {
          name: 'endDate',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    SECOND: {
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    WEEKDAY: {
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    WEEKNUM: {
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    YEAR: {
      params: [
        {
          name: 'date',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    YEARS: {
      params: [
        {
          name: 'startDate',
          type: COLUMN_TYPE.DATE
        },
        {
          name: 'endDate',
          type: COLUMN_TYPE.DATE
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    }
  },
  LOGIC: {
    AND: {
      params: [
        {
          name: 'condition',
          type: COLUMN_TYPE.BOOLEAN,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    FALSE: {
      returnType: COLUMN_TYPE.BOOLEAN
    },
    IF: {
      params: [
        {
          name: 'condition',
          type: COLUMN_TYPE.BOOLEAN
        },
        {
          name: 'resultIfTrue',
          type: implementedInFormulaColumnTypes
        },
        {
          name: 'resultIfFalse',
          type: implementedInFormulaColumnTypes
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    IFS: {
      params: [
        [
          {
            name: 'condition',
            type: COLUMN_TYPE.BOOLEAN
          },
          {
            name: 'resultIfTrue',
            type: implementedInFormulaColumnTypes
          }
        ]
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    NOT: {
      params: [
        {
          name: 'condition',
          type: COLUMN_TYPE.BOOLEAN
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    OR: {
      params: [
        {
          name: 'condition',
          type: COLUMN_TYPE.BOOLEAN,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    SWITCH: {
      params: [
        {
          name: 'expression',
          type: implementedInFormulaColumnTypes
        },
        [
          {
            name: 'pattern',
            type: implementedInFormulaColumnTypes
          },
          {
            name: 'resultIfMatching',
            type: implementedInFormulaColumnTypes
          }
        ],
        {
          name: 'defaultResult',
          type: implementedInFormulaColumnTypes,
          required: false
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    TRUE: {
      returnType: COLUMN_TYPE.BOOLEAN
    }
  },
  NUMERIC: {
    ABS: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    AVERAGE: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    CEILING: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    DIVIDE: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    E: {
      returnType: COLUMN_TYPE.FLOAT
    },
    EQUAL: {
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    FLOOR: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    GREATER: {
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    GREATEREQ: {
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    INT: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    LESS: {
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    LESSEQ: {
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    LOG: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        },
        {
          name: 'base',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    MAX: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    MIN: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    MOD: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        },
        {
          name: 'divisor',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    PI: {
      returnType: COLUMN_TYPE.FLOAT
    },
    PRODUCT: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    ROUND: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        },
        {
          name: 'numDigits',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    SIGN: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    SQRT: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    SUBTRACT: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    SUM: {
      params: [
        {
          name: 'number',
          type: NUMERIC_TYPES,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.FLOAT
    },
    UNEQUAL: {
      params: [
        {
          name: 'firstNumber',
          type: NUMERIC_TYPES
        },
        {
          name: 'secondNumber',
          type: NUMERIC_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    }
  },
  TEXT: {
    CONCAT: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    EXACT: {
      params: [
        {
          name: 'firstText',
          type: TEXT_TYPES
        },
        {
          name: 'secondText',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.BOOLEAN
    },
    FIND: {
      params: [
        {
          name: 'findText',
          type: TEXT_TYPES
        },
        {
          name: 'withinText',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    LEFT: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES
        },
        {
          name: 'numChars',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    LEN: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.NUMBER
    },
    LOWER: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    MID: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES
        },
        {
          name: 'startPos',
          type: COLUMN_TYPE.NUMBER
        },
        {
          name: 'numChars',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    REPLACE: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES
        },
        {
          name: 'startPos',
          type: COLUMN_TYPE.NUMBER
        },
        {
          name: 'numChars',
          type: COLUMN_TYPE.NUMBER
        },
        {
          name: 'newPattern',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    REPT: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES
        },
        {
          name: 'number',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    RIGHT: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES
        },
        {
          name: 'numChars',
          type: COLUMN_TYPE.NUMBER
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    SUBSTITUTE: {
      params: [
        {
          name: 'searchedText',
          type: TEXT_TYPES
        },
        {
          name: 'originalText',
          type: TEXT_TYPES
        },
        {
          name: 'newPattern',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    TEXTJOIN: {
      params: [
        {
          name: 'separator',
          type: COLUMN_TYPE.STRING
        },
        {
          name: 'text',
          type: TEXT_TYPES,
          multiple: true
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    TRIM: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    },
    UPPER: {
      params: [
        {
          name: 'text',
          type: TEXT_TYPES
        }
      ],
      returnType: COLUMN_TYPE.TEXT
    }
  }
}

type CompletionItem = monaco.languages.CompletionItem

export function getDefaultRange (): monaco.IRange {
  return {
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: 1,
    endColumn: 1
  }
}

export function formulaColumnsNamesToIds (formula: string, tableColumns: LckTableColumn[]) {
  // Return the formula with the columns ids instead of the columns names
  return formula.replace(
    /(?<=COLUMN\.{)[^}]+(?=})/g,
    columnName => {
      return (tableColumns.find(column => column.text === columnName))?.id || columnName
    }
  )
}

export function formulaColumnsIdsToNames (formula: string, tableColumns: LckTableColumn[]) {
  // Return the formula with the columns names instead of the columns ids
  return formula.replace(
    /(?<=COLUMN\.{)[a-z0-9-]+(?=})/g,
    columnId => (tableColumns.find(column => column.id === columnId))?.text || columnId
  )
}

/**
 * Returns the suggestions for the monaco editor.
 * @returns an object containing a list of all the suggestions (functions, categories and the column prefix),
 * an object containing the functions suggestions for each category and the signature of each function.
 */
export function getMonacoSuggestions (): {
  allSuggestions: CompletionItem[];
  functionSuggestions: Record<string, CompletionItem[]>;
  functionSignatures: Record<FUNCTION_CATEGORY, Record<string, string>>;
  } {
  // Initialize the suggestions
  const allSuggestions: CompletionItem[] = []
  const functionSuggestions: Record<string, CompletionItem[]> = {}
  // Initialize the signatures
  const functionSignatures: Record<string, Record<string, string>> = {}

  // Default range
  const defaultRange = getDefaultRange()

  // PREFIX_SUGGESTIONS
  // Add a suggestion to type the column prefix
  let currentSuggestion: CompletionItem = {
    label: 'COLUMN',
    kind: monaco.languages.CompletionItemKind.Class,
    documentation: i18n.t('components.formulas.column').toString(),
    insertText: 'COLUMN',
    range: defaultRange
  }
  allSuggestions.push(currentSuggestion)

  // Loop over the functions categories
  for (const categoryName in functions) {
    // Add a suggestion to type the category
    currentSuggestion = {
      label: categoryName,
      kind: monaco.languages.CompletionItemKind.Class,
      documentation: i18n.t(`components.formulas.categories.${categoryName}`).toString(),
      insertText: categoryName,
      range: defaultRange
    }
    allSuggestions.push(currentSuggestion)
    functionSuggestions[categoryName] = []
    const categoryPrefix = categoryName + '.'

    // Loop over the functions of each category
    for (const functionName in functions[categoryName as FUNCTION_CATEGORY]) {
      const currentFunction = functions[categoryName as FUNCTION_CATEGORY][functionName]
      // Text to insert
      let insertTextFunction = `${categoryPrefix}${functionName}(`
      // Function documentation
      let functionSignature = insertTextFunction
      let indexParam = 1
      const separator = ', '
      if (Array.isArray(currentFunction.params)) {
        // Loop over the function parameters
        currentFunction.params.forEach(param => {
          // separator = indexParam === 1 ? '' : ', '
          if (indexParam > 1) {
            // Add a separator between the parameters
            functionSignature += separator
            insertTextFunction += separator
          }

          if (Array.isArray(param)) {
            // Related parameters (i.e : 'IFS(condition1, result1, [condition2, result2, ...])')
            let separatorRelatedParameters = ''
            let currentRelatedParameters1 = ''
            let currentRelatedParameters2 = ''
            param.forEach((relatedParam, relatedParamIndex) => {
              separatorRelatedParameters = relatedParamIndex === 0 ? '' : ', '
              insertTextFunction += `${separatorRelatedParameters}\${${indexParam}:${relatedParam.name}1}`
              currentRelatedParameters1 += `${separatorRelatedParameters}${relatedParam.name}1`
              currentRelatedParameters2 += `${separatorRelatedParameters}${relatedParam.name}2`
              indexParam += 1
            })
            functionSignature += `${currentRelatedParameters1}${separator}[${currentRelatedParameters2}, ...]`
          } else {
            // Single parameter
            insertTextFunction += `\${${indexParam}:${param.name}${param.multiple ? '1' : ''}}`
            if (param.multiple === true) {
              // Multiple parameter
              if (param.required === false) {
                // Facultative parameter
                functionSignature += `[${param.name}1, ...]`
              } else {
                // Required parameter
                functionSignature += `${param.name}1, [${param.name}2, ...]`
              }
            } else if (param.required === false) {
              // Single facultative parameter
              functionSignature += `[${param.name}]`
            } else {
              // Single required parameter
              functionSignature += param.name
            }
            indexParam += 1
          }
        })
      }
      insertTextFunction += ')'
      functionSignature += ')'

      // Save the function signature
      if (!functionSignatures[categoryName]) {
        functionSignatures[categoryName] = {}
      }
      functionSignatures[categoryName][functionName] = functionSignature

      // Save the function suggestion
      currentSuggestion = {
        label: categoryPrefix + functionName,
        kind: monaco.languages.CompletionItemKind.Function,
        documentation: i18n.t(`components.formulas.functions.${categoryName}.${functionName}`).toString(),
        insertText: insertTextFunction,
        commitCharacters: [','],
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        detail: functionSignature,
        range: defaultRange
      }
      functionSuggestions[categoryName].push(currentSuggestion)
      allSuggestions.push(currentSuggestion)
    }
  }
  return {
    allSuggestions,
    functionSuggestions,
    functionSignatures
  }
}
