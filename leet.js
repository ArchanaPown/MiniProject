async function getLeetCodeData() {
  const username = document.getElementById("username").value.trim();
  const tableBody = document.getElementById("profile-table-body");

  if (!username) return alert("Please enter a LeetCode username");

  try {
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);


     if (!response.ok) throw new Error("User not found or API error");

    const data = await response.json();

    const isInvalid = (
      data.easySolved == 0 &&
      data.totalSolved == 0 &&
      data.mediumSolved === 0 &&
      data.hardSolved === 0 &&
      data.ranking === 0
    );
    if (isInvalid) {
      alert("Invalid username or no data found for this user.");
      return;
    }
    
    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${username}</td>
      <td>${data.easySolved}</td>
       <td>${data.mediumSolved}</td>
       <td>${data.hardSolved}</td>
      <td>${data.totalSolved}</td>
       
       <td>${data.ranking}</td>
    `;
     const map=new Map();
    map.set(username,data.ranking);
    tableBody.appendChild(newRow);
    
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}
