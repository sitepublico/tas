// Função para inicializar o List.js para uma lista fornecida
function initializeList(listId, options) {
  var listObj = new List(listId, options);

  function updateNoResultsMessage() {
    var noResults = document.querySelector('#' + listId + ' .no-results');
    if (noResults) {
      if (listObj.matchingItems.length === 0) {
        noResults.style.display = 'block';
      } else {
        noResults.style.display = 'none';
      }
    }
  }

  // Expõe a função updateNoResultsMessage
  listObj.updateNoResultsMessage = updateNoResultsMessage;

  // Atualiza a mensagem "Nenhum item encontrado." inicialmente
  updateNoResultsMessage();

  // Escuta o evento 'updated' do List.js para atualizar a mensagem
  listObj.on('updated', function () {
    updateNoResultsMessage();
  });

  return listObj;
}

// Verifica se a lista de Tecnologias está presente na página
if (document.getElementById('tecnologias-list')) {
  // Opções para o List.js para Tecnologias
  var tecnologiaOptions = {
    // Campos a serem indexados para busca e filtragem
    valueNames: [
      'name',
      { data: ['titulo'] },
      { data: ['descricao'] },
      { data: ['categoria'] },
      { data: ['etapa'] },
      { data: ['custo'] },
      { data: ['plataforma'] },
      { data: ['requer_internet'] },
    ],
  };

  // Inicializa a lista de Tecnologias
  var tecnologiaList = initializeList('tecnologias-list', tecnologiaOptions);

  // Manipulação do campo de busca
  var searchInput = document.getElementById('search-input');
  var typingTimer;
  var doneTypingInterval = 250; // Tempo em milissegundos (0.25 segundos)
  if (searchInput) {
    // Evento para quando o usuário solta uma tecla no campo de busca
    searchInput.addEventListener('keyup', function () {
      clearTimeout(typingTimer);
      typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    // Evento para quando o usuário pressiona uma tecla no campo de busca
    searchInput.addEventListener('keydown', function () {
      clearTimeout(typingTimer);
    });

    // Função a ser executada após o usuário parar de digitar
    function doneTyping() {
      var searchString = searchInput.value.trim();
      var nonSpaceCharacters = searchString.replace(/\s/g, '');
      if (nonSpaceCharacters.length >= 2) {
        // Realiza a busca nos campos especificados
        tecnologiaList.search(searchString, [
          'titulo',
          'descricao',
          'categoria',
          'etapa',
          'custo',
          'plataforma',
          'requer_internet',
        ]);
      } else {
        // Limpa a busca se tiver menos de 2 caracteres
        tecnologiaList.search();
      }

      // Atualiza a mensagem "Nenhum item encontrado."
      tecnologiaList.updateNoResultsMessage();

      // Atualiza a visibilidade do botão "Limpar Filtros"
      updateClearFiltersButtonVisibility();
    }
  }

  // Manipulação dos filtros
  var filters = {
    categoria: '',
    etapa: '',
    custo: '',
    plataforma: '',
    requer_internet: '',
  };

  function applyFilters() {
    tecnologiaList.filter(function (item) {
      var match = true;
      var values = item.values();

      // Filtro de Categoria (Correspondência exata)
      if (filters.categoria && values.categoria !== filters.categoria) {
        match = false;
      }

      // Filtro de Etapa (Correspondência parcial, sem diferenciação de maiúsculas)
      if (filters.etapa) {
        if (
          !values.etapa ||
          !values.etapa.toLowerCase().includes(filters.etapa.toLowerCase())
        ) {
          match = false;
        }
      }

      // Filtro de Custo (Correspondência exata)
      if (filters.custo && values.custo !== filters.custo) {
        match = false;
      }

      // Filtro de Plataforma (Correspondência exata)
      if (filters.plataforma && values.plataforma !== filters.plataforma) {
        match = false;
      }

      // Filtro de Requer Internet (Correspondência exata)
      if (
        filters.requer_internet &&
        values.requer_internet !== filters.requer_internet
      ) {
        match = false;
      }

      return match;
    });

    // Atualiza a mensagem "Nenhum item encontrado."
    tecnologiaList.updateNoResultsMessage();

    // Atualiza a visibilidade do botão "Limpar Filtros"
    updateClearFiltersButtonVisibility();
  }

  // Função para atualizar a visibilidade do botão "Limpar Filtros"
  function updateClearFiltersButtonVisibility() {
    var isAnyFilterActive =
      filters.categoria ||
      filters.etapa ||
      filters.custo ||
      filters.plataforma ||
      filters.requer_internet;
    var isSearchActive = searchInput && searchInput.value.trim() !== '';
    var clearFiltersButton = document.getElementById('clear-filters');

    if (isAnyFilterActive || isSearchActive) {
      clearFiltersButton.style.display = 'block';
    } else {
      clearFiltersButton.style.display = 'none';
    }
  }

  // Manipulação do Dropdown de Plataforma/Requer Internet
  var plataformaDropdownItems = document.querySelectorAll(
    '#plataformaDropdown + .dropdown-menu .dropdown-item'
  );

  plataformaDropdownItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();

      // Verifica quais atributos de dados estão presentes e atualiza os filtros
      if (item.hasAttribute('data-plataforma')) {
        filters.plataforma = item.getAttribute('data-plataforma') || '';
      }

      if (item.hasAttribute('data-requer_internet')) {
        filters.requer_internet = item.getAttribute('data-requer_internet') || '';
      }

      applyFilters();

      // Atualiza o texto do botão do dropdown
      var button = e.target.closest('.dropdown').querySelector('.dropdown-toggle');

      // Atualiza o texto do botão para refletir as opções selecionadas
      var plataformaText = filters.plataforma || '';
      var requerInternetText = filters.requer_internet || '';

      if (plataformaText && requerInternetText) {
        button.textContent = plataformaText + ' / ' + requerInternetText;
      } else if (plataformaText) {
        button.textContent = plataformaText;
      } else if (requerInternetText) {
        button.textContent = requerInternetText;
      } else {
        button.textContent = 'Plataforma / Requer Internet';
      }
    });
  });

  // Adicione aqui a configuração dos outros dropdowns (Categoria, Etapa, Custo)
  // ... (mantenha o código existente para os outros filtros)

  // Botão "Limpar Filtros"
  var clearFiltersButton = document.getElementById('clear-filters');
  clearFiltersButton.addEventListener('click', function () {
    // Resetar valores dos filtros
    filters.categoria = '';
    filters.etapa = '';
    filters.custo = '';
    filters.plataforma = '';
    filters.requer_internet = '';

    // Resetar texto dos botões de dropdown para o padrão
    document.querySelector('#categoriaDropdown').textContent = 'Categoria';
    document.querySelector('#etapaDropdown').textContent = 'Etapa de Ensino';
    document.querySelector('#custoDropdown').textContent = 'Custo';
    document.querySelector('#plataformaDropdown').textContent =
      'Plataforma / Requer Internet';

    // Resetar campo de busca
    if (searchInput) {
      searchInput.value = '';
      tecnologiaList.search(); // Limpar busca
    }

    // Limpar todos os filtros no List.js
    tecnologiaList.filter(); // Remover todos os filtros

    // Atualizar a mensagem "Nenhum item encontrado."
    tecnologiaList.updateNoResultsMessage();

    // Esconder o botão "Limpar Filtros"
    clearFiltersButton.style.display = 'none';
  });
}

