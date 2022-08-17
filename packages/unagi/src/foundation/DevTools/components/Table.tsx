import React from 'react';

interface Item {
  key: string;
  value: string;
}

interface TableProps {
  items: Item[];
}

export function Table({items}: TableProps) {
  const itemsMarkup = items.map(({key, value}) => (
    <div
      key={key}
      style={{display: 'flex', paddingBottom: '1em', flexDirection: 'column'}}
    >
      <span style={{fontWeight: 'bold'}}>{key}</span>
      <span style={{width: '70%', fontFamily: 'monospace'}}>{value}</span>
    </div>
  ));
  return <ul>{itemsMarkup}</ul>;
}
