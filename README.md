# Campaign Scheduler
**Run predefined campaign actions better than anyone else!** Useful for email campaigns, posting on social and use cases that should occur on a predefined schedule or sequence.

<p align="left">
  <img width="150px" src="https://raw.githubusercontent.com/DanielZambelli/campaign-scheduler/master/icon.png" />
</p>

## Get started

### Install
```
npm install campaign-scheduler
```

### Quick Start
``` js
const CampaignScheduler = require('campaign-scheduler')
const sendEmail = async (opts) => console.log(`email contact ${opts.subjectId} using:`, opts)

const main = async () => {

  const Cs = new CampaignScheduler({ callbacks: { sendEmail } })

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
```

## Examples
* [Quick start SQLite example](https://github.com/DanielZambelli/campaign-scheduler/blob/master/examples/quickStartSqlite.js)
* [Quick start Postgres example](https://github.com/DanielZambelli/campaign-scheduler/blob/master/examples/quickStartPostgres.js)
* [After purchase campaign example](https://github.com/DanielZambelli/campaign-scheduler/blob/master/examples/afterPurchaseCampaign.js)

## Background- The Problem
Customers should receive a series of emails after a purchase. The first email should be sent immediately after the purchase event, and subsequence emails offset by two days but always sent at 10:00 in the morning. The system must support multiple customers at various time of purchase. See the tabel below.

Checking spreadsheets and sending out emails manually is not exactly scalable, so why not automate it using the [after purchase campaign example](./examples/afterPurchaseCampaign.js).

| Customer| Purchase | Email1 | Email2 | Email3 |
|---------|-----------|---------|---------|---------|
| Jane#1  | day1      | day1    | day2    | day4    |
| Julie#2 | day2      | day2    | day4    | day6    |
| Jenny#3  | day5      | day5    | day7    | day9    |

## API Reference

#### `constructor(options)`
* `callbacks`, object- used by actions e.g. `{ sendEmail: (opts) => 'send email to '+opts.subjectId }`
* `db`, object, optional- connection forwarded to [ORM](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor)
* `db.dialect`, string, optional, defaults: sqlite- choose: postgres, mysql, sqlite. Remember to [install drivers](https://sequelize.org/docs/v6/getting-started/)
* `db.storage`, string, optional, defaults: /tmp/db.sqlite- sqlite dialect storage file path
* `db.host`, string, optional
* `db.port`, integer, optional
* `db.username`, string, optional
* `db.password`, string, optional
* `db.database`, string, optional
* `db.schema`, string, optional
* `db.force`, boolean, optional, defaults: false- use cautiously, when true tabels are recreated dropping any data.
* `db.logging`, boolean, optional, defaults: false

#### `init()`
Connects with database and synchronizes 3 tables, cs_campaigns, cs_schedules and cs_actions in the specified schema.

#### `upsertCampaign(campaign)`
Saves a campaign used for creating schedules: 
* `id`, string- e.g. "myCampaign1"
* `active`, boolean, optional, defaults: false- inactivating a campaign removes its scheduled pending actions so that actions are not triggered. Activating a campaign reschdules yet to be tirggered actions.
* `actionDefs`, array- list of action definitions
* `actionDefs.id`, string- unique id e.g. "action1"
* `actionDefs.interval`, object- e.g. { offset: '1day 2hours 25minutes' } or for a specific range {  offset: '2days-5days', time: '10:00-15:00'}
* `actionDefs.callback`, object- used by actions e.g. `{ sendEmail: (opts) => 'send email to '+opts.subjectId }`(`send sms to ${opts.subjectId}`) }
* `actionDefs.callback.id`, string- referencing a callback e.g. "sendEmail

#### `schedule(campaignId, subject, subjectId)`
schedules campaign actions at the correct date time for the subject: 
* `campaignId`, string, optional- e.g. "myCampaign1"
* `subject`, string, optional- e.g. "contact"
* `subjectId`, integer, optional- e.g. 1

#### `unschedule(campaignId, subject, subjectId)`
removes an existing schedule along with its campaign actions for a subject: 
* `campaignId`, string, optional- e.g. "myCampaign1"
* `subject`, string, optional- e.g. "contact"
* `subjectId`, integer, optional- e.g. 1

#### `addWorker(concurrency, pollMs, campaignIds)`
polls and triggers actions at the right time: 
* `concurrency`, integer, optional, defaults: 200- how many actions to process concurrently
* `pollMs`, integer, optional, defaults: 15000- milliseconds how often to pull
* `campaignIds`, string, optional- only process this campaign e.g. "myCampaign1"

#### `getCampaigns(options)`
* `id`, string, optional- e.g. "myCampaign1"
* `active`, boolean, optional
* `limit`, integer, optional
* `order`, array of array of string, optional- e.g. [['id','ASC'], ['createdAt','DESC']]

#### `destroyCampaign(options)`
* `id`, string, optional
* `active`, boolean, optional
* `limit`, integer, optional

#### `getSchedules(options)`
* `campaignId`, string, optional- e.g. "myCampaign1"
* `subject`, string, optional- e.g. "contact"
* `subjectId`, integer, optional- e.g. 1
* `active`, boolean, optional
* `limit`, integer, optional
* `order`, array of array of string, optional- e.g. [['id','ASC'], ['createdAt','DESC']]

#### `getActions(options)`
* `state`, string, optional- pending, processing, completed, failed
* `campaignId`, string, optional- e.g. "myCampaign1"
* `subject`, string, optional- e.g. "contact"
* `subjectId`, integer, optional- e.g. 1
* `actionId`, string, optional- e.g. "action1"
* `expectedAt`, date, optional
* `completedAt`, date, optional
* `active`, boolean, optional
* `limit`, integer, optional
* `order`, array of array of string, optional- e.g. [['id','ASC'], ['createdAt','DESC']]

#### `getCampaignSchedule(campaignId, subject=undefined, subjectId=undefined)`
#### `getWorker(workerId)`
#### `removeWorkers()`
#### `stopWorkers()`
#### `startWorkers()`
#### `close()`

## Road map
* test load and performance, processing time and stability under loads
* destroyCampaign should remove campaign, schedules, actions... using a confirm param
* get status method- counting campaigns, schedules, actions (pending,completed, failed), drift time
* convert schedule.subjectId to string for greater flexibility
* interval supporting recurrence using action id: action1.1,  action1.2,  action1.3
* actions supporting being dependent on other actions so one action is offset by another action
