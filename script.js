// document.getElementsByClassName("Header")[0].style.display='none';

document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('https://script.google.com/macros/s/AKfycbwqHVmWKY7ucPCM_hfJYdWvoCsvOTUOC1CAp79xS75yOIC8nTdL3aLJwKl6iZy5DA-Rfw/exec');
  const data = await response.json();

  const tabsContainer = document.createElement('div');
  tabsContainer.classList.add('tabs');

  const portfolioContainer = document.createElement('div');
  portfolioContainer.id = 'portfolio';
  portfolioContainer.classList.add('portfolio-grid');

  const uniqueTypes = [...new Set(data.projects.map(project => project.type))];

  uniqueTypes.forEach(type => {
    const tabButton = document.createElement('button');
    tabButton.textContent = type;
    tabButton.addEventListener('click', () => filterProjectsByType(type, data.projects));
    tabsContainer.appendChild(tabButton);
  });

  document.body.appendChild(tabsContainer);
  document.body.appendChild(portfolioContainer);

function createInstagramEmbed(url, orientation) {
  console.log(url)
  let embedCode = '';

  if (orientation === 'landscape'){
    embedCode = `  
    <div class="embed-container">
      <iframe class="iframe2L" src="https://www.instagram.com/p/${extractVideoIdFromInstagramLink(url)}/embed/"  frameborder="0" scrolling="no" allowtransparency="true" ></iframe>
    </div>

      `;
  }
  else{
    embedCode = `  
    <div class="embed-container">
      <iframe class="iframe2P" src="https://www.instagram.com/p/${extractVideoIdFromInstagramLink(url)}/embed/"  frameborder="0" scrolling="no" allowtransparency="true" ></iframe>
    </div>

      `;
  }

  return embedCode;
}


  function getYoutubeEmbedCode(url, orientation) {
  const embedCode = `
  <div class="embed-container">
    <iframe class="iframe1" src="https://www.youtube.com/embed/${extractVideoIdFromYouTubeLink(url)}" ...></iframe>
  </div>
  `;
  return embedCode;
  }

  function extractVideoIdFromYouTubeLink(url) {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  }

  function extractVideoIdFromInstagramLink(url) {
    const regExp = /(p|reel)\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);
    if (match && match.length >= 3) {
      return match[2];
    }
    return null;
  }



  function filterProjectsByType(type, projects) {
    portfolioContainer.innerHTML = '';
    projects.filter(project => project.type === type).forEach(project => {
    console.log(project.orientation)
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('project-item');

      const projectTitle = document.createElement('h2');
      projectTitle.textContent = project.name;

      let projectContent;

      if (project.application === 'instagram') {
        projectContent = document.createElement('div');
        projectContent.innerHTML = createInstagramEmbed(project.link, project.orientation);
      } else if (project.application === 'youtube') {
        projectContent = document.createElement('div');
        projectContent.innerHTML = getYoutubeEmbedCode(project.link, project.orientation);
      }

      projectDiv.appendChild(projectTitle);
      projectDiv.appendChild(projectContent);

      portfolioContainer.appendChild(projectDiv);
    });
  }

  // Initialize the page with the first tab
  if (uniqueTypes.length > 0) {
    filterProjectsByType(uniqueTypes[0], data.projects);
  }
});
