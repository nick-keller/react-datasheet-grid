import React from 'react'
import clsx from 'clsx'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import styles from './index.module.css'
import Simple from '../demos/simple'
import Xxl from '../demos/xxl'
import CodeBlock from '@theme/CodeBlock'
import RotatingText from 'react-rotating-text'
import './style.css'

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">
          A
          <RotatingText
            items={[
              'n Excel-like',
              ' Google sheet-like',
              ' Notion-like',
              'n Airtable-like',
            ]}
          />{' '}
          React component to create beautiful spreadsheets
        </p>
        <div style={{ maxWidth: 500, margin: '40px auto' }}>
          <Simple />
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started"
          >
            Getting started
          </Link>
        </div>
      </div>
    </header>
  )
}

const demoCode = `const [rows, setRows] = useState([])

return (
  <DataSheetGrid
    value={rows}
    onChange={setRows}
    columns={columns}
  />
)`

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <section className={styles.feature}>
        <div>
          <figure>
            <CodeBlock className="language-tsx">{demoCode}</CodeBlock>
          </figure>
          <aside>
            <h2>Easy to use</h2>
            <p>
              React Datasheet Grid is simpler to use than a good old{' '}
              <code>{'<input />'}</code>, just plug your state and you are good
              to go.
            </p>
          </aside>
        </div>
      </section>
      <section className={styles.feature}>
        <div>
          <figure style={{ width: 200, display: 'block' }}>
            <Xxl />
          </figure>
          <aside>
            <h2>Fast</h2>
            <p>
              DSG is optimized for speed and can easily handle{' '}
              <b>hundreds of thousands of rows</b> thanks to its virtualized
              architecture.
            </p>
            <p>
              Renders have been optimized to the strict minimum, follow the{' '}
              <Link to="docs/performance/static-vs-dynamic">
                performance guides
              </Link>{' '}
              to get the most out of DSG.
            </p>
          </aside>
        </div>
      </section>
      <section className={styles.feature}>
        <div style={{ maxWidth: 1100 }}>
          <figure style={{ flex: 2 }}>
            <img src="/img/custom-widgets.png" />
          </figure>
          <aside>
            <h2>Customizable</h2>
            <p>
              Control every <b>behavior</b> of the spreadsheet, implement you
              own <b>widgets</b>, and customize the <b>style</b> of DSG to match
              your app.
            </p>
          </aside>
        </div>
      </section>
      <section className={styles.feature}>
        <h2 style={{ textAlign: 'center' }}>Feature rich</h2>
        <div>
          <figure>
            <img src="/img/logos.png" />
          </figure>
          <aside>
            <ul>
              <li>
                Supports copy / pasting to and from Excel, Google-sheet,
                Notion...
              </li>
              <li>Keyboard navigation and shortcuts fully-supported</li>
              <li>Supports right-clicking and custom context menu</li>
              <li>Supports dragging corner to expand selection</li>
              <li>Smooth animations</li>
              <li>Built with Typescript</li>
            </ul>
            <Link
              className="button button--secondary button--lg"
              to="/docs/features"
            >
              Learn more
            </Link>
          </aside>
        </div>
      </section>
    </Layout>
  )
}
