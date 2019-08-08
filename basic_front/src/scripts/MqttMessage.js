import React from 'react'

export default ({ device, value, unit }) =>
  <p>
    <strong>{device}</strong> <em>{value} {unit}</em>
  </p>