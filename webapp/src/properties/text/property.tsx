import {IntlShape} from 'react-intl'

import {PropertyType, PropertyTypeEnum, FilterValueType} from '../types'

import Text from './text'

export default class TextProperty extends PropertyType {
    Editor = Text
    name = 'Text'
    type = 'text' as PropertyTypeEnum
    displayName = (intl:IntlShape) => intl.formatMessage({id: 'PropertyType.Text', defaultMessage: 'Text'})
    canFilter = true
    filterValueType = 'text' as FilterValueType
}
