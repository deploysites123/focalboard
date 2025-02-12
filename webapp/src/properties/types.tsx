import React from 'react'
import {IntlShape} from 'react-intl'

import {Card} from '../blocks/card'
import {Board, IPropertyTemplate, PropertyTypeEnum} from '../blocks/board'
import {Options} from '../components/calculations/options'
import {Utils} from '../utils'

const hashSignToken = '___hash_sign___'
function encodeText(text: string): string {
    return text.replace(/"/g, '""').replace(/#/g, hashSignToken)
}

export type {PropertyTypeEnum} from '../blocks/board'

export type FilterValueType = 'none'|'options'|'boolean'|'text'

export type FilterCondition = {
    id: string
    label: string
}

export type PropertyProps = {
    property: PropertyType,
    card: Card,
    board: Board,
    readOnly: boolean,
    propertyValue: string | string[],
    propertyTemplate: IPropertyTemplate,
    showEmptyPlaceholder: boolean,
}

export abstract class PropertyType {
    isDate = false
    canGroup = false
    canFilter = false
    filterValueType: FilterValueType = "none"
    isReadOnly = false
    calculationOptions = [Options.none, Options.count, Options.countEmpty,
        Options.countNotEmpty, Options.percentEmpty, Options.percentNotEmpty,
        Options.countValue, Options.countUniqueValue]
    displayValue: (value: string | string[] | undefined, card: Card, template: IPropertyTemplate, intl: IntlShape) => string | string[] | undefined
    getDateFrom: (value: string | string[] | undefined, card: Card) => Date
    getDateTo: (value: string | string[] | undefined, card: Card) => Date
    valueLength: (value: string | string[] | undefined, card: Card, template: IPropertyTemplate, intl: IntlShape, fontDescriptor: string, perItemPadding?: number) => number

    constructor() {
        this.displayValue = (value: string | string[] | undefined) => value
        this.getDateFrom = (_: string | string[] | undefined, card: Card) => new Date(card.createAt || 0)
        this.getDateTo = (_: string | string[] | undefined, card: Card) => new Date(card.createAt || 0)
        this.valueLength = (value: string | string[] | undefined, card: Card, template: IPropertyTemplate, intl: IntlShape, fontDescriptor: string): number => {
            const displayValue = this.displayValue(value, card, template, intl) || ''
            return Utils.getTextWidth(displayValue.toString(), fontDescriptor)
        }
    }

    exportValue = (value: string | string[] | undefined, card: Card, template: IPropertyTemplate, intl: IntlShape): string => {
        const displayValue = this.displayValue(value, card, template, intl)
        return `"${encodeText(displayValue as string)}"`
    }


    valueClassName = (readonly: boolean): string => {
        return `octo-propertyvalue${readonly ? ' octo-propertyvalue--readonly' : ''}`
    }

    abstract Editor: React.FunctionComponent<PropertyProps>
    abstract name: string
    abstract type: PropertyTypeEnum
    abstract displayName: (intl: IntlShape) => string
}
