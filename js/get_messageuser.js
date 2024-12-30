  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
  import { getDatabase, ref, child, onValue, get, onChildAdded } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-database.js";
  import { getAuth, deleteUser } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyCnZzlFSm-61oaNvO2TTJyef2PMc6iU8DY",
    authDomain: "user-inifanshop.firebaseapp.com",
    databaseURL: "https://user-inifanshop-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "user-inifanshop",
    storageBucket: "user-inifanshop.appspot.com",
    messagingSenderId: "104690936940",
    appId: "1:104690936940:web:5398fbb0edae0c7a76bc49",
    measurementId: "G-NLBDR28748"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const database = getDatabase(app);
  const auth = getAuth();

var userList = document.getElementById('userList');
function AddItemToList(uid, hoten, urlavatar, userstatus) {
    // Tạo một hàng mới trong bảng
    let row = document.createElement("tr");

    // Tạo một ô cho hình ảnh
    let imgCell = document.createElement("td");
    imgCell.innerHTML = `<img class="image-avt" src="${urlavatar}" alt=""><br>${hoten}`;
    
    // Tạo một ô cho UID và Họ tên
    let infoCell = document.createElement("td");
    infoCell.textContent = `${userstatus}`;
    
    // Tạo một ô cho nút "Chat"
    let chatCell = document.createElement("td");
    let chatButton = document.createElement("button");
    chatButton.textContent = "Chat";
    chatButton.classList.add("btn", "btn-primary", "btn-sm");
chatButton.addEventListener("click", function() {
    // Xử lý khi nút "Chat" được nhấn
    // Lấy thông tin hình ảnh và tên người dùng
    let imageSrc = urlavatar;
    let userName = hoten;
    let Satus = userstatus;
    let userid = uid;

    // Tạo HTML cho hình ảnh và tên người dùng
    let chatInfoHTML = `<img class="image-avt" src="${imageSrc}" alt="${userName}"> ${userName} [${userstatus}]`;

    // In hình ảnh và tên người dùng ra div chatInfo
    document.getElementById("chatInfo").innerHTML = chatInfoHTML;
    GetMess(userid);
});

    chatCell.appendChild(chatButton);
    
    // Thêm các ô vào hàng
    row.appendChild(imgCell);
    row.appendChild(infoCell);
    row.appendChild(chatCell);
    
    // Thêm hàng vào bảng
    userList.appendChild(row);
}

function GetMess(userid) {
    const database = getDatabase();
    const databaseRef = ref(database, "messages/" + userid);

    // Lắng nghe sự kiện child_added để nhận thông báo khi có tin nhắn mới được thêm vào
    onChildAdded(databaseRef, (snapshot) => {
        const message = snapshot.val();
        displayMessage(message);
    }, (error) => {
        console.error("Error getting messages: ", error);
    });
}

function displayMessage(message) {
    const messages = document.getElementById('textchat');
    const li = document.createElement('li');
    li.innerHTML = `
    <fieldset class="border p-2 mx-2 my-2">
        <legend class="w-auto legend-small"><img src="${message.url}" alt="User Image"
                style="width: 40px; height: 40px; border-radius: 100%;"> ${message.name} </legend>
        ${message.message}<br><br>
        <p style="margin-bottom: -18px; float: right; background-color: #fff;">${message.time}</p>
    </fieldset>
    <hr>
    `
    messages.appendChild(li);
}

function AddAllItemsToList(userData) {
    userData.forEach(user => {
        AddItemToList(user.uid, user.hoten, user.urlavatar, user.userstatus);
    });
}

function GetAllDataOnce() {
    const databaseRef = ref(database);

    get(child(databaseRef, "users")).then((snapshot) => {
        const userData = [];
        snapshot.forEach((childSnapshot) => {
            const uid = childSnapshot.key;
            const userstatus = childSnapshot.val().userstatus;
            const urlavatar = childSnapshot.val().urlavatar;
            const hoten = childSnapshot.val().hoten; // Assuming "hoten" is a direct child of the snapshot
            userData.push({ uid, hoten, urlavatar,userstatus });
        });
        console.log("All user data:", userData);
        AddAllItemsToList(userData);
    }).catch((error) => {
        console.error("Error fetching user data:", error);
    });
}

GetAllDataOnce();
