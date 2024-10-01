import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("query");

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:9000/users/search?query=${query}`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <h2 style={{ textAlign: "center", margin: "50px" }}>
        Search Results for "{query}"
      </h2>
      {results.length > 0 ? (
        <ul>
          {results.map((product, i) => (
            <React.Fragment key={i}>
              <div className="item-details">
                <img src={product.image} alt="" />
                <div className="item-info">
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/items/item-details/${product._id}`}
                  >
                    <h6>{product.name}</h6>
                  </Link>
                  <p>{product.description}</p>
                  <p>Rs. {product.price}</p>
                </div>
              </div>
              <br />
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: "center", margin: "50px" }}>
          No results found for "{query}".
        </p>
      )}
    </div>
  );
}

export default SearchResults;
