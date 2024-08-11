function handleButtonClick(event) {
    const method = event.target.getAttribute('data-method');
    if (method === 'DELETE') {
        alert('Post deleted');
    } else if (method === 'PUT') {
        alert('Post edited');
        location.reload();
    }
}

function Time() {
    const time = new Date();
    const timeString = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} KSA`;
    document.getElementById('Time').innerText = timeString;
}
setInterval(Time, 1000); // Update the time every second

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname === '/SignUp' || window.location.pathname === '/Login' || window.location.pathname === '/') {
        document.querySelectorAll('span')[0].innerHTML = "Welcome";
    } else if (window.location.pathname !== '/SignUp' && window.location.pathname !== '/Login') {
        document.querySelectorAll('span')[0].innerHTML = "Cap Stone";
        document.querySelector(".LogOut").innerHTML = "<a href='/LogOut'>Logout</a>";
        document.querySelectorAll('span')[0].classList.add('titleSec')
    }
});
