// Add your code here. All actions will run unless you explicitly skip them.
// Quick tips!
// Auto-complete is on. Start typing to see ingredient options.
// Hover over any ingredient to see the variable type and an example.
// TypeScript v2.92
let distance = function (lat2: number, lon2: number) {
  let lat1: number = 41.309;
  let lon1: number = 129.03399;
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
    return Math.round(dist);
  }
};

let parseRegexFloat = function (str: string, re: any) {
  let parsed;
  let match = str.match(re);
  if (match && match[0]) {
    parsed = parseFloat(match[0]);
  }
  return parsed;
};

let title: string = Feed.newFeedItem.EntryTitle;
let content: string = Feed.newFeedItem.EntryContent;

// I like regex
const magRegex = /(?<=M\s)\d\.\d/;
const depthRegex = /(?<=<dt>Depth<\/dt><dd>)\d+\.*\d*/;
const latLongRegex = /\d+\.\d+(?=&deg)/g;
const compassRegex = /(?<=&deg;)\w/g;
// Variables to text
let magnitude = parseRegexFloat(title, magRegex); // In Mb
let depth = parseRegexFloat(content, depthRegex); // In km
let inNorthKorea = title.toLowerCase().indexOf('north korea') !== -1;
let latLongMatch = content.match(latLongRegex);
let compassMatch = content.match(compassRegex);

let lat2;
let lon2;
// We can ignore compass signs since NK is in N lat (+) and E long(+)
if (latLongMatch && latLongMatch[0] && latLongMatch[1]) {
  lat2 = parseFloat(latLongMatch[0]);
  lon2 = parseFloat(latLongMatch[1]);
  if (compassMatch && compassMatch[0] && compassMatch[1]) {
    lat2 *= compassMatch[0] == 'S' ? -1 : 1;
    lon2 *= compassMatch[1] == 'W' ? -1 : 1;
  }
}

let dist = !isNaN(lat2) && !isNaN(lon2) ? distance(lat2, lon2) : 1000000000;

if (magnitude && depth && dist && depth < 20 && dist < 50 && inNorthKorea) {
  // 0.000205174 e^(2.27416 m)
  let calc = Math.round(0.000205174 * Math.E ** (2.27416 * magnitude));
  let message =
    'ALERT' +
    '\nyield: ' +
    calc +
    '\nmagnitude: ' +
    magnitude +
    '\ndepth: ' +
    depth +
    '\ninNorthKorea: ' +
    inNorthKorea +
    '\nDistance ' +
    dist +
    'km';
  IfNotifications.sendRichNotification.setTitle('Potential DPRK Nuclear Test');
  IfNotifications.sendRichNotification.setMessage(message);
  PhoneCall.callMyPhone.setMessage(message);
  Sms.sendMeText.setMessage(message + '\n' + Feed.newFeedItem.EntryUrl)
} else {
  IfNotifications.sendRichNotification.skip();
  Sms.sendMeText.skip()
  PhoneCall.callMyPhone.skip()
}
