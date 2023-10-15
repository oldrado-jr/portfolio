const endpointGitHubUser = "https://api.github.com/users/oldrado-jr";

const defaultUser = {
  name: "Oldrado Junior",
  bio: "Full Stack Developer",
  location: "Brasil",
  company: "#OpenToWork",
  twitter: "Sem Twitter",
  blog: "Sem site pessoal",
  email: "oldradojunior@gmail.com",
};

async function getJson(endpoint) {
  const response = await fetch(endpoint);
  return await response.json();
}

async function getGitHubUser() {
  try {
    return await getJson(endpointGitHubUser);
  } catch (error) {
    return {};
  }
}

async function getGitHubUserRepos(user) {
  try {
    const endpoint = user.repos_url || `${endpointGitHubUser}/repos`;
    return await getJson(endpoint);
  } catch (error) {
    return [];
  }
}

async function getGitHubLanguagesData() {
  try {
    const endpoint =
      "https://raw.githubusercontent.com/ozh/github-colors/master/colors.json";
    return await getJson(endpoint);
  } catch (error) {
    return {};
  }
}

function renderUserProfileImage(user) {
  const profileImage = document.createElement("img");
  profileImage.src = user.avatar_url;
  profileImage.alt = "Imagem de perfil";
  document.querySelector("#profile").prepend(profileImage);
}

function renderUserInfo(user) {
  document.querySelector("#profile-name").textContent =
    user.name || defaultUser.name;
  document.querySelector("#profile-role").textContent =
    user.bio || defaultUser.bio;
}

function renderUserLinks(user) {
  document
    .querySelector("#location")
    .append(user.location || defaultUser.location);
  document
    .querySelector("#company")
    .append(user.company || defaultUser.company);
  document
    .querySelector("#twitter-user")
    .append(user.twitter_username || defaultUser.twitter);
  document
    .querySelector("#personal-blog")
    .append(user.blog || defaultUser.blog);

  const gitHubProfileLink = document.createElement("a");
  gitHubProfileLink.href = user.html_url;
  gitHubProfileLink.target = "_blank";
  gitHubProfileLink.textContent = user.login;
  document.querySelector("#github-user").appendChild(gitHubProfileLink);

  const email = user.email || defaultUser.email;
  const emailLink = document.createElement("a");
  emailLink.href = `mailto:${email}`;
  emailLink.textContent = email;
  document.querySelector("#email").appendChild(emailLink);
}

function renderUser(user) {
  renderUserProfileImage(user);
  renderUserInfo(user);
  renderUserLinks(user);
}

function renderUserRepoListItem(userRepo, languagesData) {
  const userRepoListItem = document.createElement("li");
  userRepoListItem.classList.add("card");

  const languageData = languagesData[userRepo.language];
  const languageColor = (languageData && languageData.color) || "#ffffff";

  userRepoListItem.innerHTML = `
    <a href="${userRepo.html_url}" target="_blank">
      <div class="project-info">
        <img src="./assets/folder.svg" alt="Ícone de uma pasta" />
        <span class="project-name">${userRepo.name}</span>
      </div>
      <span class="project-description">${
        userRepo.description || "Sem descrição"
      }</span>
      <div class="project-contrib-info">
        <div class="project-contrib-details">
          <div>
            <img src="./assets/star.svg" alt="Ícone de uma estrela" />
            <span class="quantity-info">${userRepo.stargazers_count}</span>
          </div>
          <div>
            <img
              src="./assets/git-branch.svg"
              alt="Ícone de ramos em junção"
            />
            <span class="quantity-info">${userRepo.forks_count}</span>
          </div>
        </div>
        ${
          userRepo.language
            ? `<div class="project-main-tech-details">
            <div class="project-main-tech-circle" style="background: ${languageColor};"></div>
            <span class="project-main-tech-name">${userRepo.language}</span>
          </div>`
            : ""
        }
      </div>
    </a>
  `;

  document.querySelector("#projects ul").appendChild(userRepoListItem);
}

function renderUserRepos(userRepos, languagesData) {
  userRepos.map((userRepo) => {
    renderUserRepoListItem(userRepo, languagesData);
  });
}

async function main() {
  const user = await getGitHubUser();
  renderUser(user);

  const languagesData = await getGitHubLanguagesData();
  const userRepos = await getGitHubUserRepos(user);
  renderUserRepos(userRepos, languagesData);
}

document.addEventListener("DOMContentLoaded", main);
