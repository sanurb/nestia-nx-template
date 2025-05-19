import express from 'express'
import { collectDefaultMetrics, register } from 'prom-client'
import { getServerPort } from './get_server_port'

// a separate express app to serve the metrics listening on a different port
export const startMetricServer = (port: number) => {
  collectDefaultMetrics()

  const metricsApp = express()
  metricsApp.get('/metrics', async (req, res) => {
    const metrics = await register.metrics()
    res.set('Content-Type', register.contentType)
    res.end(metrics)
  })

  const server = metricsApp.listen(port, () => {
    console.log(
      `📊 Metrics listening at http://localhost:${getServerPort(server, port)}`,
    )
  })
  return server
}
