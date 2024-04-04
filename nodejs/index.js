const fastify = require('fastify')({ logger: true })
const pgp = require('pg-promise')()
require('dotenv').config()

const db = pgp({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
})

fastify.get('/health_check', async (request, reply) => {
  return 'ok'
})

fastify.get('/readiness_check', async (request, reply) => {
  try {
    const count = await db.any('SELECT COUNT(*) FROM tokens')
    return 'ok'
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send('failed')
  }
})

const get_daily_visits = async () => {
  const result = await db.any(`
    SELECT Date(created_at) AS date,
        Count(*)         AS visits
    FROM   tokens
    WHERE  used_at IS NOT NULL
    GROUP  BY Date(created_at)
  `)

  const response = {}
  for (let row of result) {
    response[row.date] = row.visits
  }

  console.log("Get get_daily_visits successfully");

  return response
}

fastify.get('/api/reports/daily_usage', async (request, reply) => {
  try {
    const response = await get_daily_visits();
    fastify.log.info(response)
    return response
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send('failed')
  }
})

fastify.get('/api/reports/user_visits', async (request, reply) => {
  try {
    const result = await db.any(`
      SELECT t.user_id,
          t.visits,
          users.joined_at
      FROM   (SELECT tokens.user_id,
                  Count(*) AS visits
              FROM   tokens
              GROUP  BY user_id) AS t
          LEFT JOIN users
                  ON t.user_id = users.id
    `)

    const response = {}
    for (let row of result) {
      response[row.user_id] = {
        "visits": row.visits,
        "joined_at": row.joined_at
      }
    }

    return response
  } catch (err) {
    fastify.log.error(err)
    return reply.code(500).send('failed')
  }
})

const start = async () => {
  try {
    await fastify.listen(process.env.APP_PORT, '0.0.0.0')
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

const intervalId = setInterval(function() {
  try {
    get_daily_visits()
  } catch (err) {
    console.error(err)
  }
}, 30 * 1000);

start()
