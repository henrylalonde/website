document.addEventListener('DOMContentLoaded', function() {
    fetchPostsList();
    document.getElementById('search-bar').addEventListener('input', searchPosts);
});

let allPosts = [];

function fetchPostsList() {
    fetch('posts/posts.json')
        .then(response => response.json())
        .then(postsList => {
            postsList.forEach(postFile => {
                fetchPost(postFile);
            });
        })
        .catch(error => console.error('Error fetching posts list:', error));
}

function fetchPost(postFile) {
    fetch(`posts/${postFile}`)
        .then(response => response.json())
        .then(post => {
            allPosts.push({ ...post, file: postFile });
            const postsContainer = document.getElementById('posts-container');
            const postElement = createPostElement(post, postFile);
            postsContainer.appendChild(postElement);
        })
        .catch(error => console.error('Error fetching post:', error));
}

function createPostElement(post, postFile) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    const image = document.createElement('img');
    if (post.image) {
        image.src = post.image;
    } else {
        image.src = 'path/to/default-image.jpg'; // Default image if none provided
    }
    postDiv.appendChild(image);

    const contentDiv = document.createElement('div');
    contentDiv.className = 'post-content';

    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = `post-template.html?post=${postFile.split('.')[0]}`;
    titleLink.textContent = post.title;
    title.appendChild(titleLink);
    contentDiv.appendChild(title);

    const subtitle = document.createElement('h3');
    subtitle.textContent = post.subtitle;
    contentDiv.appendChild(subtitle);

    const date = document.createElement('p');
    date.textContent = new Date(post.date).toDateString();
    contentDiv.appendChild(date);

    postDiv.appendChild(contentDiv);
    return postDiv;
}

function searchPosts() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    const filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.subtitle.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
    );
    filteredPosts.forEach(post => {
        const postElement = createPostElement(post, post.file);
        postsContainer.appendChild(postElement);
    });
}
