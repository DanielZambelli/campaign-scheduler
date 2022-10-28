const CampaignScheduler = require('campaign-scheduler')

const callback = (opts) => {
  switch(opts.callback.id){
    case 'sendEmail':
      console.log(`send email to contact ${opts.subject}`, opts)
    default:
      console.log('unsupported callback', opts)
  }
}

const main = async () => {

  const Cs = await new CampaignScheduler({ worker: { callback } }).init()

  // define a template
  await Cs.define({
    id: 'emailCampaign1',
    active: true,
    actions: [
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
  Cs.start()

}

main()
