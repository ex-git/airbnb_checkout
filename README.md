# Airbnb Checkout

A simple script to check room availability from Airbnb calendars.

---

## Setup Instructions

### 1. Get the Calendar URL

- Obtain your house or room calendar URL from Airbnb.  
  **Reference**: [Airbnb Calendar Export Guide](https://www.airbnb.com/help/article/1864)

### 2. Create `house.json`

Structure of `house.json`:

```json
{
  "house": "My Airbnb House",
  "manual_blocked_min": "2",
  "rooms": [
    {
      "name": "Room A",
      "url": "https://calendar.airbnb.com/ics/some-calendar-url"
    },
    {
      "name": "Room B",
      "url": "https://calendar.airbnb.com/ics/another-calendar-url"
    }
  ]
}
```

#### Field Descriptions:

- **`house`**: Name of the house.
- **`manual_blocked_min`**: The number of days a manually blocked room will be considered a valid booking.
- **`rooms`**: An array of rooms:
  - **`name`**: The name of the room.
  - **`url`**: The iCal calendar URL for the room.

---

## How to Run

```bash
npm install
node airbnb-status.js
```

The output will be displayed in the console.

## Example Output

```
Today is Tuesday, July 22, 2025

#1
- Current: 7/22 - 7/25 
- Next: 7/28 - 8/31

#2 
- Current: 7/15 - 8/1 
- Next: 8/1 - 8/17

#3
- Current: 7/22 - 7/23 🧹
- Next: 7/23 - 7/24
```

---

## Notes

- Make sure your calendar URLs are publicly accessible.
- This script does not store any data. It only displays the status in real time.