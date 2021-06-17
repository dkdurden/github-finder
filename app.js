// Used with ajax implementation, not with fetch
//let user;
//let repos;
//let requestsComplete = 0;

const formUI = document.querySelector('form');
const inputUI = document.querySelector('form input');
const userInfoUI = document.querySelector('#user-info');

formUI.addEventListener('submit', e => handleSubmit(e, inputUI.value));

function handleSubmit(e, value) {
  e.preventDefault();

  Promise.all([
    fetch(`https://api.github.com/users/${value}`),
    fetch(`https://api.github.com/users/${value}/repos`),
  ]).then(([userRes, reposRes]) => {
    Promise.all([userRes.json(), reposRes.json()]).then(([user, repos]) =>
      renderUser(userInfoUI, user, repos)
    );
  });

  // ajax implementation
  // const apiUrls = [
  //   `https://api.github.com/users/${value}`,
  //   `https://api.github.com/users/${value}/repos`,
  // ];

  // apiUrls.forEach(url => {
  //   const xhr = new XMLHttpRequest();

  //   xhr.open('GET', url, true);

  //   xhr.onload = function () {
  //     if (this.status === 200) {
  //       const res = JSON.parse(this.responseText);

  //       if (Array.isArray(res)) repos = res;
  //       else user = res;

  //       requestsComplete++;

  //       renderUser(apiUrls.length, userInfoUI, user, repos);
  //     }
  //   };

  //   xhr.send();
  // });
}

function renderUser(ui, user, repos) {
  if (user == null || repos == null) return;

  console.log(user, repos);

  const memberSinceDate = getDate(new Date(user.created_at));

  let reposHtmlString = `
    <section id="latest-repos" class="latest-repos">
      <h2 class="my-4">Latest Repos</h2>
    </section>
  `;

  if (repos.length > 0)
    repos.slice(0, 5).forEach(repo => {
      reposHtmlString += `
      <article class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-6"><span id="repo">${repo.name}</span></div>
            <div class="col">
              <div class="user-profile__badges">
                <span class="badge bg-primary mx-1"
                  >Stars:<span id="stars">${repo.stargazers_count}</span></span
                ><span class="badge bg-secondary mx-1"
                  >Watchers:<span id="watchers">${repo.watchers_count}</span></span
                ><span class="badge bg-success mx-1 mt-1 mt-md-0"
                  >Forks:<span id="forks">${repo.forks}</span
                ></span>
              </div>
            </div>
          </div>
        </div>
      </article>
    `;
    });
  let profileHtmlString = `
    <section id="user-profile" class="user-profile card">
      <div class="card-body">
        <div class="row">
          <div class="col-12 col-md-3">
            <img
              src="${user.avatar_url}"
              alt="${user.name}"
              class="img-fluid"
            />
            <div class="d-grid mt-2">
              <button class="btn fluid btn-primary rounded-pill">
                View Profile
              </button>
            </div>
          </div>
          <div class="col-12 col-md-9">
            <div class="user-profile__badges">
              <span class="badge bg-primary mx-1"
                >Public Repos:<span id="public-repos">${
                  user.public_repos
                }</span></span
              ><span class="badge bg-secondary mx-1"
                >Public Gists:<span id="gists">${user.public_gists}</span></span
              ><span class="badge bg-success mx-1 mt-1 mt-md-0"
                >Followers:<span id="followers">${user.followers}</span></span
              ><span class="badge bg-info mx-1 mt-1 mt-md-0"
                >Following:<span id="following">${user.following}</span
              ></span>
            </div>
            <div class="user-profile__details mt-4">
              <div class="card">
                <div class="list-group">
                  <div class="list-group-item py-3">Company:<span id="company">${
                    user.company != null && user.company ? user.company : '-'
                  }</span></div>
                  <div class="list-group-item py-3">Website/Blog:<span id="website">${
                    user.blog != null && user.blog ? user.blog : '-'
                  }</span></div>
                  <div class="list-group-item py-3">Location:<span id="location">${
                    user.location != null && user.location ? user.location : '-'
                  }</span></div>
                  <div class="list-group-item py-3">Member Since:<span id="member-since">${memberSinceDate}</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;

  ui.innerHTML =
    user.message === 'Not Found' || repos.message === 'Not Found'
      ? `
        <div class="alert alert-danger" role="alert">
          User not found!
        </div>
      `
      : profileHtmlString + reposHtmlString;
}

// Takes in a Date object and returns a string in the format yyyy-mm-dd
function getDate(date) {
  if (date == null) return '';

  const year = date.getFullYear();
  const month = parseInt(date.getMonth()) + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}
