import React, { useState, useEffect } from 'react';
import './Dashboard.css';
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

  const navigate = useNavigate();
  // Fetch data from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch('http://127.0.0.1:8000/api/get-data/');
        const data = await response.json();
        
        // Transform the API data into a more usable format
        const transformedData = transformApiData(data);
        setClients(transformedData);
        setFilteredClients(transformedData);
      } catch (err) {
        setError('Failed to fetch client data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Transform API data from object of arrays to array of objects
  const transformApiData = (apiData) => {
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

  // Filter clients based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client =>
        client.Nome?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [searchTerm, clients]);

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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados dos clientes...</p>
      </div>
    );
  }

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
          <p>Total: {clients.length} clientes</p>
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

        {/* Table Footer */}
        <div className="table-footer">
          <div className="footer-info">
            Mostrando {sortedClients.length} de {clients.length} clientes
            {searchTerm && ` para "${searchTerm}"`}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;