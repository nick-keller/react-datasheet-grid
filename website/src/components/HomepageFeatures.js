import React from 'react'
import clsx from 'clsx'
import styles from './HomepageFeatures.module.css'

const FeatureList = [
  {
    title: 'Easy to Use',
    description: (
      <>
        React Datasheet Grid is simpler to use than a good old{' '}
        <code>{'<input />'}</code>, just plug your state and you are good to go.
      </>
    ),
  },
  {
    title: 'Fast',
    description: (
      <>
        DSG is optimized for speed and can easily handle{' '}
        <b>hundreds of thousands of rows</b> thanks to its virtualized
        architecture.
      </>
    ),
  },
  {
    title: 'Customizable',
    description: (
      <>
        Control every behavior of the spreadsheet, implement you own widgets,
        and customize the style of React Datasheet Grid to match your app.
      </>
    ),
  },
]

function Feature({ title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
