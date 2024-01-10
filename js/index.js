document.addEventListener('DOMContentLoaded', () => {
    const githubForm = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');
  
    githubForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const searchTerm = searchInput.value.trim();
  
      if (searchTerm === '') {
        alert('Please enter a GitHub username.');
        return;
      }
  
      try {
        // Search for users using the User Search Endpoint
        const userSearchResponse = await searchUsers(searchTerm);
  
        // Display user information
        displayUsers(userSearchResponse.items);
  
        // Attach click event to each user for fetching repositories
        attachUserClickEvent();
      } catch (error) {
        console.error('Error searching for users:', error.message);
        alert('Error searching for users. Please try again.');
      }
    });
  
    async function searchUsers(username) {
      const apiUrl = `https://api.github.com/search/users?q=${username}`;
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
  
      return response.json();
    }
  
    function displayUsers(users) {
      // Clear previous search results
      userList.innerHTML = '';
      reposList.innerHTML = '';
  
      // Display user information
      users.forEach(user => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <img src='${user.avatar_url}' alt='${user.login}' />
          <span>${user.login}</span>
        `;
        userList.appendChild(listItem);
      });
    }
  
    function attachUserClickEvent() {
      const userItems = document.querySelectorAll('#user-list li');
  
      userItems.forEach(item => {
        item.addEventListener('click', async () => {
          const username = item.querySelector('span').textContent;
  
          try {
            // Fetch repositories using the User Repos Endpoint
            const userRepos = await getUserRepos(username);
  
            // Display repositories
            displayRepos(userRepos);
          } catch (error) {
            console.error('Error fetching user repositories:', error.message);
            alert('Error fetching user repositories. Please try again.');
          }
        });
      });
    }
  
    async function getUserRepos(username) {
      const apiUrl = `https://api.github.com/users/${username}/repos`;
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
  
      return response.json();
    }
  
    function displayRepos(repos) {
      // Clear previous repositories
      reposList.innerHTML = '';
  
      // Display repositories
      repos.forEach(repo => {
        const listItem = document.createElement('li');
        listItem.textContent = repo.name;
        reposList.appendChild(listItem);
      });
    }
  });
  