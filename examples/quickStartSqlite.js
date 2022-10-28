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
        callback: { id: 'sendEmail', view: 'emailTemplate1' }
      },
      {
        id: 'action2',
        interval: { offset: '2days' },
        callback: { id: 'sendEmail', view: 'emailTemplate2' }
      },
    ],
  })

  // using campaign template to schedule actions for contact#1
  await Cs.schedule('emailCampaign1', 'contact#1')

  // triggers action 1 right away, and action 2, two days later
  Cs.start()

}

main()
