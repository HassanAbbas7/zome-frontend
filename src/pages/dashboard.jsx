import React, { useState, useEffect, useRef } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('Nome');
  const [sortDirection, setSortDirection] = useState('asc');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);

  // Refs for request cancellation
  const abortControllerRef = useRef(null);
  const navigate = useNavigate();
  
  // Fetch initial data from API with pagination
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        
        const url = `http://127.0.0.1:5000/api/get-data/${currentPage}/`;
        const response = await fetch(url);
        const data = await response.json();
        
        
        const transformedData = transformApiData(data);
        setClients(transformedData);
        setFilteredClients(transformedData);
        
        // Check if next page exists by trying to fetch next page data
        setHasNextPage(transformedData.length > 0);
        setHasPreviousPage(currentPage > 1);
        
      } catch (err) {
        setError('Failed to fetch client data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (searchTerm.trim() === ''){
      setLoading(true);
      fetchClients();
    }
  }, [currentPage, searchTerm]); 

  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const fetchClients = async () => {
      try {
        setLoading(true);
        const url = `http://127.0.0.1:5000/api/search`;
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify({ name: searchTerm }),
          headers: {
            'Content-Type': 'application/json'
          },
          signal: signal // Attach abort signal to the request
        });

        // Check if the request was aborted
        if (signal.aborted) {
          console.log('Request was aborted');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const transformedData = transformApiData(data);
        setClients(transformedData);
        setFilteredClients(transformedData);
        
        setHasNextPage(transformedData.length > 0);
        setHasPreviousPage(currentPage > 1);
        
      } catch (err) {
        // Only set error if it's not an abort error
        if (err.name !== 'AbortError') {
          setError('Failed to fetch client data');
          console.error('Error fetching data:', err);
        }
      } finally {
        // Only stop loading if this request wasn't aborted
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
      // setLoading(false);
    } else {
      // Add a small delay to avoid making requests on every single keystroke
      const timeoutId = setTimeout(() => {
        fetchClients();
      }, 300); // 300ms delay

      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }
  }, [searchTerm, currentPage]);

  // Transform API data from object of arrays to array of objects
  const transformApiData = (apiData) => {
    // If apiData is already an array, return it directly
    if (Array.isArray(apiData)) {
      return apiData;
    }
    
    // If apiData has a results field (common in APIs)
    if (apiData.results && Array.isArray(apiData.results)) {
      return apiData.results;
    }
    
    // Original transformation logic for object of arrays
    const keys = Object.keys(apiData);
    const numberOfClients = apiData[keys[0]]?.length || 0;
    
    const transformed = [];
    for (let i = 0; i < numberOfClients; i++) {
      const client = {};
      keys.forEach(key => {
        client[key] = apiData[key][i];
      });
      transformed.push(client);
    }
    return transformed;
  };

  // Handle search input change
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    const aValue = a[sortField] || '';
    const bValue = b[sortField] || '';
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Handle next page
  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };

  // Handle previous page
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (phone === '-----') return '-';
    return phone;
  };

  // Format email for display
  const formatEmail = (email) => {
    if (email === '-----') return '-';
    return email;
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Rest of your component remains the same...
  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h3>Erro ao carregar dados</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="retry-btn">
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Lista de Clientes</h1>
          <p>Página {currentPage}</p>
        </div>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </header>

      {/* Clients Table */}
      <section className="clients-section">
        <div className="pagination-controls">
                <div className="pagination-buttons">
                  <button 
                    style={{ marginRight: '10px' }}
                    className="btn btn-secondary" 
                    onClick={handlePreviousPage}
                    disabled={!hasPreviousPage}
                  >
                    Página Anterior
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={handleNextPage}
                    disabled={!hasNextPage}
                  >
                    Próxima Página
                  </button>
                </div>
              </div>
        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Carregando dados dos clientes...</p>
          </div>
        ) : (
          <>
            <div className="table-container">
              {sortedClients.length === 0 ? (
                <div className="no-results">
                  <p>Nenhum cliente encontrado{searchTerm && ` para "${searchTerm}"`}</p>
                </div>
              ) : (
                <table className="clients-table">
                  <thead>
                    <tr>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('Nome')}
                      >
                        Nome {getSortIcon('Nome')}
                      </th>
                      <th>Telemóvel</th>
                      <th>Email</th>
                      <th 
                        className="sortable" 
                        onClick={() => handleSort('leadId')}
                      >
                        ID {getSortIcon('leadId')}
                      </th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedClients.map((client, index) => (
                      <tr key={client.leadId || index} className="client-row">
                        <td className="client-name">
                          <div className="name-avatar">
                            <span className="avatar">
                              {client.Nome ? client.Nome.charAt(0).toUpperCase() : '?'}
                            </span>
                            {client.Nome || 'Nome não disponível'}
                          </div>
                        </td>
                        <td className="client-phone">
                          {formatPhoneNumber(client.Telemóvel)}
                        </td>
                        <td className="client-email">
                          <span className={client.Email === '-----' ? 'no-data' : ''}>
                            {formatEmail(client.Email)}
                          </span>
                        </td>
                        <td className="client-id">
                          {client.leadId}
                        </td>
                        <td className="client-actions">
                          <button className="btn btn-primary">Contactar</button>
                          <Link to={"profile/" + client.leadId} className="btn btn-secondary" >Detalhes</Link> 
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Table Footer with Simple Pagination */}
            <div className="table-footer">
              <div className="footer-info">
                Página {currentPage} • {sortedClients.length} clientes
                {searchTerm && ` para "${searchTerm}"`}
              </div>
              
              
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
