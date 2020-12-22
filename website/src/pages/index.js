import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import classnames from 'classnames'
import React from 'react'

import styles from './styles.module.css'

const features = [
  {
    content: (
      <p>
        SnackUI builds on react-native-web making it faster and lighter on web,
        meaning you can <strong>share more code</strong> between your mobile app
        and web app.
      </p>
    ),
    // image: (
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     viewBox="0 0 512 512"
    //     className={styles.featureImage}
    //   >
    //     <polygon points="428.772 55.96 196.737 288.922 83.228 174.957 .013 258.516 196.69 456.039 511.987 139.488" />
    //   </svg>
    // ),
    imageAlign: 'top',
    title: 'Native + Web without sacrifices',
  },
  {
    content: (
      <p>
        Stunning performance with an optimizing compiler that flattens your
        views and extracts atomic CSS. Write naturally with inline, typed style
        properties, SnackUI handles the rest.
      </p>
    ),
    // image: (
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     viewBox="0 0 512 512"
    //     className={styles.featureImage}
    //   >
    //     <path d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z" />
    //   </svg>
    // ),
    imageAlign: 'top',
    title: 'Unmatched Performance',
  },
  {
    content: (
      <p>
        SnackUI gives you simple building blocks on top of react-native-web,
        with Stack views inspired by SwiftUI. It eliminates entire classes of
        maintenance and bugs.
      </p>
    ),
    // image: (
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     viewBox="0 0 66 66"
    //     className={styles.featureImage}
    //   >
    //     <g>
    //       <path d="M64,32h-2.9C60.6,17.3,48.7,5.4,34,4.9V2c0-0.6-0.4-1-1-1s-1,0.4-1,1v2.9C17.3,5.4,5.4,17.3,4.9,32H2 c-0.6,0-1,0.4-1,1s0.4,1,1,1h2.9C5.4,48.7,17.3,60.6,32,61.1V64c0,0.6,0.4,1,1,1s1-0.4,1-1v-2.9C48.7,60.6,60.6,48.7,61.1,34H64 c0.6,0,1-0.4,1-1S64.6,32,64,32z M34,59.1v-2.9c0-0.6-0.4-1-1-1s-1,0.4-1,1v2.9C18.4,58.6,7.4,47.6,6.9,34h2.9c0.6,0,1-0.4,1-1 s-0.4-1-1-1H6.9C7.4,18.4,18.4,7.4,32,6.9v2.9c0,0.6,0.4,1,1,1s1-0.4,1-1V6.9C47.6,7.4,58.6,18.4,59.1,32h-2.9c-0.6,0-1,0.4-1,1 s0.4,1,1,1h2.9C58.6,47.6,47.6,58.6,34,59.1z" />
    //       <path d="M26.9,17c1.3,0,2.6,0.6,3.5,1.6c-2.2,1-3.5,3.3-3.6,5.6c-0.2,2.9,1.9,5.4,6.1,5.4c4.5,0,6.2-2.2,6.2-5 c0-2.6-1.5-5-3.6-6c0.9-1,2.2-1.5,3.5-1.5c0.5,0,1-0.5,1-1c0-0.6-0.5-1-1-1c-2.2,0-4.3,1.1-5.6,3c-0.3,0-0.6,0-0.9,0 c-1.3-1.9-3.4-3-5.6-3c-0.6,0-1,0.4-1,1C25.9,16.6,26.4,17,26.9,17z" />
    //       <path d="M47.5,39.8c0.3,0.5,0.9,0.6,1.4,0.3c0.5-0.3,0.6-0.9,0.3-1.4L47,35c-0.2-0.3-0.5-0.5-0.9-0.5h-2.7 c-0.5-2.4-1.7-4.6-3.2-6.3c-1.5,2.5-4.3,3.3-7.2,3.3c-3,0-5.4-0.7-7-3.4c-1.6,1.7-2.8,3.9-3.3,6.4h-2.7c-0.3,0-0.7,0.2-0.8,0.5 l-2.3,3.8c-0.3,0.5-0.1,1.1,0.3,1.4c0.5,0.3,1.1,0.1,1.4-0.3l2-3.3h1.8c0,0.5-0.1,1-0.1,1.4c0,1.5,0.2,3,0.6,4.3h-2.9 c-0.3,0-0.7,0.2-0.8,0.5l-2.3,3.8c-0.3,0.5-0.1,1.1,0.3,1.4c0.5,0.3,1.1,0.1,1.4-0.3l2-3.3h3.1c1.9,4,5.4,6.7,9.5,6.7 s7.6-2.7,9.5-6.7h3.1l2,3.3c0.3,0.5,0.9,0.6,1.4,0.3c0.5-0.3,0.6-0.9,0.3-1.4L47,42.8c-0.2-0.3-0.5-0.5-0.9-0.5h-2.9 c0.4-1.4,0.6-2.8,0.6-4.3c0-0.5,0-1-0.1-1.4h1.8L47.5,39.8z" />
    //     </g>
    //   </svg>
    // ),
    imageAlign: 'top',
    title: 'Simple, maintainable stack views',
  },
  {
    content: (
      <p>
        The three most important utilities for building UI's are included, as
        three hooks that all work together and are designed to be optimized into
        performant CSS.
      </p>
    ),
    // image: (
    //   <svg
    //     xmlns="http://www.w3.org/2000/svg"
    //     viewBox="0 0 640 512"
    //     className={styles.featureImage}
    //   >
    //     <path d="M512.1 191l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0L552 6.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zm-10.5-58.8c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.7-82.4 14.3-52.8 52.8zM386.3 286.1l33.7 16.8c10.1 5.8 14.5 18.1 10.5 29.1-8.9 24.2-26.4 46.4-42.6 65.8-7.4 8.9-20.2 11.1-30.3 5.3l-29.1-16.8c-16 13.7-34.6 24.6-54.9 31.7v33.6c0 11.6-8.3 21.6-19.7 23.6-24.6 4.2-50.4 4.4-75.9 0-11.5-2-20-11.9-20-23.6V418c-20.3-7.2-38.9-18-54.9-31.7L74 403c-10 5.8-22.9 3.6-30.3-5.3-16.2-19.4-33.3-41.6-42.2-65.7-4-10.9.4-23.2 10.5-29.1l33.3-16.8c-3.9-20.9-3.9-42.4 0-63.4L12 205.8c-10.1-5.8-14.6-18.1-10.5-29 8.9-24.2 26-46.4 42.2-65.8 7.4-8.9 20.2-11.1 30.3-5.3l29.1 16.8c16-13.7 34.6-24.6 54.9-31.7V57.1c0-11.5 8.2-21.5 19.6-23.5 24.6-4.2 50.5-4.4 76-.1 11.5 2 20 11.9 20 23.6v33.6c20.3 7.2 38.9 18 54.9 31.7l29.1-16.8c10-5.8 22.9-3.6 30.3 5.3 16.2 19.4 33.2 41.6 42.1 65.8 4 10.9.1 23.2-10 29.1l-33.7 16.8c3.9 21 3.9 42.5 0 63.5zm-117.6 21.1c59.2-77-28.7-164.9-105.7-105.7-59.2 77 28.7 164.9 105.7 105.7zm243.4 182.7l-8.2 14.3c-3 5.3-9.4 7.5-15.1 5.4-11.8-4.4-22.6-10.7-32.1-18.6-4.6-3.8-5.8-10.5-2.8-15.7l8.2-14.3c-6.9-8-12.3-17.3-15.9-27.4h-16.5c-6 0-11.2-4.3-12.2-10.3-2-12-2.1-24.6 0-37.1 1-6 6.2-10.4 12.2-10.4h16.5c3.6-10.1 9-19.4 15.9-27.4l-8.2-14.3c-3-5.2-1.9-11.9 2.8-15.7 9.5-7.9 20.4-14.2 32.1-18.6 5.7-2.1 12.1.1 15.1 5.4l8.2 14.3c10.5-1.9 21.2-1.9 31.7 0l8.2-14.3c3-5.3 9.4-7.5 15.1-5.4 11.8 4.4 22.6 10.7 32.1 18.6 4.6 3.8 5.8 10.5 2.8 15.7l-8.2 14.3c6.9 8 12.3 17.3 15.9 27.4h16.5c6 0 11.2 4.3 12.2 10.3 2 12 2.1 24.6 0 37.1-1 6-6.2 10.4-12.2 10.4h-16.5c-3.6 10.1-9 19.4-15.9 27.4l8.2 14.3c3 5.2 1.9 11.9-2.8 15.7-9.5 7.9-20.4 14.2-32.1 18.6-5.7 2.1-12.1-.1-15.1-5.4l-8.2-14.3c-10.4 1.9-21.2 1.9-31.7 0zM501.6 431c38.5 29.6 82.4-14.3 52.8-52.8-38.5-29.6-82.4 14.3-52.8 52.8z" />
    //   </svg>
    // ),
    imageAlign: 'top',
    title: 'Themes, Media Queries, Scales',
  },
]

function Home() {
  const context = useDocusaurusContext()
  const { siteConfig = {} } = context
  return (
    <Layout
      title={`${siteConfig.title} - The first truly native & web compatible UI Library.`}
      description="The first truly native & web compatible UI Library."
    >
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--secondary button--lg',
                styles.getStarted
              )}
              to={useBaseUrl('introduction/getting-started')}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className={classnames('container', styles.featureBlock)}>
              <div className="row">
                {features.map(({ image, title, content }, idx) => (
                  <div key={idx} className={classnames('col', styles.feature)}>
                    {image && (
                      <div className={`text--center ${styles.blockImage}`}>
                        {image}
                      </div>
                    )}
                    <h2 className={`text--center ${styles.featureTitle}`}>
                      {title}
                    </h2>
                    <div className={styles.featureContent}>{content}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <section className="screen-section">
        <img width={1412 / 2} height={662 / 2} src="/img/diagram.png" />
      </section>
    </Layout>
  )
}

export default Home
