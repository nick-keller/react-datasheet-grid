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
      <section className={styles.partner}>
        <figure>
          <a
            href="https://tggl.io"
            style={{ position: 'relative', width: '60%' }}
          >
            <svg
              style={{ verticalAlign: 'bottom' }}
              width="100%"
              viewBox="0 0 68 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.76 30.5C14.2667 30.78 12.8 30.9 11.36 30.86C9.93336 30.8333 8.65336 30.5867 7.52002 30.12C6.40002 29.64 5.54669 28.8733 4.96002 27.82C4.42669 26.8333 4.14669 25.8333 4.12002 24.82C4.09336 23.7933 4.08002 22.6333 4.08002 21.34V2.89999H9.52002V21.02C9.52002 21.86 9.52669 22.62 9.54002 23.3C9.56669 23.9667 9.70669 24.5 9.96002 24.9C10.44 25.66 11.2067 26.0733 12.26 26.14C13.3134 26.2067 14.48 26.1533 15.76 25.98V30.5ZM0.400024 13.1V8.9H15.76V13.1H0.400024Z"
                fill="currentColor"
              />
              <path
                d="M62.2656 30.5V1.10001H67.7056V30.5H62.2656Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M47.8847 40.7C46.658 40.7 45.4913 40.5 44.3847 40.1C43.278 39.7133 42.2847 39.1667 41.4047 38.46C40.538 37.7667 39.8313 36.9533 39.2847 36.02L44.3247 33.58C44.6713 34.22 45.1647 34.7067 45.8047 35.04C46.458 35.3733 47.1647 35.54 47.9247 35.54C48.738 35.54 49.5047 35.4 50.2247 35.12C50.9447 34.8533 51.518 34.4467 51.9447 33.9C52.3847 33.3667 52.5913 32.7 52.5647 31.9V29.5241C50.838 30.581 48.8075 31.1902 46.6348 31.1902C43.3785 31.1902 40.4418 29.8219 38.3683 27.6289V31.98C38.3683 32.5133 38.3416 33.0133 38.2883 33.48C38.2483 33.96 38.1683 34.4333 38.0483 34.9C37.7016 36.22 37.0549 37.3067 36.1083 38.16C35.1749 39.0133 34.0283 39.6467 32.6683 40.06C31.3083 40.4867 29.8349 40.7 28.2483 40.7C27.0216 40.7 25.8549 40.5 24.7483 40.1C23.6416 39.7133 22.6483 39.1667 21.7683 38.46C20.9016 37.7667 20.1949 36.9533 19.6483 36.02L24.6883 33.58C25.0349 34.22 25.5283 34.7067 26.1683 35.04C26.8216 35.3733 27.5283 35.54 28.2883 35.54C29.1016 35.54 29.8683 35.4 30.5883 35.12C31.3083 34.8533 31.8816 34.4467 32.3083 33.9C32.7483 33.3667 32.9549 32.7 32.9283 31.9V30.576C31.7693 30.9741 30.5257 31.1902 29.2316 31.1902C22.9495 31.1902 17.8568 26.0975 17.8568 19.8154C17.8568 13.5333 22.9495 8.44058 29.2316 8.44058C30.7826 8.44058 32.261 8.75099 33.6083 9.31307C35.2936 10.0162 36.7736 11.1132 37.9332 12.4891C38.0736 12.3225 38.2187 12.16 38.3683 12.0018C40.4418 9.80886 43.3785 8.44058 46.6348 8.44058C49.0998 8.44058 51.3817 9.22471 53.2447 10.5571C56.0443 12.5595 57.8977 15.8001 58.0047 19.4787C58.0079 19.5905 58.0096 19.7028 58.0096 19.8154C58.0096 19.928 58.0079 20.0402 58.0047 20.152V31.98C58.0047 32.5133 57.978 33.0133 57.9247 33.48C57.8847 33.96 57.8047 34.4333 57.6847 34.9C57.338 36.22 56.6913 37.3067 55.7447 38.16C54.8113 39.0133 53.6647 39.6467 52.3047 40.06C50.9447 40.4867 49.4713 40.7 47.8847 40.7ZM29.217 12.9608C25.3703 12.9608 22.2519 16.0792 22.2519 19.926C22.2519 23.7727 25.3703 26.8911 29.217 26.8911H46.4614C49.7618 26.8911 52.526 24.5957 53.2447 21.5142C53.3637 21.0041 53.4266 20.4724 53.4266 19.926C53.4266 19.3796 53.3637 18.8479 53.2447 18.3377C52.526 15.2562 49.7618 12.9608 46.4614 12.9608H38.3683H38.3099H37.5565H29.217Z"
                fill="currentColor"
              />
            </svg>
            <div
              className="indicator"
              style={{
                position: 'absolute',
                // background: 'black',
                top: '37%',
                width: '13%',
                aspectRatio: '1/1',
                borderRadius: '50%',
              }}
            />
          </a>
        </figure>
        <aside>
          <h2>Partner</h2>
          <p>
            <a href="https://tggl.io/">Tggl.io</a> is the number one solution
            for feature flagging and AB testing. It allows your technical and
            product teams to work together to ship <b>better quality</b> product
            in <b>less time</b> while <b>improving conversion</b>.
          </p>
        </aside>
      </section>
      <hr />
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
