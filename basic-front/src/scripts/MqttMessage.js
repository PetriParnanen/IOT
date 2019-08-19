import React from 'react'

export default ({ device, value, unit, measurement }) =>
  <p>
    <strong>{device}</strong> <em>{measurement}</em> <em>{value} {unit}</em>
  </p>