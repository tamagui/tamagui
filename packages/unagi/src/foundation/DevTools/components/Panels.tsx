import React, { ComponentProps, useEffect, useState } from 'react'

// import { ClientAnalytics } from '../../Analytics/index.js'
import { Performance } from './Performance.client.js'

export interface Props {
  performance: ComponentProps<typeof Performance>
}

interface BasePanel {
  content: string
}

interface ExternalPanel extends BasePanel {
  url: string
}

interface ComponentPanel extends BasePanel {
  component: React.ReactNode
}

type Navigations = Props['performance']['navigations']

interface Panels {
  performance: ComponentPanel
  graphiql: ExternalPanel
}

const isComponentPanel = (panel: ComponentPanel | ExternalPanel): panel is ComponentPanel =>
  (panel as ComponentPanel).component !== undefined

export function Panels({}: Props) {
  const [selectedPanel, setSelectedPanel] = useState<number>(0)
  const [navigations, setNavigations] = useState<Navigations>([])

  // useEffect(() => {
  //   ClientAnalytics.subscribe(
  //     ClientAnalytics.eventNames.PERFORMANCE,
  //     ({
  //       response_start,
  //       navigation_start,
  //       first_contentful_paint,
  //       largest_contentful_paint,
  //       response_end,
  //       page_load_type,
  //       url,
  //       transfer_size,
  //     }) => {
  //       setNavigations([
  //         ...navigations,
  //         {
  //           ttfb: response_start - navigation_start,
  //           fcp: first_contentful_paint,
  //           lcp: largest_contentful_paint,
  //           duration: response_end - navigation_start,
  //           type: `${page_load_type} load`,
  //           size: transfer_size,
  //           url,
  //         },
  //       ])
  //     }
  //   )
  // }, [setNavigations, navigations])

  const panels = getPanels({ performance: { navigations } })
  const panelComponents = panels.map((obj, index) =>
    isComponentPanel(obj) ? (
      <div key={obj.content} style={{ display: selectedPanel === index ? 'block' : 'none' }}>
        {obj.component}
      </div>
    ) : null
  )

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <div style={{ borderRight: '1px solid', padding: '1em 0em' }}>
        {panels.map((panel, index) => {
          const active = selectedPanel === index
          const style = {
            padding: '0em 1.25em',
            fontWeight: 'bold',
            textDecoration: active ? 'underline' : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }
          if (isComponentPanel(panel)) {
            return (
              <button
                key={panel.id}
                type="button"
                style={style}
                onClick={() => setSelectedPanel(index)}
              >
                <span>{panel.content}</span>
              </button>
            )
          }
          return (
            <a style={style} target="_blank" rel="noreferrer" href={panel.url} key={panel.url}>
              {panel.content}
              <span>↗</span>
            </a>
          )
        })}
      </div>
      <div style={{ padding: '1em', width: '100%' }}>
        {panelComponents[selectedPanel ? selectedPanel : 0]}
      </div>
    </div>
  )
}

function getPanels({ performance }: Props) {
  const panels: Panels = {
    performance: {
      content: 'Performance',
      component: <Performance {...performance} />,
    },
    graphiql: {
      content: 'GraphiQL',
      url: '/___graphql',
    },
  }

  return Object.keys(panels).map((key) => {
    return { ...panels[key as keyof Panels], id: key }
  })
}
