async function getLeetCodeData() {
  const username = document.getElementById("username").value.trim();
  const tableBody = document.getElementById("profile-table-body");

  if (!username) return alert("Please enter a LeetCode username");

  try {
    const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);


     if (!response.ok) throw new Error("User not found or API error");

    const data = await response.json();

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
