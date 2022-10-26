// Add your code here. All actions will run unless you explicitly skip them.
// Quick tips!
// Auto-complete is on. Start typing to see ingredient options.
// Hover over any ingredient to see the variable type and an example.
// TypeScript v2.92

let title: string = Feed.newFeedItem.EntryTitle;
let content: string = Feed.newFeedItem.EntryContent;

const magRegex = /(?<=M\s)\d\.\d/;
const depthRegex = /(?<=<dt>Depth<\/dt><dd>)\d+\.*\d*/;
let inNorthKorea = title.toLowerCase().indexOf('north korea') !== -1;

let magnitude;
let magnitudeMatch = title.match(magRegex);
if (magnitudeMatch && magnitudeMatch[0]) {
  magnitude = parseFloat(magnitudeMatch[0]); // magnitude mb
}

let depth;
let depthMatch = content.match(depthRegex);
if (depthMatch && depthMatch[0]) {
  depth = parseFloat(depthMatch[0]); // depth in km
}

if (magnitude && inNorthKorea && depth < 20) {
  // 0.000205174 e^(2.27416 m)
  let calc = Math.round(0.000205174 * Math.E ** (2.27416 * magnitude));
  let message = 'Potential test with yield of ' + calc + ' kilotons at a depth of ' + depth + 'km';
  IfNotifications.sendRichNotification.setTitle('Potential DPRK Nuclear Test');
  IfNotifications.sendRichNotification.setMessage(message);
  PhoneCall.callMyPhone.setMessage(message);
  Sms.sendMeText.setMessage(message + '\n' + Feed.newFeedItem.EntryUrl)
} else {
  IfNotifications.sendRichNotification.skip();
  Sms.sendMeText.skip()
  PhoneCall.callMyPhone.skip()
}
