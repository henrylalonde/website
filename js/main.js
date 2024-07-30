document.addEventListener('DOMContentLoaded', function () {
    fetchNextPost();
    document.getElementById('search-bar').addEventListener('input', searchPosts);
});

let allPosts = [];
let postIndex = 1;
let postsRendered = 0;
let postsToRender = [];
const postsPerLoad = 5;
let observer;

function fetchNextPost() {
    const postFile = `post${postIndex}.json`;
    fetch(`posts/${postFile}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Post not found');
            }
            return response.json();
        })
        .then(post => {
            allPosts.push({ ...post, file: postFile });
            postIndex++;
            fetchNextPost(); // Fetch the next post
        })
        .catch(error => {
            if (error.message === 'Post not found') {
                // Sort posts in descending order based on the file name
                allPosts.sort((a, b) => {
                    const aIndex = parseInt(a.file.match(/\d+/)[0]);
                    const bIndex = parseInt(b.file.match(/\d+/)[0]);
                    return bIndex - aIndex;
                });
                postsToRender = allPosts;
                renderPosts();
                observeLastPost();
            } else {
                console.error('Error fetching post:', error);
            }
        });
}

function renderPosts() {
    const postsContainer = document.getElementById('posts-container');
    const postsBatch = postsToRender.slice(postsRendered, postsRendered + postsPerLoad);
    postsBatch.forEach(post => {
        const postElement = createPostElement(post, post.file);
        postsContainer.appendChild(postElement);
    });
    postsRendered += postsPerLoad;
}

function observeLastPost() {
    const postsContainer = document.getElementById('posts-container');
    const lastPost = postsContainer.lastElementChild;

    if (lastPost) {
        observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                observer.unobserve(lastPost);
                renderPosts();
                observeLastPost();
            }
        }, { threshold: 1.0 });

        observer.observe(lastPost);
    }
}

function createPostElement(post, postFile) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post';

    const image = document.createElement('img');
    if (post.image) {
        image.src = post.image;
    } else {
        image.src = 'path/to/default-image.jpg';
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
    date.textContent = post.date;
    contentDiv.appendChild(date);

    postDiv.appendChild(contentDiv);
    return postDiv;
}

function searchPosts() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    postsRendered = 0;
    postsToRender = allPosts.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.subtitle.toLowerCase().includes(query) ||
        post.date.toLowerCase().includes(query)
    );
    renderPosts();
    observeLastPost();
}
