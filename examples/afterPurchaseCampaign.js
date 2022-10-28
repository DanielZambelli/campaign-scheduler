const CampaignScheduler = require('campaign-scheduler')
const sendEmail = async (opts) => console.log(`email contact ${opts.subjectId} using:`, opts)
const callbacks = { sendEmail }

const main = async () => {

  const Cs = new CampaignScheduler({ callbacks })

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
        interval: { offset: '2days', time: '10:00' },
        callback: { id: 'sendEmail', view: 'emailTemplate2' },
      },
      {
        id: 'action3',
        interval: { offset: '4days', time: '10:00' },
        callback: { id: 'sendEmail', view: 'emailTemplate3' },
      },
    ],
  })

  // on day1 Jane makes a purchase
  await Cs.schedule('emailCampaign1', 'contact', 1)

  // on day2 Julie makes a purchase
  await Cs.schedule('emailCampaign1', 'contact', 2)

  // on day5 Jenny makes a purchase
  await Cs.schedule('emailCampaign1', 'contact', 3)

  // polls and triggers actions at the right time
  Cs.addWorker()

}

main()
