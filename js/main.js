document.addEventListener('DOMContentLoaded', function() {
    fetchPostsList();
});

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
            const postsContainer = document.getElementById('posts-container');
            const postElement = createPostElement(post);
            postsContainer.appendChild(postElement);
            fetchMarkdownContent(post.content, postElement);
        })
        .catch(error => console.error('Error fetching post:', error));
}

function fetchMarkdownContent(markdownFile, postElement) {
    fetch(`posts/${markdownFile}`)
        .then(response => response.text())
        .then(markdown => {
            const content = postElement.querySelector('.post-content');
            content.innerHTML = marked.parse(markdown);
        })
        .catch(error => console.error('Error fetching markdown content:', error));
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    const title = document.createElement('h2');
    title.textContent = post.title;
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
    postDiv.appendChild(content);

    return postDiv;
}
