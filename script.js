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

// Function to create and append a project item
function createProjectItem(imageSrc, title, category, size) {
  const columnDiv = document.createElement('div');
  columnDiv.classList.add('column-xs-12', getColumnClass(size));

  const figure = document.createElement('figure');
  figure.classList.add('img-container');

  const img = document.createElement('img');
  img.src = imageSrc;

  const figcaptionContent = `
    <h2 class="title">${title}</h2>
    <h3 class="category">${category}</h3>
  `;

  const figcaption = document.createElement('figcaption');
  figcaption.classList.add('img-content');
  figcaption.innerHTML = figcaptionContent;

  figure.appendChild(img);
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
        const projectItem = createProjectItem(project.imageSrc, project.title, project.category, project.size);
        galleryContainer.appendChild(projectItem);
      });
    } else {
      projectData
        .filter(project => project.category === category)
        .forEach(project => {
          const projectItem = createProjectItem(project.imageSrc, project.title, project.category, project.size);
          galleryContainer.appendChild(projectItem);
        });
    }
  });
}


populateTabs();
filterProjectsByCategory('');
