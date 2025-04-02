document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const adminSection = document.getElementById("admin");
    const teacherSection = document.getElementById("teacher");
    const studentSection = document.getElementById("student");
    const adminPostForm = document.getElementById("adminPostForm");
    const teacherPostForm = document.getElementById("postForm");
    const announcementList = document.getElementById("announcementList");
    const logoutBtn = document.getElementById("logoutBtn");
    const calendarEl = document.getElementById("calendar");

    let currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

    const users = {
        admin: { username: "admin", password: "admin123", role: "admin" },
        teacher: { username: "teacher", password: "teacher123", role: "teacher" },

        student_micah: { username: "student_micah", password: "123", role: "student", section: "7-Micah" },
        student_isaiah: { username: "student_isaiah", password: "123", role: "student", section: "7-Isaiah" },
        student_nahum: { username: "student_nahum", password: "123", role: "student", section: "7-Nahum" },
        student_ezra: { username: "student_ezra", password: "123", role: "student", section: "7-Ezra" },

        student_amos: { username: "student_amos", password: "123", role: "student", section: "8-Amos" },
        student_jonah: { username: "student_jonah", password: "123", role: "student", section: "8-Jonah" },
        student_joshua: { username: "student_joshua", password: "123", role: "student", section: "8-Joshua" },
        student_zephaniah: { username: "student_zephaniah", password: "123", role: "student", section: "8-Zephaniah" },

        student_samuel: { username: "student_samuel", password: "123", role: "student", section: "9-Samuel" },
        student_daniel: { username: "student_daniel", password: "123", role: "student", section: "9-Daniel" },
        student_ezekiel: { username: "student_ezekiel", password: "123", role: "student", section: "9-Ezekiel" },

        student_jeremiah: { username: "student_jeremiah", password: "123", role: "student", section: "10-Jeremiah" },
        student_elijah: { username: "student_elijah", password: "123", role: "student", section: "10-Elijah" },
        student_nehemiah: { username: "student_nehemiah", password: "123", role: "student", section: "10-Nehemiah" },

        student_albisolaMare: { username: "student_albisolaMare", password: "123", role: "student", section: "11-AlbisolaMare" },
        student_savona: { username: "student_savona", password: "123", role: "student", section: "11-Savona" },

        student_laSpezia: { username: "student_laSpezia", password: "123", role: "student", section: "12-LaSpezia" },
        student_massa: { username: "student_massa", password: "123", role: "student", section: "12-Massa" }
    };

     function toggleVisibility(element, shouldShow) {
        if (element) element.classList.toggle("hidden", !shouldShow);
    }

    function setUserDashboard() {
        if (currentUser) {
            toggleVisibility(document.getElementById("login"), false);
            toggleVisibility(document.getElementById("dashboard"), true);
            logoutBtn.style.display = "block";

            toggleVisibility(adminSection, currentUser.role === "admin");
            toggleVisibility(teacherSection, currentUser.role === "teacher");
            toggleVisibility(studentSection, currentUser.role === "student");
        }
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (users[username] && users[username].password === password) {
            currentUser = users[username];
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
            alert(`Welcome, ${username}!`);
            setUserDashboard();
            loadAnnouncements();
        } else {
            alert("Invalid username or password!");
        }
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem("currentUser");

        toggleVisibility(document.getElementById("login"), true);
        toggleVisibility(document.getElementById("dashboard"), false);
        logoutBtn.style.display = "none";

        toggleVisibility(adminSection, false);
        toggleVisibility(teacherSection, false);
        toggleVisibility(studentSection, false);

        if (announcementList) announcementList.innerHTML = "";
    }

    function postAnnouncement(textAreaId, sectionSelectId, imageInputId) {
        if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "teacher")) {
            alert("Only admins and teachers can post announcements.");
            return;
        }

        const textArea = document.getElementById(textAreaId);
        const sectionSelect = document.getElementById(sectionSelectId);
        const imageInput = document.getElementById(imageInputId); // Get the image input
        const announcementText = textArea.value.trim();
        const selectedSection = sectionSelect.value || "all";
        const imageFile = imageInput.files[0]; // Get the uploaded image file

        if (!announcementText && !imageFile) {
            alert("Please enter an announcement or upload an image.");
            return;
        }

        // Handle image upload if an image is selected
        let imageUrl = "";
        if (imageFile) {
            const reader = new FileReader();
            reader.onloadend = function () {
                imageUrl = reader.result; // This will be the base64 URL of the uploaded image
                createAnnouncement(announcementText, selectedSection, imageUrl);
            };
            reader.readAsDataURL(imageFile); // Convert image to base64
        } else {
            createAnnouncement(announcementText, selectedSection, imageUrl);
        }

        function createAnnouncement(text, section, imageUrl) {
            const announcement = {
                id: Date.now(),
                text: text,
                date: new Date().toLocaleString(),
                postedBy: currentUser.username,
                role: currentUser.role,
                section: section,
                imageUrl: imageUrl // Store the image URL (or empty string if no image)
            };

            let announcements = JSON.parse(localStorage.getItem("announcements")) || [];
            announcements.push(announcement);
            localStorage.setItem("announcements", JSON.stringify(announcements));

            textArea.value = "";
            imageInput.value = ""; // Clear the image input
            alert("Announcement posted successfully!");
            loadAnnouncements();
        }
    }

    function loadAnnouncements() {
        let announcements = JSON.parse(localStorage.getItem("announcements")) || [];
        if (!announcementList) return;

        announcementList.innerHTML = "";
        announcements.forEach((announcement) => {
            // Check if the announcement should be visible to the current user
            if (announcement.section === "all" || announcement.section === currentUser.section || currentUser.role === announcement.role || currentUser.role === "admin") {
                let div = document.createElement("div");
                div.innerHTML = `
                    <p><strong>${announcement.date}</strong> - 
                    <em>Posted by: ${announcement.postedBy} (${announcement.role})</em><br>
                    📢 <strong>Class ${announcement.section}</strong>: ${announcement.text}</p>
                    ${announcement.imageUrl ? `<img src="${announcement.imageUrl}" alt="Announcement Image" style="max-width: 300px;">` : ""}
                    ${currentUser && (currentUser.role === "admin" || currentUser.role === "teacher") ? 
                        `<button onclick="deleteAnnouncement(${announcement.id})">❌ Delete</button>` : ""}<hr>`;
                announcementList.appendChild(div);
            }
        });
    }

    window.deleteAnnouncement = function (announcementId) {
        if (!confirm("Are you sure you want to delete this announcement?")) return;

        let announcements = JSON.parse(localStorage.getItem("announcements")) || [];
        announcements = announcements.filter(a => a.id !== announcementId);
        localStorage.setItem("announcements", JSON.stringify(announcements));

        alert("Announcement deleted.");
        loadAnnouncements();
    };

    if (loginForm) loginForm.addEventListener("submit", handleLogin);
    if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);
    if (adminPostForm) adminPostForm.addEventListener("submit", function (event) { 
        event.preventDefault(); 
        postAnnouncement("adminAnnouncement", "adminSectionSelect", "adminImage"); 
    });
    if (teacherPostForm) teacherPostForm.addEventListener("submit", function (event) { 
        event.preventDefault(); 
        postAnnouncement("announcementText", "teacherSectionSelect", "teacherImage"); 
    });

    setUserDashboard();
    loadAnnouncements();
});