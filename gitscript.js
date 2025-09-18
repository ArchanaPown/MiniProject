async function getProfile(){
    try{
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
        console.log(geminiData);
    }catch(e){
        console.log(e.message);
    }
}