# Fruits Store — SAP Fiori Internship Assessment

> A **Master-Detail web application** for browsing fruit details, built with pure HTML, CSS, and JavaScript as part of the **Solex Fiori Technical Assessment**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-brightgreen?style=for-the-badge&logo=github)](https://ahmedebeid54.github.io/solex-fiori-task/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/ahmedebeid54/solex-fiori-task)

---

## 🔗 Live Preview

👉 **[https://ahmedebeid54.github.io/solex-fiori-task/](https://ahmedebeid54.github.io/solex-fiori-task/)**

---

## ✨ Features

- **Master-Detail Layout** — Browse a fruit list on the left, view full details on the right
- **Live Search** — Filter the fruit list by name in real time
- **Tabbed Detail View** — Switch between **Supplier Info** and **More Data** tabs
- **Supplier Table** — View supplier details with an editable City field
- **City Value Help (F4)** — Searchable modal dialog to select an Egyptian governorate
- **Save & Cancel** — Save edited supplier city data per fruit (in-memory cache), or discard changes
- **Active Selection State** — Selected fruit is highlighted in the list

---

## 🗂️ Project Structure

```
solex-fiori-task/
├── index.html          # Main HTML with all <template> elements
├── style.css           # Custom styles
├── app.js              # All JavaScript logic
├── data/
│   ├── fruits.json     # Fruit data (name, category, price, suppliers…)
│   └── cities.json     # Egyptian governorates for city value help
└── images/
    ├── logo.ico
    └── logo-removebg-preview.png
```

---



## 📦 Data Format

### `fruits.json`
```json
{
  "Fruits": [
    {
      "id": 1,
      "name": "Apple",
      "category": "Alkaline",
      "type": "Pome",
      "price": 40,
      "unit": "kg",
      "image": "https://...",
      "description": "A crisp and sweet fruit.",
      "suppliers": [
        {
          "name": "Fresh Co.",
          "sinceWhen": "2018",
          "city": "Cairo",
          "contactPerson": "Ahmed Ali",
          "phone": "+20 100 000 0000"
        }
      ]
    }
  ]
}
```

### `cities.json`
```json
{
    "cities": [   
 
{"id":"1","governorate_name_ar":"القاهرة","governorate_name_en":"Cairo"},
{"id":"2","governorate_name_ar":"الجيزة","governorate_name_en":"Giza"},
{"id":"3","governorate_name_ar":"الأسكندرية","governorate_name_en":"Alexandria"},
{"id":"4","governorate_name_ar":"الدقهلية","governorate_name_en":"Dakahlia"},
  ]
}
```

---

## 🧱 How It Works

| Part | Description |
|------|-------------|
| **Templates** | All UI built with `<template>` + `cloneNode(true)` — no framework needed |
| **Tabs** | `data-tab` attributes + event delegation — no inline `onclick` |
| **Save/Cancel** | Edits stored in a `Map` cache; Cancel re-fetches original JSON |
| **City F4** | Modal with live search over `cities.json` governorates |
| **Error Handling** | `fetch()` failures show a friendly error message in the list |

---

## ✅ Assessment Checklist

| Requirement | Status |
|-------------|--------|
| Master-Detail layout | ✅ |
| Fruit list — image, name, category, price | ✅ |
| Search / filter field | ✅ |
| Detail panel — image, name, description | ✅ |
| Supplier Info tab with table | ✅ |
| More Data tab | ✅ |
| City value help (F4 / modal) | ✅ |
| Save & Cancel buttons | ✅ |
| Selecting item updates right panel | ✅ |
| Custom CSS styling ⭐ | ✅ |
| Uploaded to GitHub | ✅ |
| Deployed (GitHub Pages) | ✅ |

---

## 🌐 Deployment

Deployed via **GitHub Pages** from the `main` branch.

🔗 [https://ahmedebeid54.github.io/solex-fiori-task/](https://ahmedebeid54.github.io/solex-fiori-task/)

---

## 🎨 Technologies

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 👤 Author

**Ahmed Ebeid**  
Solex Pioneer Path Candidate  
🔗 [GitHub Profile](https://github.com/ahmedebeid54)
