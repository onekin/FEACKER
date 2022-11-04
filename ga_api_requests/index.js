const {google} = require('googleapis')

require('dotenv').config({path : "/Users/RaulMedeiros/git/SCOPIOUS/ga_api_requests/.env"})

const scopes = 'https://www.googleapis.com/auth/analytics.readonly'

const auth = new google.auth.GoogleAuth({keyFile: '/Users/RaulMedeiros/git/SCOPIOUS/ga_api_requests/gaff.json', scopes: scopes})

const viewId = process.env.VIEW_ID
let query = new Object()
const scopiousQuery =  process.argv[2]
async function getData(query) {
    const result = await google.analytics('v3').data.ga.get({
        'auth': auth,
        'ids': 'ga:' + viewId,
        'start-date': '2022-02-01',
        'end-date': 'today',
        'dimensions': query.dimensions,
        'metrics': query.metrics,
        'filters': query.filters,
    })
    console.dir(result.data.rows)
}


function getDimensions(scopiousQuery) {
    let dimensions = scopiousQuery.split("dimensions=")[1].split(";")[0]
    return dimensions;
}
function getMetrics(scopiousQuery) {
    let metrics = scopiousQuery.split("metrics=")[1].split(";")[0]
    return metrics;
}

function getFilters(scopiousQuery) {
    let filters = scopiousQuery.split("filters=")[1]
    return filters;
}
query.dimensions = getDimensions(scopiousQuery)
query.metrics = getMetrics(scopiousQuery)
query.filters = getFilters(scopiousQuery)
getData(query)