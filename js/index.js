document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsDiv = document.getElementById('results');
    const reposDiv = document.getElementById('repos');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const searchTerm = searchInput.value.trim();

        if (searchTerm === '') {
            return;
        }

        try {
            const usersResponse = await fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!usersResponse.ok) {
                throw new Error('GitHub API request failed');
            }

            const userData = await usersResponse.json();
            displayUsers(userData.items);
        } catch (error) {
            console.error('Error:', error);
        }
    });

    function displayUsers(users) {
        resultsDiv.innerHTML = '';
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.innerHTML = `
                <h2>${user.login}</h2>
                <img src="${user.avatar_url}" alt="${user.login}'s Avatar">
                <a href="${user.html_url}" target="_blank">GitHub Profile</a>
            `;
            userDiv.addEventListener('click', () => fetchUserRepos(user.repos_url));
            resultsDiv.appendChild(userDiv);
        });
    }

    async function fetchUserRepos(reposUrl) {
        try {
            const reposResponse = await fetch(reposUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!reposResponse.ok) {
                throw new Error('GitHub API request failed');
            }

            const userRepos = await reposResponse.json();
            displayUserRepos(userRepos);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayUserRepos(repos) {
        reposDiv.innerHTML = '<h2>Repositories:</h2>';
        const repoList = document.createElement('ul');
        repos.forEach(repo => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
            repoList.appendChild(listItem);
        });
        reposDiv.appendChild(repoList);
    }
});


  