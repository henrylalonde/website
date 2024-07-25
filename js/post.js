document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const postFile = urlParams.get('post');
    if (postFile) {
        fetchPost(postFile);
    } else {
        document.getElementById('post-container').textContent = 'Post not found';
    }
});

function fetchPost(postFile) {
    fetch(`posts/${postFile}.json`)
        .then(response => response.json())
        .then(post => {
            const postContainer = document.getElementById('post-container');
            postContainer.appendChild(createPostElement(post));
            fetchMarkdownContent(post.content, postContainer);
        })
        .catch(error => console.error('Error fetching post:', error));
}

function fetchMarkdownContent(markdownFile, postContainer) {
    fetch(`posts/${markdownFile}`)
        .then(response => response.text())
        .then(markdown => {
            const content = postContainer.querySelector('.post-content');
            content.innerHTML = marked.parse(markdown);
        })
        .catch(error => console.error('Error fetching markdown content:', error));
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-full';

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
