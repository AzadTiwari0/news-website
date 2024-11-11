const API_KEY = "dbca4a4813574632a6bff84e166ed4da";
const baseUrl = "https://newsapi.org/v2/";

window.addEventListener("load", () => fetchNews("general")); // Load general daily news by default

// Function to fetch latest news for a specific category or search query
async function fetchNews(query, isSearch = false) {
    let url = "";

    // Check if we need to use 'top-headlines' (for categories) or 'everything' (for search)
    if (isSearch) {
        url = `${baseUrl}everything?q=${query}&apiKey=${API_KEY}&sortBy=publishedAt`;
    } else {
        // Replacing "crypto" and "ai" with "technology" and "science" respectively
        if (query === "crypto") {
            query = "technology"; // Replace Crypto with Technology
        } else if (query === "ai") {
            query = "science"; // Replace AI with Science
        }
        url = `${baseUrl}top-headlines?category=${query}&apiKey=${API_KEY}&sortBy=publishedAt`;
    }

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

// Function to bind news data to the UI
function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = ""; // Clear existing news

    articles.forEach((article) => {
        if (!article.urlToImage) return; // Skip articles without images
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

// Function to fill data into a news card
function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;

    // Format the date as Day Month Year
    const date = new Date(article.publishedAt);
    const formattedDate = formatDate(date);

    newsSource.innerHTML = `${article.source.name} · ${formattedDate}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

// Function to format the date to Day Month Year format (e.g., 26 August 2023)
function formatDate(date) {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return date.toLocaleDateString("en-GB", options); // Returns date in the format: Day Month Year
}

let curSelectedNav = null;
// Function to handle navigation item click
function onNavItemClick(id) {
    const isSearch = id === "crypto" || id === "ai"; // For these, we will perform a search instead of using category
    fetchNews(id, !isSearch); // Fetch based on category or search (for crypto and ai)
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

// Handle search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query, true); // Pass `true` to indicate a search query with latest news sorting
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
