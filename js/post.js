document.addEventListener('DOMContentLoaded', function() {

    const postForm = document.querySelector('#postForm');
    const postContainer = document.querySelector('#postContainer');
    const sortOrderDropdown = document.querySelector("#sortOrder");
    const searchInput = document.querySelector("#searchInput");

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    let profiles = JSON.parse(localStorage.getItem('profiles')) || [];
    let postIdCount = posts.length > 0 ? Math.max(...posts.map((post) => parseInt(post.id))) + 1 : 1;

    posts.sort((a, b) => b.timestamp - a.timestamp);

    renderPosts();

    sortOrderDropdown.addEventListener("change", function() {
        renderPosts();
    });

    searchInput.addEventListener("input", function() {
        renderPosts();
    });

    function renderPosts() {
        postContainer.innerHTML = '';

        let sortedPosts;
        if (sortOrderDropdown.value === "oldest") {
            sortedPosts = [...posts].sort((a, b) => a.timestamp - b.timestamp);
        } else {
            sortedPosts = [...posts].sort((a, b) => b.timestamp - a.timestamp);
        }

        const searchQuery = searchInput.value.trim().toLowerCase();
        if (searchQuery) {
            sortedPosts = sortedPosts.filter(post => post.content.toLowerCase().includes(searchQuery));
        }

        sortedPosts.forEach((postData) => {
            const post = createPost(postData);
            postContainer.appendChild(post);
        });
    }


    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const content = postForm.querySelector('#content').value;
        const profileEmail = localStorage.getItem('userEmail');
        const userProfile = profiles.find(profile => profile.email === profileEmail);
        const id = postIdCount.toString();

        const post = {
            id: id,
            content: content,
            name: userProfile ? userProfile.name : "Anonymous",
            avatar: userProfile ? userProfile.avatar : null,
            reaction: {
                like: 0,
                dislike: 0
            },
            replies: [],
            timestamp: Date.now()
        };

        postIdCount++;
        posts.unshift(post);
        const newPost = createPost(post);
        postContainer.insertBefore(newPost, postContainer.firstChild);
        localStorage.setItem('posts', JSON.stringify(posts));
        postForm.reset();
    });

    function createPost(postData) {
        const post = document.createElement('div');
        post.classList.add('post');
        post.dataset.id = postData.id;
        post.dataset.timestamp = postData.timestamp;

        const postInfo = document.createElement('div');
        postInfo.classList.add('post-info');

        const postName = document.createElement('p');
        postName.textContent = `${postData.name}`;
        postInfo.appendChild(postName);

        const postId = document.createElement('span');
        postId.classList.add('post-id');
        postId.textContent = `ID ${postData.id}`;
        postInfo.appendChild(postId);

        if (postData.avatar) {
            const avatar = document.createElement('img');
            avatar.src = postData.avatar;
            avatar.alt = `${postData.name}'s avatar`;
            avatar.classList.add('post-avatar');
            postInfo.appendChild(avatar);
        }

        const postTimestamp = document.createElement('span');
        postTimestamp.classList.add('post-timestamp');
        postTimestamp.textContent = formatTimestamp(postData.timestamp);
        postInfo.appendChild(postTimestamp);

        const postContent = document.createElement('p');
        postContent.classList.add('post-content');
        postContent.textContent = postData.content;

        const reactionSection = document.createElement('div');
        reactionSection.classList.add('reaction-section');

        const likeButton = document.createElement('button');
        likeButton.innerHTML = 'Like';

        const dislikeButton = document.createElement('button');
        dislikeButton.innerHTML = 'Dislike';

        const reactionCount = document.createElement('span');
        reactionCount.classList.add('reaction-count');
        reactionCount.textContent = `Like ${postData.reaction.like || 0} Dislike ${postData.reaction.dislike || 0}`;
        reactionSection.appendChild(likeButton);
        reactionSection.appendChild(dislikeButton);
        reactionSection.appendChild(reactionCount);

        const replyButton = document.createElement('button');
        replyButton.innerHTML = 'Reply';
        replyButton.addEventListener('click', () => {
            const replyContent = prompt('Enter your reply:');
            if (replyContent) {
                const reply = {
                    content: replyContent,
                    timestamp: Date.now()
                };
                postData.replies.push(reply);
                const replyElement = createReplyElement(reply);
                post.appendChild(replyElement);
            }
        });
        reactionSection.appendChild(replyButton);

        const editButton = document.createElement('button');
        editButton.innerHTML = 'Edit';
        editButton.addEventListener('click', () => {
            const newContent = prompt('Edit your post:', postData.content);
            if (newContent !== null) {
                postData.content = newContent;
                postContent.textContent = newContent;
            }
        });
        reactionSection.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.addEventListener('click', () => {
            deletePost(postData.id);
        });

        post.appendChild(postInfo);
        post.appendChild(postContent);
        post.appendChild(reactionSection);
        post.appendChild(deleteButton);

        postData.replies.forEach(replyData => {
            const replyElement = createReplyElement(replyData);
            post.appendChild(replyElement);
        });

        return post;
    }

    function createReplyElement(replyData) {
        const reply = document.createElement('div');
        reply.classList.add('reply');

        const replyContent = document.createElement('p');
        replyContent.classList.add('reply-content');
        replyContent.textContent = replyData.content;
        reply.appendChild(replyContent);

        const replyTimestamp = document.createElement('span');
        replyTimestamp.classList.add('reply-timestamp');
        replyTimestamp.textContent = formatTimestamp(replyData.timestamp);
        reply.appendChild(replyTimestamp);

        return reply;
    }

    function deletePost(postId) {
        const postIndex = posts.findIndex((post) => post.id === postId);

        if (postIndex !== -1) {
            posts.splice(postIndex, 1);
            const postElement = document.querySelector(`.post[data-id="${postId}"]`);
            if (postElement) {
                postElement.remove();
            }
        }
        localStorage.setItem('posts', JSON.stringify(posts));
    }

    function formatTimestamp(timestamp) {
        const now = Date.now();
        const seconds = Math.floor((now - timestamp) / 1000);
    
        if (seconds < 60) {
            return `${seconds} seconds ago`;
        }
    
        const minutes = Math.floor(seconds / 60);
    
        if (minutes < 60) {
            return `${minutes} minutes${minutes !== 1? 's' : ''} ago`;
        }
    
        const hours = Math.floor(minutes / 60);
    
        if (hours < 24) {
            return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
        }
    
        const days = Math.floor(hours / 24);
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
});
