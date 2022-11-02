# Campaign Scheduler
**Define and run campaign sequences for individual subjects better than anyone else!** Useful for email campaigns, posting on social and use cases that should occur on a predefined schedule or sequence.

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

The system must support multiple customers at various time of purchase, and should keep track and avoid sending the same email twice. See example in the tabel below.

Checking spreadsheets and sending out emails manually is not exactly scalable, so why not automate it using the [after purchase campaign example](https://github.com/DanielZambelli/campaign-scheduler/blob/master/examples/afterPurchaseCampaign.js).

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
* Stupid simple- one controller class using models and utils 😌
* Usable thru documentation 📖
* Scales vertically and horizontally, supporting concurency and parallel 🚀
* Reliability thru autotests 👨
* Tracebility with log handling 🖥

## API Reference

#### `constructor(options)`
* `db`, object- database details passed to [Sequelize/ORM](https://sequelize.org/api/v6/class/src/sequelize.js~sequelize#instance-constructor-constructor)
  * `connectionString`, string, optional
  * `dialect`, string, optional, defaults: sqlite- choose: postgres, mysql, sqlite. Remember to [install driver](https://sequelize.org/docs/v6/getting-started/)
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
  * `callback`, function- handle when actions are invoked
  * `concurrency`, integer, optional, defaults: 200- number of actions to process concurrently
  * `pollInterval`, integer, optional, defaults: 15000- milliseconds between polls

#### `init()`
Connects the database, creates the schema if provided and synchronizes the 3 tabels: cs_campaigns, cs_schedules and cs_actions.

#### `define(campaign)`
Saves or updates an existing campaign. Campaigns acts as templates and used when scheduling:
* `id`, string- e.g. "myCampaign1"
* `active`, boolean, optional, defaults: false- inactivating a campaign removes its scheduled pending actions so that actions are not triggered. Activating a campaign reschdules pending actions.
* `actions`, array of objects:
  * `id`, string- unique id e.g. "action1", once set **dont change it**, history depends on it.
  * `interval`, object- when should the scheduled action trigger e.g. { offset: '1day 2hours 25minutes' } or for a random datetime within a range {  offset: '2days-5days', time: '10:00-15:00'}
  * `callback`, object- passed to `worker.callback` function for dispatching. Reqiures `id` and optionally any other properties e.g. `{ id: 'sendEmail', view: 'msgTemplate1' }`

#### `schedule(campaignId, subject)`
Schedules campaign actions at the correct date time for the subject: 
* `campaignId`, string- e.g. "myCampaign1"
* `subject`, string- e.g. "contact#1"

#### `unschedule(campaignId, subject)`
removes scheduled pending actions for a subject: 
* `campaignId`, string, optional- e.g. "myCampaign1"
* `subject`, string, optional- e.g. "contact#1"

#### `start()`
Polls and trigger pending actions at the right time. See constructor `worker` options.

#### `stop()`
Stops the worker and releases any queued actions.

#### `calculateActions(campaignId, subject=undefined)`

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
Destroys campaign and all associated schedule and action track and histroy. There is no going back from this.

#### `close()`
Stops the worker and close the database connection.

## Road map
* BUG: its 23:32 and schduling using interval: { offset: '0days', time: '09:00-17:00' } sets expected to today at 11:00 which is in the past and so its triggered immidetly, it should probably add one day here
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
