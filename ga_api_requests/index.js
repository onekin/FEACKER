const {google} = require('googleapis')

require('dotenv').config({path : process.argv.slice(2)[0]})

const scopes = 'https://www.googleapis.com/auth/analytics.readonly'

const auth = new google.auth.GoogleAuth({keyFile: './gaff.json', scopes: scopes})

const viewId = process.env.VIEW_ID

async function getData() {
    const result = await google.analytics('v3').data.ga.get({
        'auth': auth,
        'ids': 'ga:' + viewId,
        'start-date': '7daysAgo',
        'end-date': 'today',
        'dimensions': 'ga:eventCategory,ga:dimension1',
        'metrics': 'ga:totalEvents',
        'filters': 'ga:eventCategory==Commenting',
    })
    console.dir(result.data.rows)
}
getData()