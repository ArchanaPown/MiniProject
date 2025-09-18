let map=new Map();
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

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
      <td>${username}</td>
      <td>${data.easySolved}</td>
       <td>${data.mediumSolved}</td>
       <td>${data.hardSolved}</td>
      <td>${data.totalSolved}</td>
       
       <td>${data.ranking}</td>
    `;
    map.set(username,data.ranking);
//     const leet={
//     "username":username,
//     "easySolved":data.easySolved,
//     "mediumSolved":data.mediumSolved,
//     "hardSolved":data.hardSolved,
//     "totalSolved":data.totalSolved,
//     "ranking":data.ranking,
// };
// leet_map.set(username,leet);
// console.log(leet_map);
    tableBody.appendChild(newRow);
    let mapSort = new Map([...map.entries()].sort((a, b) => a[1] - b[1]));
    //console.log(mapSort);
    let leadertableBody = document.getElementById("leader-table-body");
    leadertableBody.innerHTML = "";
    for(const [user,ranking] of mapSort){

        let leadernewRow = document.createElement("tr");
        leadernewRow.innerHTML += `
      <td><a href="gitindex.html" target="_blank">${user}</a></td>
       <td>${ranking}</td>
    `
    ;leadertableBody.appendChild(leadernewRow);

    }
    
   
    
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
  
   
    
  
 

}
async function getProfile(){
    try{
        //console.log(leet_map);
        let gitProfile=document.getElementById("username").value;
        let profileUrl=`https://api.github.com/users/${gitProfile}`;
        let repoUrl=`https://api.github.com/users/${gitProfile}/repos`;

        //FETCHING PROFILE
        const profileRes=await fetch(profileUrl);
        if(!profileRes.ok)throw new Error("User not found");
        const profileData=await profileRes.json();
        //console.log(profileData);

        //FETCHING REPOS
        const repoRes=await fetch(repoUrl);
        if(!repoRes.ok) throw new Error("No Repositories found");
        const repoData=await repoRes.json();
        //console.log(repoData);

        //DISPLAY RESPONSE
        let resultArea=document.getElementById("resultArea");
        resultArea.innerHTML=``;

        //PERSONAL INFO
        let personalInfo=document.createElement("p");
        personalInfo.innerHTML=`Name : ${profileData.name}
        </br>Location : ${profileData.location}</br>Email :${profileData.email}`;
        resultArea.append(personalInfo);

        //REPO INFO
        let total_repos=repoData.length;
        const techSkills=new Set();
        let repoInfo=document.createElement("p");
        repoInfo.innerHTML+=`Total Repositories : ${total_repos} <br/>`;
        repoData.forEach(repo=>{
            repoInfo.innerHTML+=`Name : ${repo.name} <br/>
            Language: ${repo.language} <br/><br/>
            `;
            if(repo.language) techSkills.add(repo.language);
        });resultArea.append(repoInfo);

        //GEMINI API CALL
        let prompt=`Write a short professional summary of this Github user:
        Name : ${profileData.name}, Public Repositories : ${total_repos}, Tech Skills : ${[...techSkills].join(", ")} like a portfolio about of that person`;
        const api="AIzaSyDL5XkgzijRhQ2i_FNUlA3nIj4On5DOXDw"; 
        const geminiRes=await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key="+api,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"},
            body:JSON.stringify({
                contents:[{parts:[{text:prompt}]}]})}
        );const geminiData=await geminiRes.json();
        let summary=geminiData.candidates?.[0]?.content?.parts?.[0]?.text||"No summary generated";
        let geminiInfo=document.createElement("p");
        geminiInfo.innerHTML=`<b>AI Generated Professional Summary:</b><br/>${summary}`;
        resultArea.append(geminiInfo);
        //console.log(geminiData);
    }catch(e){
        console.log(e.message);
    }
}