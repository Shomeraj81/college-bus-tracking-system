// Sample notification data (can later fetch from DB)
let notifications = [
    {
        id: 1,
        message: "Bus KIIT-07 is delayed by 10 minutes.",
        time: "10 mins ago",
        read: false
    },
    {
        id: 2,
        message: "New bus route added from Patia.",
        time: "1 hour ago",
        read: false
    },
    {
        id: 3,
        message: "Bus KIIT-01 has reached campus.",
        time: "Yesterday",
        read: true
    }
];

window.onload = function () {
    loadNotifications();
};

function loadNotifications() {

    let container = document.getElementById("notificationList");
    container.innerHTML = "";

    notifications.forEach(notification => {

        let card = document.createElement("div");
        card.className = "notification-card" + (notification.read ? "" : " unread");

        card.innerHTML = `
            <div>
                <div class="notification-text">${notification.message}</div>
                <div class="notification-time">${notification.time}</div>
            </div>
            ${!notification.read ? 
                `<button class="mark-btn" onclick="markAsRead(${notification.id})">Mark Read</button>` 
                : ""}
        `;

        container.appendChild(card);
    });
}

function markAsRead(id) {

    notifications = notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
    );

    loadNotifications();
}

function clearAll() {
    notifications = [];
    loadNotifications();
}

function goBack() {
    window.location.href = "student.html";
}