setupUI()
getUser()
getPosts()
function getUser(){
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}`)
        .then((response)=>{
            const user = response.data.data

            document.getElementById("email-info").innerHTML = user.email
            document.getElementById("name-info").innerHTML = user.name
            document.getElementById("username-info").innerHTML = user.username
            document.getElementById("header-image").src = user.profile_image
            document.getElementById("name-posts").innerHTML = `${user.username}'s`

            

            document.getElementById("post-count").innerHTML = user.posts_count
            document.getElementById("comments-count").innerHTML = user.comments_count
            
        })

}

function getPosts(){
    const id = getCurrentUserId()
    axios.get(`${baseUrl}/users/${id}/posts`)
    .then((response)=>{
    const posts = response.data.data
    document.getElementById("user-posts").innerHTML = ""

    for (post of posts){
      const author = post.author

      let postTitle = ""
      
      let user = getCurrentUser()
      let isMypost = user!= null && post.author.id == user.id
      let editBtnContent = ""
      if(isMypost){
        editBtnContent = 
        `
        <button class="btn btn-danger mx-1" style="float: right" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
        </svg>
        </span>
      </button>

      <button class="btn btn-secondary" style="float: right" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">
        <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
          <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
          <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
        </svg>
        </span>
      </button>
        `
      }

      if(post.title != null){
        postTitle = post.title
      }
      let content = 
      `
      <div class="card shadow ">
              <div class="card-header">
                <img src="${author.profile_image}" class="rounded-circle border border-2" style="width: 40px; height: 40px;" alt="">
                <b>${author.username} </b>
                ${editBtnContent}
              </div>
              <div class="card-body" onclick="userClicked(${post.id})" style="cursor: pointer;">
                <img src="${post.image} " class="w-100" alt="">

                <h6 style="color: rgb(197, 167, 167);" class="mt-1">
                  ${post.created_at}
                </h6>

                <h5>
                  ${postTitle} 
                </h5>
                <p>
                  ${post.body}                
                </p>

                <hr>

                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                  </svg>
                  <span>
                    (${post.comments_count}) Comments
                  </span>
                </div>
              </div>
            </div>
      `
      document.getElementById("user-posts").innerHTML += content
    }
    })

}

function getCurrentUserId(){
    const urlParmas = new URLSearchParams(window.location.search)
    const id =  urlParmas.get("userId")
    return id
}