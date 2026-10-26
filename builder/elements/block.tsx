import {EditableScope} from '@platform/builder/Editable'
import {withCommon} from '@platform/builder/fields'
import type {CmsComponent} from '@platform/core/types/cms'
import type {ElementDef} from '@platform/core/types/layout'

export const blockElement: ElementDef = {
  type: 'block',
  name: 'Website block',
  category: 'Website blocks',
  icon: 'LayoutTemplate',
  hidden: true,
  fields: [],
  render: ({node, settings, attrs, renderBlock, editing, editable}) => {
    const content = renderBlock?.({...settings, _id: node.id} as CmsComponent)
    return (
      <div {...attrs} className={`${attrs.className} lb-el`}>
        {editing ? <EditableScope editable={editable}>{content}</EditableScope> : content}
      </div>
    )
  }
}

export const componentElement: ElementDef = {
  type: 'component',
  name: 'Component',
  category: 'Website blocks',
  icon: 'LayoutTemplate',
  hidden: true,
  description: 'Its content is edited in Components and shows the same on every page using it.',
  fields: withCommon(),
  render: ({node, settings, attrs, renderBlock, editing}) =>
    settings.content || editing ? (
      <div {...attrs} className={`${attrs.className} lb-el`}>
        {settings.content
          ? renderBlock?.({...(settings.content as CmsComponent), _id: node.id})
          : 'This component was deleted.'}
      </div>
    ) : null
}
