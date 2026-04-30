const editedFruitsCache = new Map();

// Get template references
const supplierTemplate = document.getElementById("fruit-supplier-template");
const moreDataTemplate = document.getElementById("fruit-more-data-template");

// Helper function to escape HTML
function escapeHtml(str) {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// Value Help Modal for City Selection
function showCityValueHelp(currentValue, callback) {
  const modal = document.createElement("div");
  modal.className = "value-help-modal";

  modal.innerHTML = `
        <div class="help-div" >
          <div class="city-header" >
             Select City
            <button class="close-modal">&times;</button>
          </div>
          <div class="city-content" >
            <input type="text" placeholder="Search cities..." class="city-search" >
            <div class="city-list" >
              ${availableCities
                .map(
                  (city) => `
                <div class="city-item" data-city="${city}">
                  ${escapeHtml(city)}
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `;

  document.body.appendChild(modal);

  const searchInput = modal.querySelector(".city-search");
  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const items = modal.querySelectorAll(".city-item");
    items.forEach((item) => {
      const cityName = item.dataset.city.toLowerCase();
      item.style.display = cityName.includes(searchTerm) ? "block" : "none";
    });
  });

  modal.querySelectorAll(".city-item").forEach((item) => {
    item.addEventListener("click", () => {
      callback(item.dataset.city);
      document.body.removeChild(modal);
    });

    item.addEventListener("mouseenter", () => {
      item.style.backgroundColor = "#e3f2fd";
    });

    item.addEventListener("mouseleave", () => {
      item.style.backgroundColor = "";
    });
  });

  modal.querySelector(".close-modal").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}

// Create supplier row
function createSupplierRow(supplier, index) {
  const row = document.createElement("tr");
  row.innerHTML = `
        <td>${escapeHtml(supplier.name)}</td>
        <td>${escapeHtml(supplier.sinceWhen)}</td>
        <td>
          <div >
            <input type="text" value="${escapeHtml(
              supplier.city
            )}" class="city-input" data-index="${index}" />
            <button class="value-help-btn" data-index="${index}">F4</button>
          </div>
        </td>
        <td>${escapeHtml(supplier.contactPerson)}</td>
        <td>${escapeHtml(supplier.phone)}</td>
      `;
  return row;
}

// Create supplier table
function createSupplierTable(suppliers) {
  const clone = supplierTemplate.content.cloneNode(true);
  const tbody = clone.querySelector("tbody");
  tbody.innerHTML = "";

  suppliers.forEach((supplier, index) => {
    tbody.appendChild(createSupplierRow(supplier, index));
  });

  return clone;
}

// Create more data section
function createMoreData(fruit) {
  const clone = moreDataTemplate.content.cloneNode(true);
  clone.querySelector(".more-data-type").textContent = escapeHtml(fruit.type);
  clone.querySelector(
    ".more-data-price"
  ).textContent = `${fruit.price} / ${fruit.unit}`;
  clone.querySelector(".more-data-main-supplier").textContent = escapeHtml(
    fruit.suppliers[0]?.name || "N/A"
  );
  return clone;
}

// Setup event listeners for detail panel
function setupEventListeners(panel, fruit) {
  // Get the cached or current fruit data
  const currentFruit = editedFruitsCache.has(fruit.name)
    ? editedFruitsCache.get(fruit.name)
    : fruit;

  // Tab switching
  const tabs = panel.querySelector(".tabs");
  if (tabs) {
    // Remove existing listeners by cloning
    const newTabs = tabs.cloneNode(true);
    tabs.parentNode.replaceChild(newTabs, tabs);

    newTabs.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const tabName = e.target.dataset.tab;
        openTab(tabName, panel);

        // Update active tab styling
        newTabs.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove("active");
        });
        e.target.classList.add("active");
      }
    });
  }

  // F4 buttons - Event delegation (only one listener)
  panel.addEventListener("click", (e) => {
    if (e.target.classList.contains("value-help-btn")) {
      const index = e.target.dataset.index;
      const input = panel.querySelector(`.city-input[data-index="${index}"]`);
      if (input) {
        showCityValueHelp(input.value, (selectedCity) => {
          input.value = selectedCity;
        });
      }
    }
  });

  // Save button
  const saveBtn = panel.querySelector(".save-btn");
  if (saveBtn) {
    const newSaveBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);

    newSaveBtn.addEventListener("click", () => {
      // Collect all changes
      const updatedFruit = JSON.parse(JSON.stringify(currentFruit));
      const cityInputs = panel.querySelectorAll(".city-input");

      cityInputs.forEach((input) => {
        const index = parseInt(input.dataset.index);
        if (updatedFruit.suppliers && updatedFruit.suppliers[index]) {
          updatedFruit.suppliers[index].city = input.value;
        }
      });

      // Save to cache
      editedFruitsCache.set(currentFruit.name, updatedFruit);
      console.log("Saving changes for:", currentFruit.name);
      alert(`✓ Changes saved for ${currentFruit.name}`);
    });
  }

  // Cancel button
  const cancelBtn = panel.querySelector(".cancel-btn");
  if (cancelBtn) {
    const newCancelBtn = cancelBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

    newCancelBtn.addEventListener("click", () => {
      if (
        confirm("Discard all changes? This will revert to the original data.")
      ) {
        editedFruitsCache.delete(currentFruit.name);
        // Reload original from fetch
        fetch("data/fruits.json")
          .then((response) => response.json())
          .then((data) => {
            const originalFruit = data.Fruits.find(
              (f) => f.name === currentFruit.name
            );
            if (originalFruit) {
              showDetail(originalFruit);
            }
          })
          .catch((error) => {
            console.error("Error reloading fruit:", error);
            showDetail(currentFruit);
          });
      }
    });
  }
}

// Show fruit details
function showDetail(fruit) {
  const detailPanel = document.querySelector(".fruit-details");
  const detailsTemplate = document.getElementById("fruit-detail-template");

  if (!detailPanel || !detailsTemplate) return;

  // Get cached version if exists
  const fruitToShow = editedFruitsCache.has(fruit.name)
    ? editedFruitsCache.get(fruit.name)
    : JSON.parse(JSON.stringify(fruit));

  // Clear panel and remove old listeners by replacing with new element
  const newDetailPanel = detailPanel.cloneNode(false);
  detailPanel.parentNode.replaceChild(newDetailPanel, detailPanel);

  // Setup main Detail View
  const mainClone = detailsTemplate.content.cloneNode(true);

  mainClone.querySelector(".detail-name").textContent = fruitToShow.name;
  mainClone.querySelector(".detail-img").src = fruitToShow.image;
  mainClone.querySelector(".detail-img").alt = fruitToShow.name;
  mainClone.querySelector(".detail-description").textContent =
    fruitToShow.description;

  // Setup Supplier Table
  const supplierContainer = mainClone.querySelector("#supplier-container");
  if (supplierContainer && fruitToShow.suppliers) {
    supplierContainer.appendChild(createSupplierTable(fruitToShow.suppliers));
  }

  // Setup More Data
  const moreDataContainer = mainClone.querySelector("#more-data-container");
  if (moreDataContainer) {
    moreDataContainer.appendChild(createMoreData(fruitToShow));
  }

  // Append to panel
  newDetailPanel.appendChild(mainClone);

  // Update the global reference
  const updatedDetailPanel = document.querySelector(".fruit-details");

  // Setup event listeners
  setupEventListeners(updatedDetailPanel, fruitToShow);

  // Open default tab
  openTab("supplier-container", updatedDetailPanel);
}

// Open specific tab
function openTab(tabName, container) {
  const contents = container.querySelectorAll(".tab-content");
  contents.forEach((content) => {
    content.style.display = "none";
  });

  const activeTab = container.querySelector(`#${tabName}`);
  if (activeTab) {
    activeTab.style.display = "block";
  }
}

