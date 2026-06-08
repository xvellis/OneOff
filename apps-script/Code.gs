// ─── CONFIGURATION ──────────────────────────────────────────────────────────
// Replace with your Google Calendar ID (found in Calendar settings)
// For primary calendar use: "primary" or your full email address
var CALENDAR_ID = 'YOUR_CALENDAR_ID_HERE';

// Google Places API key (to fetch real Google reviews)
// Get one free at: console.cloud.google.com → Enable "Places API" → Create API Key
// Leave empty to skip reviews (site shows placeholder reviews instead)
var PLACES_API_KEY = '';

// Your Google Maps Place ID — find it at:
// https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
// Or: open your Google Maps listing → share → copy the link → run it through
// https://developers.google.com/maps/documentation/places/web-service/place-id
var PLACE_ID = '';

// Working hours per day (24h format)
// Key: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
var WORKING_HOURS = {
  0: null,          // Sunday: closed
  1: { start: 9, end: 20 },
  2: { start: 9, end: 20 },
  3: { start: 9, end: 20 },
  4: { start: 9, end: 20 },
  5: { start: 9, end: 21 },
  6: { start: 9, end: 18 },
};

// Slot size in minutes (availability grid resolution)
var SLOT_INCREMENT = 30;

// How far ahead in minutes a slot must be to be bookable
var MIN_ADVANCE_MINUTES = 60;

// ─── CORS HEADERS ───────────────────────────────────────────────────────────
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── GET: fetch available slots ─────────────────────────────────────────────
// Query params: action=availability, date=YYYY-MM-DD, duration=<minutes>
function doGet(e) {
  var params = e.parameter || {};

  if (params.action === 'availability') {
    return getAvailability(params.date, parseInt(params.duration) || 30);
  }

  if (params.action === 'reviews') {
    return getReviews();
  }

  return jsonResponse({ error: 'Unknown action. Use action=availability or action=reviews' });
}

function getAvailability(dateStr, durationMin) {
  if (!dateStr) return jsonResponse({ error: 'Missing date parameter' });

  var date = new Date(dateStr + 'T00:00:00');
  var dayOfWeek = date.getDay();
  var hours = WORKING_HOURS[dayOfWeek];

  if (!hours) {
    return jsonResponse({ slots: [], message: 'Closed on this day' });
  }

  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!calendar) {
    return jsonResponse({ error: 'Calendar not found. Check CALENDAR_ID.' });
  }

  // Fetch all events on that day
  var dayStart = new Date(dateStr + 'T00:00:00');
  var dayEnd   = new Date(dateStr + 'T23:59:59');
  var events   = calendar.getEvents(dayStart, dayEnd);

  // Build busy intervals in minutes from midnight
  var busy = events.map(function(ev) {
    return {
      start: (ev.getStartTime() - dayStart) / 60000,
      end:   (ev.getEndTime()   - dayStart) / 60000,
    };
  });

  // Generate candidate slots
  var startMin = hours.start * 60;
  var endMin   = hours.end   * 60;
  var now      = new Date();
  var minAheadMs = MIN_ADVANCE_MINUTES * 60 * 1000;

  var slots = [];
  for (var m = startMin; m + durationMin <= endMin; m += SLOT_INCREMENT) {
    // Skip slots too close in time
    var slotTime = new Date(dateStr + 'T' + minutesToHHMM(m) + ':00');
    if (slotTime - now < minAheadMs) continue;

    // Check overlap with busy intervals
    var slotEnd = m + durationMin;
    var isFree = busy.every(function(b) {
      return slotEnd <= b.start || m >= b.end;
    });

    if (isFree) {
      slots.push(minutesToHHMM(m));
    }
  }

  return jsonResponse({ slots: slots });
}

function minutesToHHMM(min) {
  var h = Math.floor(min / 60);
  var m = min % 60;
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

// ─── POST: create a booking ──────────────────────────────────────────────────
// Body JSON: { name, phone, service, date, time, duration }
function doPost(e) {
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ error: 'Invalid JSON body' });
  }

  var required = ['name', 'phone', 'service', 'date', 'time', 'duration'];
  for (var i = 0; i < required.length; i++) {
    if (!data[required[i]]) {
      return jsonResponse({ error: 'Missing field: ' + required[i] });
    }
  }

  var calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  if (!calendar) {
    return jsonResponse({ error: 'Calendar not found. Check CALENDAR_ID.' });
  }

  // Build start/end Date objects
  var startDt = new Date(data.date + 'T' + data.time + ':00');
  var endDt   = new Date(startDt.getTime() + data.duration * 60 * 1000);

  // Event title and description
  var title = data.name + ' — ' + data.service;
  var desc  = [
    'Πελάτης: ' + data.name,
    'Τηλέφωνο: ' + data.phone,
    'Υπηρεσία: ' + data.service,
    'Διάρκεια: ' + data.duration + ' λεπτά',
    '---',
    'Κλεισμένο online μέσω barbershop.gr',
  ].join('\n');

  try {
    var event = calendar.createEvent(title, startDt, endDt, { description: desc });
    return jsonResponse({
      success: true,
      eventId: event.getId(),
      message: 'Appointment booked successfully',
    });
  } catch (err) {
    return jsonResponse({ error: 'Failed to create event: ' + err.message });
  }
}

// ─── GET: fetch Google reviews via Places API ────────────────────────────────
function getReviews() {
  if (!PLACES_API_KEY || !PLACE_ID) {
    return jsonResponse({ reviews: [], configured: false });
  }

  var url = 'https://maps.googleapis.com/maps/api/place/details/json'
    + '?place_id=' + PLACE_ID
    + '&fields=rating,user_ratings_total,reviews'
    + '&language=el'
    + '&reviews_sort=newest'
    + '&key=' + PLACES_API_KEY;

  try {
    var response = UrlFetchApp.fetch(url);
    var data = JSON.parse(response.getContentText());

    if (data.status !== 'OK') {
      return jsonResponse({ error: 'Places API error: ' + data.status, reviews: [] });
    }

    var result = data.result || {};
    var raw = result.reviews || [];

    var reviews = raw.map(function(r) {
      return {
        author:  r.author_name,
        rating:  r.rating,
        text:    r.text,
        time:    r.relative_time_description,
        photo:   r.profile_photo_url || '',
      };
    });

    return jsonResponse({
      reviews: reviews,
      totalRating: result.rating,
      totalCount:  result.user_ratings_total,
      configured: true,
    });
  } catch (err) {
    return jsonResponse({ error: 'Fetch error: ' + err.message, reviews: [] });
  }
}
