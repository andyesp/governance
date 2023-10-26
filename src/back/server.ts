import { databaseInitializer } from 'decentraland-gatsby/dist/entities/Database/utils'
import manager from 'decentraland-gatsby/dist/entities/Job/index'
import { jobInitializer } from 'decentraland-gatsby/dist/entities/Job/utils'
import { gatsbyRegister } from 'decentraland-gatsby/dist/entities/Prometheus/metrics'
import metrics from 'decentraland-gatsby/dist/entities/Prometheus/routes/utils'
import RequestError from 'decentraland-gatsby/dist/entities/Route/error'
import handle, { handleRaw } from 'decentraland-gatsby/dist/entities/Route/handle'
import { withBody, withCors, withDDosProtection, withLogs } from 'decentraland-gatsby/dist/entities/Route/middleware'
import { status } from 'decentraland-gatsby/dist/entities/Route/routes'
import { initializeServices } from 'decentraland-gatsby/dist/entities/Server/handler'
import { serverInitializer } from 'decentraland-gatsby/dist/entities/Server/utils'
import express from 'express'
import { readFileSync } from 'fs'
import { register } from 'prom-client'
import swaggerUi from 'swagger-ui-express'
import ViteExpress from 'vite-express'
import YAML from 'yaml'

import { updateGovernanceBudgets } from '../entities/Budget/jobs'
import { activateProposals, finishProposal, publishBids } from '../entities/Proposal/jobs'
import { DiscordService } from '../services/DiscordService'

import { giveTopVoterBadges, runAirdropJobs } from './jobs/BadgeAirdrop'
import { pingSnapshot } from './jobs/PingSnapshot'
import badges from './routes/badges'
import bid from './routes/bid'
import budget from './routes/budget'
import coauthor from './routes/coauthor'
import committee from './routes/committee'
import common from './routes/common'
import debug from './routes/debug'
import newsletter from './routes/newsletter'
import notification from './routes/notification'
import project from './routes/project'
import proposal from './routes/proposal'
import sitemap from './routes/sitemap'
import snapshot from './routes/snapshot'
import social from './routes/social'
import subscription from './routes/subscription'
import proposalSurveyTopics from './routes/surveyTopics'
import update from './routes/update'
import users from './routes/user'
import vestings from './routes/vestings'
import score from './routes/votes'

const jobs = manager()
jobs.cron('@eachMinute', finishProposal)
jobs.cron('@eachMinute', activateProposals)
jobs.cron('@eachMinute', publishBids)
jobs.cron('@each10Second', pingSnapshot)
jobs.cron('@daily', updateGovernanceBudgets)
jobs.cron('@daily', runAirdropJobs)
jobs.cron('@monthly', giveTopVoterBadges)

const file = readFileSync('static/api.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

swaggerDocument['servers'] = [{ url: process.env.GATSBY_GOVERNANCE_API }]

const app = express()
app.set('x-powered-by', false)
app.use(withLogs())
app.use('/api', [
  status(),
  withDDosProtection(),
  withCors(),
  withBody(),
  committee,
  debug,
  users,
  proposal,
  proposalSurveyTopics,
  score,
  subscription,
  update,
  coauthor,
  budget,
  badges,
  common,
  bid,
  snapshot,
  vestings,
  project,
  newsletter,
  notification,
  handle(async () => {
    throw new RequestError('NotFound', RequestError.NotFound)
  }),
])

app.use(metrics([gatsbyRegister, register]))

app.use(sitemap)
app.use('/', social)

// Balance to profile redirect to preserve previous URL
app.get(
  '/balance',
  handleRaw(async (req, res) => {
    const address = req.query.address
    const websiteUrl = process.env.GATSBY_GOVERNANCE_API?.replace('/api', '')
    const addressParam = address ? `?address=${address}` : ''
    return res.redirect(`${websiteUrl}/profile/${addressParam}`)
  })
)

// Grants to project redirect to preserve previous URL
app.get(
  '/grants',
  handleRaw(async (req, res) => {
    const websiteUrl = process.env.GATSBY_GOVERNANCE_API?.replace('/api', '')
    return res.redirect(`${websiteUrl}/projects`)
  })
)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// app.use(
//   filesystem('public', '404.html', {
//     defaultHeaders: {
//       'Content-Security-Policy': `base-uri 'self'; child-src https:; connect-src https: wss:; default-src 'none'; font-src https: data:; form-action 'self'; frame-ancestors 'none'; frame-src https:; img-src https: data:; manifest-src 'self'; media-src 'self'; object-src 'none'; prefetch-src https: data:; style-src 'unsafe-inline' https: data:; worker-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://decentraland.org https://*.decentraland.org https://cdn.segment.com https://cdn.rollbar.com https://ajax.cloudflare.com https://googleads.g.doubleclick.net https://ssl.google-analytics.com https://tagmanager.google.com https://www.google-analytics.com https://www.google-analytics.com https://www.google.com https://www.googleadservices.com https://www.googletagmanager.com https://verify.walletconnect.com`,
//       'X-Content-Type-Options': 'nosniff',
//       'X-Frame-Options': 'DENY',
//       'strict-transport-security': 'max-age=15552000; includeSubDomains; preload',
//       'referrer-policy': 'strict-origin-when-cross-origin',
//       'x-xss-protection': '1; mode=block',
//       ...(process.env.HEROKU === 'true' && { 'X-Robots-Tag': 'noindex' }),
//     },
//   })
// )

void initializeServices([
  process.env.DATABASE !== 'false' && databaseInitializer(),
  process.env.JOBS !== 'false' && jobInitializer(jobs),
  // process.env.HTTP !== 'false' && serverInitializer(app, process.env.PORT || 4000, process.env.HOST),
])

ViteExpress.listen(app, 8000, () => console.log('Server is listening on port 8000...'))

DiscordService.init()
