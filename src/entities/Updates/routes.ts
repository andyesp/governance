import { Request } from "express"
import routes from "decentraland-gatsby/dist/entities/Route/routes"
import handleAPI from "decentraland-gatsby/dist/entities/Route/handle"
import { auth, WithAuth } from "decentraland-gatsby/dist/entities/Auth/middleware"
import UpdateModel from "./model"
import { UpdateAttributes, UpdateStatus } from "./types"
import RequestError from "decentraland-gatsby/dist/entities/Route/error"
import Time from "decentraland-gatsby/dist/utils/date/Time"

export default routes((route) => {
  const withAuth = auth()
  route.get("/proposals/:proposal/updates", handleAPI(getProposalUpdates))
  route.patch("/proposals/:proposal/updates", withAuth, handleAPI(updateProposalUpdate))
})

async function getProposalUpdates(req: Request<{ proposal: string }>) {
  const proposal_id = req.params.proposal

  if (!proposal_id) {
    throw new RequestError(`Proposal not found: "${proposal_id}"`, RequestError.NotFound)
  }

  return UpdateModel.find<UpdateAttributes>({ proposal_id })
}


async function updateProposalUpdate(req: WithAuth<Request<{ proposal: string }>>) {
  // TODO: Get proposal and check if user is same as proposal creator.
  const update = await UpdateModel.findOne(req.body.id)
  const now = new Date()
  const status = Time(now).isBefore(update.due_date) ? UpdateStatus.Done : UpdateStatus.Late


  await UpdateModel.update<UpdateAttributes>(
    { title: req.body.title, description: req.body.description, status, completion_date: now },
    { id: req.body.id }
  )

  return true
}