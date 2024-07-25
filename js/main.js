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

    const title = document.createElement('h2');
    const titleLink = document.createElement('a');
    titleLink.href = `post-template.html?post=${postFile.split('.')[0]}`;
    titleLink.textContent = post.title;
    title.appendChild(titleLink);
    postDiv.appendChild(title);

    const subtitle = document.createElement('h3');
    subtitle.textContent = post.subtitle;
    postDiv.appendChild(subtitle);

    const date = document.createElement('p');
    date.textContent = new Date(post.date).toDateString();
    postDiv.appendChild(date);

    if (post.image) {
        const image = document.createElement('img');
        image.src = post.image;
        postDiv.appendChild(image);
    }

    const content = document.createElement('div');
    content.className = 'post-content';
    content.textContent = post.content.substring(0, 100) + '...'; // Short preview of the content
    postDiv.appendChild(content);

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
