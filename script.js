async function fetchData() {
  const response = await fetch('https://script.google.com/macros/s/AKfycbwbUb8XQx_T57y-1ruCVszU5uk5MVC1JjNMqVhe2m7L2kGsFhaWzJ5JuvfBkvoPW8Vt/exec');
  const data = await response.json();
  return data;
}

function getColumnClass(size) {
  if (size === 's') {
    return 'column-md-4';
  } else if (size === 'm') {
    return 'column-md-6';
  } else if (size === 'l') {
    return 'column-md-12';
  }
}


function getInstagramEmbedCode(url, orientation) {
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
    <div class="embed-containerP">
      <iframe class="iframe2P" src="https://www.instagram.com/p/${extractVideoIdFromInstagramLink(url)}/embed/"  frameborder="0" scrolling="no" allowtransparency="true" ></iframe>
    </div>

      `;
  }

  return embedCode;
}

  function extractVideoIdFromInstagramLink(url) {
    const regExp = /(p|reel)\/([a-zA-Z0-9_-]+)/;
    const match = url.match(regExp);
    if (match && match.length >= 3) {
      return match[2];
    }
    return null;
  }


function getYoutubeEmbedCode(url, orientation) {
  let embedCode = '';

  if (orientation === 'landscape'){
    embedCode = `  
  <div class="embed-container">
    <iframe class="iframe1" src="https://www.youtube.com/embed/${extractVideoIdFromYouTubeLink(url)}" ...></iframe>
  </div>
  `;
}
  else{
    embedCode = `  <div class="embed-containerShorts">
    <iframe class="iframe1" src="https://www.youtube.com/embed/${extractVideoIdFromYouTubeLink(url)}" ...></iframe>
  </div>
  `;
}

  return embedCode;
  }
function extractVideoIdFromYouTubeLink(url) {
  const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[1].length === 11 ? match[1] : null;
}

function createProjectItemFromLink(link, orientation) {
  if (link.includes('instagram.com')) {
    const embedCode = getInstagramEmbedCode(link, orientation);
    return embedCode
  } else if (link.includes('youtube.com') || link.includes('youtu.be')) {
    const embedCode = getYoutubeEmbedCode(link, orientation);
    return embedCode;
  }
}


// Function to create and append a project item
function createProjectItem(imageSrc, title, category, size, link, orientation) {
  const columnDiv = document.createElement('div');
  columnDiv.classList.add('column-xs-12', getColumnClass(size));

  const figure = document.createElement('figure');
  figure.classList.add('img-container');

  if (imageSrc.length > 0) {
    const img = document.createElement('img');
    img.src = imageSrc;
    figure.appendChild(img);
  } else {
    const divEmbed = document.createElement('div');
    divEmbed.innerHTML = createProjectItemFromLink(link, orientation);
    figure.appendChild(divEmbed);
  }

  const figcaptionContent = `
    <h2 class="title">${title}</h2>
    <h3 class="category">${category}</h3>
  `;

  const figcaption = document.createElement('figcaption');
  figcaption.classList.add('img-content');
  figcaption.innerHTML = figcaptionContent;

  figure.appendChild(figcaption);
  columnDiv.appendChild(figure);

  return columnDiv;
}

// Function to create and append tab buttons
function createTabButton(category) {
  const tabButton = document.createElement('button');
  tabButton.textContent = category;
  tabButton.addEventListener('click', () => filterProjectsByCategory(category));
  return tabButton;
}

// Function to populate tabs with fetched categories
async function populateTabs() {
  const tabsContainer = document.querySelector('.tabs');
  const projectData = await fetchData();

  const categories = [...new Set(projectData.map(project => project.category))];
  categories.forEach(category => {
    const tabButton = createTabButton(category);
    tabsContainer.appendChild(tabButton);
  });
}

// Function to filter projects by category
function filterProjectsByCategory(category) {
  const galleryContainer = document.querySelector('.gallery .grid');
  galleryContainer.innerHTML = '';

  fetchData().then(projectData => {
    if (category === '') {
      projectData.forEach(project => {
        const projectItem = createProjectItem(project.imageSrc, project.title, project.category, project.size, project.link, project.orientation);
        galleryContainer.appendChild(projectItem);
      });
    } else {
      projectData
        .filter(project => project.category === category)
        .forEach(project => {
          const projectItem = createProjectItem(project.imageSrc, project.title, project.category, project.size, project.link, project.orientation);
          galleryContainer.appendChild(projectItem);
        });
    }
  });
}


populateTabs();
filterProjectsByCategory('');
