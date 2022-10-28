const CampaignScheduler = require('campaign-scheduler')
const sendEmail = async (opts) => console.log(`email contact ${opts.subjectId} using:`, opts)

const main = async () => {

  const Cs = new CampaignScheduler({
    callbacks: { sendEmail },
    db: {
      dialect: 'postgres',
      host: 'localhost',
      username: 'user',
      password: 'pass',
      database: 'postgres',
      schema: undefined,
      force: false,
    }
  })

  await Cs.init()

  // defines campaign with actions
  await Cs.upsertCampaign({
    id: 'myCampaign1',
    active: true,
    actionDefs: [
      {
        id: 'action1',
        interval: { offset: '0days' },
        callback: { id: 'sendEmail', view: 'emailTemplate1' },
      },
      {
        id: 'action2',
        interval: { offset: '2days' },
        callback: { id: 'sendEmail', view: 'emailTemplate2' },
      },
    ],
  })

  // schedules actions at the correct date time for contact 1
  await Cs.schedule('myCampaign1', 'contact', 1)

  // polls and triggers actions at the right time. Action one will trigger
  // immediately, action two will trigger 2 days later as per its interval.
  Cs.addWorker()

}

main()
