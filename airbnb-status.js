const ical = require('node-ical');
const fetch = require('node-fetch');
const dayjs = require('dayjs')
const isSameOrBefore = require("dayjs/plugin/isSameOrBefore");
const isTomorrow = require("dayjs/plugin/isTomorrow");
const isToday = require("dayjs/plugin/isToday");
dayjs.extend(isTomorrow);
dayjs.extend(isSameOrBefore);
dayjs.extend(isToday);
const house = require("./house.json")

// keywords that indicate manual blocks or non-guest events
const BLOCKED_KEYWORDS = ["Airbnb (Not available)"];

const SPECIAL_DATE_TOTAL = house.manual_blocked_min ?? 1

function printToday() {
  const today = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formatted = today.toLocaleDateString('en-US', options);
  console.log(`Today is ${formatted}\n`);
}

function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function formatRange(start, end) {
  return `${formatDate(start)} - ${formatDate(end)}`;b4cd7735c
}

async function fetchReservations(url) {
  const data = await ical.async.fromURL(url);
  const reservations = [];

  for (const k in data) {
    const event = data[k];
    if (event.type !== 'VEVENT') continue;

    const start = new Date(event.start);
    const end = new Date(event.end);
    const guest = event.summary.trim().split(/\r?\n/)[0];

    const dateRange = dayjs(end).diff(start, 'day')
    if (BLOCKED_KEYWORDS.includes(guest) && dateRange <= SPECIAL_DATE_TOTAL  ) continue

    reservations.push({ start, end, guest });

  }

  // sort by start date
  return reservations.sort((a, b) => a.start - b.start);
}

async function showRoomStatus() {
  printToday();
  const today = new Date();

  const cleanDay = new Date();
  if(today.getHours() <= 15) {
    today.setDate(today.getDate() - 1);
  } else {
    cleanDay.setDate(cleanDay.getDate() + 1)
  }
  today.setHours(0, 0, 0, 0); // normalize time

  for (const room of house.rooms) {
    console.log(`${room.name}`);
    let todayStatus = "Vacant";
    let nextReservation = null;

    try {
      const reservations = await fetchReservations(room.url);

      for (const res of reservations) {
        const resStart = new Date(res.start);
        const resEnd = new Date(res.end);
        
        if (dayjs(resStart).isSameOrBefore(dayjs(today), 'day') && dayjs(resEnd).isAfter(dayjs(today), 'day')) {
            const emoji = dayjs(resEnd).isSame(dayjs(cleanDay), 'day') ? '🧹' : ''
            todayStatus = `${formatRange(resStart, resEnd)} ${emoji}`;
        } else if (resStart > today) {
          nextReservation = res;
          break;
        }
      }

      console.log(`- Current: ${todayStatus}`);
      if (nextReservation) {
        console.log(`- Next: ${formatRange(nextReservation.start, nextReservation.end)}`);
      } else {
        console.log("- Next: Unknown");
      }

    } catch (err) {
      console.error(`Error fetching ${room.name}:`, err.message);
    }

    console.log(); // blank line between rooms
  }
}

showRoomStatus();
