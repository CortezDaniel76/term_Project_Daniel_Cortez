// Daniel Cortez-Sanchez 6/6/24
document.addEventListener("DOMContentLoaded", () => {
    const calendarBody = document.getElementById('calendar-body');
    const calendarHeaderText = document.getElementById('calendar-header-text');
  
    //Load header text from localStorage
    const storedHeaderText = localStorage.getItem('calendarHeaderText');
    if (storedHeaderText) {
        calendarHeaderText.innerText = storedHeaderText;
    }
  
    //header text edit
    calendarHeaderText.addEventListener('click', () => {
        const newHeaderText = prompt('Enter new header text:', calendarHeaderText.innerText);
        if (newHeaderText !== null) {
            calendarHeaderText.innerText = newHeaderText;
            localStorage.setItem('calendarHeaderText', newHeaderText);
        }
    });
  
    function loadCalendarData() {
        return JSON.parse(localStorage.getItem('calendarData')) || {};
    }
  
    function saveCalendarData(data) {
        localStorage.setItem('calendarData', JSON.stringify(data));
    }
  
    function createDayElement(day, eventText) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
  
        if (day > 31) {
            dayElement.classList.add('blocked');
        } else {
            dayElement.innerText = day;
        }
  
        if (eventText) {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event');
            eventElement.innerText = eventText;
            dayElement.appendChild(eventElement);
        }
  
        dayElement.addEventListener('click', () => {
            if (day <= 31) {
                const calendarData = loadCalendarData();
                const existingEventText = calendarData[day] || '';
                const newEventText = prompt('Enter event:', existingEventText);
                if (newEventText !== null) {
                    calendarData[day] = newEventText;
                    saveCalendarData(calendarData);
                    dayElement.innerHTML = `${day}<div class="event">${newEventText}</div>`;
                }
            }
        });
  
        return dayElement;
    }
  
    function renderCalendar() {
        const calendarData = loadCalendarData();
        calendarBody.innerHTML = ''; //Clear existing calendar body
  
        for (let day = 1; day <= 35; day++) {
            const eventText = calendarData[day] || '';
            const dayElement = createDayElement(day, eventText);
            calendarBody.appendChild(dayElement);
        }
    }
  
    document.getElementById('clearEventsButton').addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all events?')) {
            localStorage.removeItem('calendarData');
            renderCalendar();
        }
    });
  
    renderCalendar();
  });
  