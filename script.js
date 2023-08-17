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

function createInstagramEmbed(url) {
  console.log(url)
  const embedCode = `  
  <blockquote class="instagram-media" data-instgrm-permalink="${url}/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);">
  <div style="padding:16px;">
    <a href="https://www.instagram.com/reel/Cv7NIK3hX2O/?utm_source=ig_embed&amp;utm_campaign=loading" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank">
      <div style="display: flex; flex-direction: column; align-items: center;">
        <div style="padding-bottom: 75%; position: relative; display: block; width: 100%; background-size: cover; background-position: center;"></div>
      </div>
    </a>
  </div>
</blockquote>
<script async src="//www.instagram.com/embed.js"></script>


    `;
  return embedCode;
}


  function getYoutubeEmbedCode(url) {
  const embedCode = `
  <div class="embed-container">
    <iframe src="https://www.youtube.com/embed/${extractVideoIdFromYouTubeLink(url)}" ...></iframe>
  </div>
  `;
  return embedCode;
  }
  function extractVideoIdFromYouTubeLink(url) {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : null;
  }


  function filterProjectsByType(type, projects) {
    portfolioContainer.innerHTML = '';

    projects.filter(project => project.type === type).forEach(project => {
      const projectDiv = document.createElement('div');
      projectDiv.classList.add('project-item');

      const projectTitle = document.createElement('h2');
      projectTitle.textContent = project.name;

      let projectContent;

      if (project.application === 'instagram') {
        projectContent = document.createElement('div');
        projectContent.innerHTML = createInstagramEmbed(project.link);
      } else if (project.application === 'youtube') {
        projectContent = document.createElement('div');
        projectContent.innerHTML = getYoutubeEmbedCode(project.link);
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
