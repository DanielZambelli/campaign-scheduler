# Campaign Scheduler
**Define and run campaign sequences for individual subjects better than anyone else!** Useful for email campaigns, posting on social and use cases that should occur for a subject like a contact on a predefined schedule or sequence.

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
```

## Background- The challenge
Customers should receive a series of emails after a purchase. The first email should be sent immediately after the purchase event, subsequent emails should be offset by two days but always sent at 10:00 in the morning. 

The system must support multiple customers at various time of purchase, it should keep track and avoid sending the same email twice. See example in the tabel below.

Checking spreadsheets and sending out emails manually is not exactly scalable- so why not automate it using the [after purchase campaign example](https://github.com/DanielZambelli/campaign-scheduler/blob/master/examples/afterPurchaseCampaign.js).

| Customer| Purchase | Email1 | Email2 | Email3 |
|---------|-----------|---------|---------|---------|
| customer#1  | day1      | day1    | day3    | day5    |
| customer#2 | day2      | day2    | day4    | day6    |
| customer#3  | day5      | day5    | day7    | day9    |

## Examples
* [Quick start SQLite example](https://github.com/DanielZambelli/campaign-scheduler/blob/master/examples/quickStartSqlite.js)
* [Quick start Postgres example](https://github.com/DanielZambelli/campaign-scheduler/blob/master/examples/quickStartPostgres.js)
* [After purchase campaign example](https://github.com/DanielZambelli/campaign-scheduler/blob/master/examples/afterPurchaseCampaign.js)

## Engineering notes
* Stupid simple- one controller class using models and utils ????
* Usable thru documentation ????
* Scales vertically and horizontally, supporting concurency and parallel ????
* Reliability thru autotests ????
* Tracebility with log handling ????

## API Reference

#### `constructor(options)`
* `db`, object- database details passed to [Sequelize/ORM](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor)
  * `connectionString`, string, optional
  * `dialect`, string, optional, defaults: sqlite- choose: postgres, mysql, sqlite. [Install driver](https://sequelize.org/docs/v6/getting-started/)
  * `storage`, string, optional, defaults: /tmp/db.sqlite- sqlite dialect storage file path
  * `host`, string, optional
  * `port`, integer, optional
  * `username`, string, optional
  * `password`, string, optional
  * `database`, string, optional
  * `schema`, string, optional
  * `force`, boolean, optional, defaults: false- use cautiously, when true tabels are recreated dropping any data
  * `logging`, boolean, optional, defaults: false
* `worker`, object
  * `callback`, function- when its time to trigger an action, the callback is invoked
  * `concurrency`, integer, optional, defaults: 200- actions to process concurrently
  * `pollInterval`, integer, optional, defaults: 15000- milliseconds between polls

#### `init()`
Connects to database, creates the schema (if provided) and synchronizes the 3 tabels: cs_campaigns, cs_schedules and cs_actions.

#### `define(campaign)`
Creates a new or update an existing campaign. Campaigns are templates defining actions and when they should trigger relatively e.g. in 2 days. Campaigns are used when scheduling:
* `id`, string- e.g. "myCampaign1"
* `active`, boolean, optional, defaults: false- inactivating a campaign removes its scheduled pending actions so that actions are not triggered. Activating a campaign reschdules pending actions
* `actions`, array of objects:
  * `id`, string- unique id e.g. "action1", once set **dont change it**, history depends on it.
  * `interval`, object- when should the scheduled action trigger e.g. { offset: '1day 2hours 25minutes' } or for a random datetime within a range {  offset: '2days-5days', time: '10:00-15:00'}
  * `callback`, object- passed to `worker.callback` function for dispatching. Reqiures `id` and optionally any other properties e.g. `{ id: 'sendEmail', view: 'msgTemplate1' }`

#### `schedule(campaignId, subject)`
Schedules campaign actions for the specific date time (e.g. 2030-01-01-22:00) for the subject:
* `campaignId`, string- e.g. "myCampaign1"
* `subject`, string- e.g. "contact#1"

#### `unschedule(campaignId, subject)`
removes scheduled pending actions for a subject: 
* `campaignId`, string, optional- e.g. "myCampaign1"
* `subject`, string, optional- e.g. "contact#1"

#### `start()`
Polls and trigger pending actions at the right time. @see constructor `worker` options.

#### `stop()`
Stops the worker and releases any queued actions.

#### `calculateActions(campaignId, subject=undefined)`
Uses the campaign template to calculate pending actions with the specific date time:
* `campaignId`, string- e.g. "myCampaign1"
* `subject`, string, optional- e.g. "contact#1"

#### `getCampaigns(options)`
* `id`, string, optional- e.g. "myCampaign1"
* `active`, boolean, optional
* `limit`, integer, optional
* `order`, array of array of string, optional- e.g. [['id','ASC'], ['createdAt','DESC']]

#### `getSchedules(options)`
* `campaignId`, string, optional- e.g. "myCampaign1"
* `subject`, string, optional- e.g. "contact#1"
* `active`, boolean, optional
* `limit`, integer, optional
* `order`, array of array of string, optional- e.g. [['id','ASC'], ['createdAt','DESC']]

#### `getActions(options)`
* `state`, string, optional- pending, processing, completed, failed
* `campaignId`, string, optional- e.g. "myCampaign1"
* `subject`, string, optional- e.g. "contact#1"
* `actionId`, string, optional- e.g. "action1"
* `active`, boolean, optional
* `limit`, integer, optional
* `order`, array of array of string, optional- e.g. [['id','ASC'], ['createdAt','DESC']]

#### `destroy(campaignId, confirm=false)`
Destroys the campaign with its associated schedule and actions. There is no going back after this.
* `campaignId`, string, optional- e.g. "myCampaign1"
* `confirm`, boolean, optional, defaults: false- set to true to confirm the deletion

#### `close()`
Stops the worker and closes the database connection.

## Road map
* logging handling and callback, capture errors and send to log callback
* mariadb schema is created as a database so for this dialect it should change db name... and handle connectionString better, maybe pass to sequlise and inspect sequlsie...
* test oracle db
* test load and performance, processing time and stability under loads
* test worker for processing actions in parallel- e.g. by making two or more instances and pushing start
* get status method- counting campaigns, schedules, actions (pending,completed, failed), drift time
* interval supporting loop recurrence using action id: action1.1,  action1.2,  action1.3
* interval supporting recurrence interval- action should occure once every month on second monday, indefinitely, the next 10 occurrences or until 2025
* interval supporting actions being dependent on other actions so one action is offset by another action
* scheduling- supports staggered start and similiar options when scheduling
