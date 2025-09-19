let map = new Map();
// let leet_map=new Map();
async function getLeetCodeData() {
    const username = document.getElementById("username").value.trim();
    const tableBody = document.getElementById("profile-table-body");

    if (!username) return alert("Please enter a LeetCode username");

    try {
        const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
        if (!response.ok) throw new Error("User not found or API error");
        const data = await response.json();
        console.log(data);
        if(data.status==='error') {
            let errorMessageIssue=document.getElementById("userValidation");
            errorMessageIssue.innerText="Profile Not Found";
            errorMessageIssue.style.color="red";
            return;
            //throw new Error(data.message);
        }else{
            let errorMessageIssue=document.getElementById("userValidation");
            errorMessageIssue.innerText=""; 
        }
        if(map.has(username)) {
            let errorMessageIssue=document.getElementById("userValidation");
            errorMessageIssue.innerText="Profile Already Added";
            errorMessageIssue.style.color="red";
            return;
        }else{
            let errorMessageIssue=document.getElementById("userValidation");
            errorMessageIssue.innerText="";
        }
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
      <td>${username}</td>
      <td>${data.ranking}</td>
      <td class="easy-solved">${data.easySolved}</td>
      <td class="medium-solved">${data.mediumSolved}</td>
      <td class="hard-solved">${data.hardSolved}</td>
      <td>${data.totalSolved}</td>
        
    `;
        map.set(username, data.ranking);
        //     const leet={
        //     "username":username,
        //     "easySolved":data.easySolved,
        //     "mediumSolved":data.mediumSolved,
        //     "hardSolved":data.hardSolved,
        //     "totalSolved":data.totalSolved,
        //     "ranking":data.ranking,
        // };
        // leet_map.set(username,leet);
        // console.log(leet_map);

        tableBody.appendChild(newRow);
        let mapSort = new Map([...map.entries()].sort((a, b) => a[1] - b[1]));
        //console.log(mapSort);
        let leadertableBody = document.getElementById("leader-table-body");
        leadertableBody.innerHTML = "";

        let sno = 1; // Start serial number
        for (const [user, ranking] of mapSort) {
            let leadernewRow = document.createElement("tr");
            leadernewRow.innerHTML = `
        <td>${sno}</td>
        <td class="leaderboard-username"><a href="gitindex.html" target="_blank">${user}</a></td>
    `;
            leadertableBody.appendChild(leadernewRow);
            sno++; // Increment serial number
        }

    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}