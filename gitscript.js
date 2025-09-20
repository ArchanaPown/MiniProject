function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

async function getProfile() {
    
    const loading = document.getElementById("loading");
    const resultArea = document.getElementById("resultArea");
    loading.style.display = "block"; // Show loading
    resultArea.innerHTML = ""; // Clear previous results

    try {
        let gitProfile = document.getElementById("username").value.trim();
        if (!gitProfile) throw new Error("GitHub username is required");

        let profileUrl = `https://api.github.com/users/${gitProfile}`;
        let repoUrl = `https://api.github.com/users/${gitProfile}/repos`;

        const profileRes = await fetch(profileUrl);
        if (!profileRes.ok){
            loading.style.display = "none";
            throw new Error("User not found");
        }
        const profileData = await profileRes.json();

        const repoRes = await fetch(repoUrl);
        if (!repoRes.ok){
            loading.style.display = "none";
            throw new Error("No Repositories found");
        }
        const repoData = await repoRes.json();

        let resultArea = document.getElementById("resultArea");
        resultArea.innerHTML = ``;

        // Profile Header
        let header = document.createElement("div");
        header.className = "profile-header";
        header.innerHTML = `
            <img src="${profileData.avatar_url}" alt="Avatar">
            <h2>${profileData.name || gitProfile}</h2>
            <p>Location: ${profileData.location || "N/A"}</p>
            <p>Email: ${profileData.email || "Not Public"}</p>
        `;
        resultArea.append(header);

        // Collect Tech Skills
        const techSkills = new Set();
        repoData.forEach(repo => {
            if (repo.language) techSkills.add(repo.language);
        });

        // Gemini Summary
        let prompt = `Write a short professional portfolio summary of this GitHub user:
        Name: ${profileData.name}, Public Repositories: ${repoData.length}, Tech Skills: ${[...techSkills].join(", ")}`;

        const api = "AIzaSyDL5XkgzijRhQ2i_FNUlA3nIj4On5DOXDw";
        const geminiRes = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const geminiData = await geminiRes.json();
        let summary = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "No summary generated";

        let summaryDiv = document.createElement("div");
        summaryDiv.className = "summary";
        summaryDiv.innerHTML = `<h3>Professional Summary</h3><p>${summary}</p>`;
        resultArea.append(summaryDiv);

        // Projects Section
        let projectsDiv = document.createElement("div");
        projectsDiv.className = "projects";
        projectsDiv.innerHTML = `<h3>Projects</h3>`;

        let scrollContainer = document.createElement("div");
        scrollContainer.className = "project-scroll";

        repoData.forEach(repo => {
            let card = document.createElement("div");
            card.className = "project-card";
            card.innerHTML = `
        <strong>${repo.name}</strong><br/>
        <em>Language:</em> ${repo.language || "N/A"}<br/>
        <em>Description:</em> ${repo.description || "No description"}<br/>
        <a href="${repo.html_url}" target="_blank">View on GitHub</a>
    `;
            scrollContainer.append(card);
        });

        projectsDiv.append(scrollContainer);
        resultArea.append(projectsDiv);

        // Contact Section
        let contactDiv = document.createElement("div");
        contactDiv.className = "contact";
        contactDiv.innerHTML = `
            <h3>Contact</h3>
            <a href="${profileData.html_url}" target="_blank">GitHub</a>
            ${profileData.blog ? `<a href="${profileData.blog}" target="_blank">Website</a>` : ""}
            ${profileData.twitter_username ? `<a href="https://twitter.com/${profileData.twitter_username}" target="_blank">Twitter</a>` : ""}
        `;
        resultArea.append(contactDiv);
        
        // Hide the loading spinner after all content is appended
        loading.style.display = "none";

    } catch (e) {
        console.log(e.message);
        document.getElementById("resultArea").innerHTML = `<p style="color:red;">${e.message}</p>`;
        // Hide the loading spinner on error
        loading.style.display = "none";
    }
}

// Auto-run on page load if URL parameter is present
window.onload = function () {
    const githubUsername = getQueryParam("github");
    const inputBox = document.getElementById("username");

    if (githubUsername) {
        inputBox.value = githubUsername;
        getProfile();
    } else {
        inputBox.style.display = "block"; // Show input box if no username in URL
    }
};