function loadCities() {
  return fetch("data/cities.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load cities.json");
      }
      return response.json();
    })
    .then((data) => {
      availableCities = data.cities.map((city) => city.governorate_name_en);
      console.log("Cities loaded:", availableCities.length);
    })
    .catch((error) => {
      console.error("Error loading cities:", error);
      availableCities = [];
    });
}

// Load and display fruit list
function loadFruits() {
  fetch("data/fruits.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      const fruitList = document.querySelector(".fruit-items");
      const itemTemplate = document.getElementById("fruit-item-template");

      if (!fruitList || !itemTemplate) return;

      fruitList.innerHTML = "";

      if (!data.Fruits || !Array.isArray(data.Fruits)) {
        throw new Error("Invalid data structure");
      }

      data.Fruits.forEach((fruit) => {
        const clone = itemTemplate.content.cloneNode(true);
        clone.querySelector(".box-img").src = fruit.image;
        clone.querySelector(".box-img").alt = fruit.name;
        clone.querySelector(".fruit-name").textContent = fruit.name;
        clone.querySelector(".fruit-category").textContent = fruit.category;
        clone.querySelector(
          ".fruit-price-unit"
        ).textContent = `${fruit.price} / ${fruit.unit}`;

        const fruitItem = clone.querySelector(".fruit-item");
        fruitItem.addEventListener("click", () => {
          showDetail(fruit);
        });

        fruitList.appendChild(clone);
      });
    })
    .catch((error) => {
      console.error("Error loading fruits:", error);
      const fruitList = document.querySelector(".fruit-items");
      if (fruitList) {
        fruitList.innerHTML =
          '<li class="error">❌ Failed to load fruits. Please check if data/fruits.json exists.</li>';
      }
    });
}

// Initialize the app
loadCities();

loadFruits();
