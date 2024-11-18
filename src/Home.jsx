import { useState } from "react";
import classes from "./Home.module.css";

function Home() {
  // Initial data
  const initialData = [
    { state: "California", city: "Los Angeles" },
    { state: "Texas", city: "Houston" },
    { state: "New York", city: "New York City" },
    { state: "Florida", city: "Miami" },
    { state: "Illinois", city: "Chicago" },
  ];

  const [data, setData] = useState(initialData);
  const [newState, setNewState] = useState("");
  const [newCity, setNewCity] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Extract unique states for the dropdown
  const uniqueStates = Array.from(new Set(data.map((item) => item.state)));

  // Pagination
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // Add state handler
  const handleAddState = () => {
    if (!newState.trim()) {
      setError("State name cannot be empty.");
      return;
    }
    if (uniqueStates.some((state) => state.toLowerCase() === newState.trim().toLowerCase())) {
      setError("This state already exists.");
      return;
    }

    setData([...data, { state: newState.trim(), city: "" }]);
    setNewState("");
    setError("");
  };

  // Add city handler
  const handleAddCity = () => {
    if (!selectedState) {
      setError("Please select a state.");
      return;
    }
    if (!newCity.trim()) {
      setError("City name cannot be empty.");
      return;
    }
    if (
      data.some(
        (item) =>
          item.state.toLowerCase() === selectedState.toLowerCase() &&
          item.city.toLowerCase() === newCity.trim().toLowerCase()
      )
    ) {
      setError("This city already exists in the selected state.");
      return;
    }

    setData([...data, { state: selectedState, city: newCity.trim() }]);
    setNewCity("");
    setError("");
  };

  // Edit city handler
  const handleEditCity = (index) => {
    const updatedCity = prompt("Enter the new city name:", data[index].city);
    if (updatedCity === null || updatedCity.trim() === "") return;

    if (
      data.some(
        (item, i) =>
          i !== index &&
          item.city.toLowerCase() === updatedCity.trim().toLowerCase() &&
          item.state.toLowerCase() === data[index].state.toLowerCase()
      )
    ) {
      alert("This city already exists in the selected state.");
      return;
    }

    const updatedData = [...data];
    updatedData[index].city = updatedCity.trim();
    setData(updatedData);
  };

  // Delete city handler
  const handleDeleteCity = (index) => {
    if (window.confirm("Are you sure you want to delete this city?")) {
      const updatedData = data.filter((_, i) => i !== index);
      setData(updatedData);
    }
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className={classes.section1}>
      {/* Input and Add State/City */}
      <div className={classes.inputContainer}>
        {/* Add State */}
        <input
          type="text"
          placeholder="Enter State Name"
          value={newState}
          onChange={(e) => setNewState(e.target.value)}
          className={classes.inputField}
        />
        <button onClick={handleAddState} className={classes.addButton}>
          Save State
        </button>

        {/* Add City */}
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className={classes.selectField}
        >
          <option value="">Select State</option>
          {uniqueStates.map((state, index) => (
            <option key={index} value={state}>
              {state}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Enter City Name"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
          className={classes.inputField}
        />
        <button onClick={handleAddCity} className={classes.addButton}>
          Add City
        </button>
      </div>

      {/* Error Message */}
      {error && <div className={classes.error}>{error}</div>}

      {/* Table */}
      <div className={classes.tableContainer}>
        <table className={classes.responsiveTable}>
          <thead>
            <tr>
              <th>State</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, index) => (
              <tr key={index}>
                <td>{row.state}</td>
                <td>{row.city || "N/A"}</td>
                <td>
                  <button
                    onClick={() => handleEditCity(indexOfFirstRow + index)}
                    className={classes.editButton}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteCity(indexOfFirstRow + index)}
                    className={classes.deleteButton}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className={classes.pagination}>
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={classes.pageButton}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={classes.pageButton}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
