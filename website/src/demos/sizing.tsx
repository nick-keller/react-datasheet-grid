import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import CodeBlock from '@theme/CodeBlock'
import './sizing.css'

const Col = ({ basis, grow, shrink, minWidth, maxWidth }) => {
  return (
    <div
      className="preventCodeScroll"
      style={{
        flexGrow: grow ?? 1,
        flexBasis: basis ?? 0,
        flexShrink: shrink ?? 1,
        minWidth: minWidth ?? 100,
        maxWidth,
        overflow: 'hidden',
        background: 'rgb(40, 42, 54)',
      }}
    >
      <CodeBlock className="language-tsx">
        {JSON.stringify(
          { basis, grow, shrink, minWidth, maxWidth },
          null,
          2
        ).replace(/"/g, '')}
      </CodeBlock>
    </div>
  )
}

export const ColumnsSizing = ({ columns }) => {
  return (
    <div
      style={{
        position: 'relative',
        marginBottom: 'var(--ifm-paragraph-margin-bottom)',
      }}
    >
      <Rnd
        style={{
          position: 'relative',
          paddingRight: 10,
        }}
        disableDragging
        default={{ x: 0, y: 0, width: '80%', height: 'auto' }}
        enableResizing={{ right: true }}
        minWidth={50}
        bounds="parent"
      >
        <div
          style={{
            position: 'absolute',
            top: '30%',
            bottom: '30%',
            right: 0,
            width: 4,
            boxShadow: '-1px 0 0 #cdcdcd inset, 1px 0 0 #cdcdcd inset',
          }}
        />
        <div
          style={{
            display: 'flex',
            gap: 1,
            overflow: 'auto',
          }}
        >
          {columns.map((column, i) => (
            <Col key={i} {...column} />
          ))}
        </div>
      </Rnd>
    </div>
  )
}