// Verifica se a lista de Recursos está presente na página
if (document.getElementById('recursos-list')) {
  // Opções para o List.js para Recursos
  var recursosOptions = {
    // Campos a serem indexados para busca e filtragem
    valueNames: ['name', 'categoria'], // Indexa a classe 'categoria'
  };

  // Inicializa a lista de Recursos
  var recursosList = initializeList('recursos-list', recursosOptions);

  // Manipulação do filtro de Categoria para Recursos
  // ... (mantenha o código existente ou adapte conforme necessário)
}


// Check if the Resources List is present on the page
if (document.getElementById('recursos-list')) {
  // Options for List.js for Resources
  var recursosOptions = {
    // Fields to index for search and filtering
    valueNames: ['name', 'categoria'], // Index the 'categoria' class
  };

  // Initialize the Resources List
  var recursosList = initializeList('recursos-list', recursosOptions);

  // Category Filter Handling
  var recursosCategoryDropdownItems = document.querySelectorAll(
    '#recursosCategoriaDropdown + .dropdown-menu .dropdown-item'
  );
  recursosCategoryDropdownItems.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      var category = item.getAttribute('data-value') || '';
      if (category) {
        // Filter items by category
        recursosList.filter(function (item) {
          return item.values().categoria === category;
        });
      } else {
        // Remove filters to show all items
        recursosList.filter();
      }

      // Update the dropdown button text
      var button = e.target.closest('.dropdown').querySelector('.dropdown-toggle');
      button.textContent = e.target.textContent;

      // Update the "No Results" message using the exposed function
      recursosList.updateNoResultsMessage();
    });
  });
}
