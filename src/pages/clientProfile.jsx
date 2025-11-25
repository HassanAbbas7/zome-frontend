import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './clientProfile.css';

const ClientProfile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [groupedData, setGroupedData] = useState({});
    const { profileCode } = useParams();

     useEffect(() => {
    const fetchData = async () => {
        try {
            const fetchFromUrl = async (url) => {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            };

            const primaryUrl = `https://hassanabbasnaqvi.pythonanywhere.com/api/profile/${profileCode}`;
            const fallbackUrl = `http://127.0.0.1:3000/api/profile/${profileCode}`;
            
            let result;

            try {
                result = await fetchFromUrl(primaryUrl);
            } catch (primaryError) {
                console.warn('Primary profile API failed, trying localhost:', primaryError);
                result = await fetchFromUrl(fallbackUrl);
            }

            setData(result);
            organizeData(result);
            
        } catch (err) {
            setError('Failed to fetch profile data from both servers: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, [profileCode]); 

    const getValue = (key, dataObj = data) => {
        if (!dataObj || dataObj[key] === undefined || dataObj[key] === null) {
            return 'N/A';
        }
        const value = dataObj[key];
        return value === '' || value === '-----' || !value ? 'N/A' : value;
    };

    const shouldDisplay = (value) => {
        return value !== 'N/A' && value !== '' && value !== '-----' && value !== false && value !== null;
    };

    const organizeData = (apiData) => {
        const groups = {
            basicInfo: {},
            contact: {},
            classification: {},
            consent: {},
            notes: {},
            properties: {},
            family: {},
            proposals: {},
            visits: {},
            acquisitions: {},
            other: {}
        };

        Object.keys(apiData).forEach(key => {
            const value = apiData[key];
            
            if (!shouldDisplay(value)) return;

            const cleanKey = key.trim();

            if (cleanKey.startsWith('Note') || cleanKey.includes('name_') || cleanKey.includes('description') || cleanKey.includes('date')) {
                groups.notes[cleanKey] = value;
            }
            else if (cleanKey.startsWith('Família')) {
                groups.family[cleanKey] = value;
            }
            else if (cleanKey.includes('consent') || cleanKey.includes('Consent') || 
                     cleanKey === 'SMS' || cleanKey === 'Chamada' || cleanKey === 'Carta Postal' ||
                     cleanKey === 'Com consentimento tácito' || cleanKey === 'Com consentimento explícito' ||
                     cleanKey === 'Sem consentimento' || cleanKey === 'Newsletter para campanhas de email') {
                groups.consent[cleanKey] = value;
            }
            else if (cleanKey.includes('Imóveis de interesse') || cleanKey.includes('imóvel') || cleanKey.includes('ZMID') || cleanKey.includes('Preço') || cleanKey.includes('Estado')) {
                groups.properties[cleanKey] = value;
            }
            else if (cleanKey.includes('Propostas')) {
                groups.proposals[cleanKey] = value;
            }
            else if (cleanKey.includes('Visitas feitas')) {
                groups.visits[cleanKey] = value;
            }
            else if (cleanKey.includes('Angariacoes')) {
                groups.acquisitions[cleanKey] = value;
            }
            else if (['Nome', 'Apelido', 'Género', 'Data de aniversário', 'NIF', 'BI/CC', 'Nickname', 'Nº de Filhos'].includes(cleanKey)) {
                groups.basicInfo[cleanKey] = value;
            }
            else if (['Telemóvel', 'Email', 'Telefone', 'Facebook', 'Linkedin', 'Contacto'].includes(cleanKey)) {
                groups.contact[cleanKey] = value;
            }
            else if (['Classificação', 'Tipo de cliente', 'Fonte do contacto', 'Consultor', 'Cliente empresarial', 'Tipo de cliente'].includes(cleanKey)) {
                groups.classification[cleanKey] = value;
            }
            else {
                groups.other[cleanKey] = value;
            }
        });

        setGroupedData(groups);
    };

    const renderFieldGroup = (title, fields, groupKey) => {
        if (!fields || Object.keys(fields).length === 0) return null;

        return (
            <div className="profile-section">
                <div className="section-header">
                    <h3 className="section-title">{title}</h3>
                    <div className="section-divider"></div>
                </div>
                <div className="fields-grid">
                    {Object.entries(fields).map(([key, value]) => (
                        <div key={key} className="field-item">
                            <label className="field-label">{formatFieldName(key)}</label>
                            <div className="field-value-container">
                                <span className={`field-value ${typeof value === 'boolean' ? `status-badge ${value ? 'active' : 'inactive'}` : ''}`}>
                                    {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const formatFieldName = (fieldName) => {
        return fieldName
            .replace(/_/g, ' ')
            .replace(/^\s+|\s+$/g, '')
            .replace(/\s+/g, ' ')
            .replace(/^[0-9]/, '')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const renderNotes = () => {
        if (!groupedData.notes || Object.keys(groupedData.notes).length === 0) return null;

        const notesMap = {};
        
        Object.entries(groupedData.notes).forEach(([key, value]) => {
            const noteMatch = key.match(/Note\s*(\d+)\s*(name_|description|date)/i);
            if (noteMatch) {
                const noteNum = noteMatch[1];
                const fieldType = noteMatch[2].toLowerCase();
                
                if (!notesMap[noteNum]) {
                    notesMap[noteNum] = {};
                }
                notesMap[noteNum][fieldType] = value;
            }
        });

        const validNotes = Object.values(notesMap).filter(note => 
            note.name_ && note.description && note.date && 
            shouldDisplay(note.name_) && shouldDisplay(note.description) && shouldDisplay(note.date)
        );

        if (validNotes.length === 0) return null;

        return (
            <div className="profile-section">
                <div className="section-header">
                    <h3 className="section-title">Notes History</h3>
                    <div className="section-divider"></div>
                </div>
                <div className="notes-timeline">
                    {validNotes.map((note, index) => (
                        <div key={index} className="timeline-item">
                            <div className="timeline-marker"></div>
                            <div className="timeline-content">
                                <div className="note-header">
                                    <h4 className="note-title">{note.name_}</h4>
                                    <span className="note-date">{formatDate(note.date)}</span>
                                </div>
                                <p className="note-description">{note.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderFamily = () => {
        if (!groupedData.family || Object.keys(groupedData.family).length === 0) return null;
        const familyMap = {};

        Object.entries(groupedData.family).forEach(([key, value]) => {
            const familyMatch = key.match(/Família\s*(\d+)\s*(id|nome|grau|telefone|email|tipo)/i);
            if (familyMatch) {
                const familyNum = familyMatch[1];
                const fieldType = familyMatch[2].toLowerCase();
                
                if (!familyMap[familyNum]) {
                    familyMap[familyNum] = {};
                }
                familyMap[familyNum][fieldType] = value;
            }
        });

        const validFamilies = Object.values(familyMap).filter(family => 
            family.nome &&
            family.grau
        );

        if (validFamilies.length === 0) return null;

        return (
            <div className="profile-section">
                <div className="section-header">
                    <h3 className="section-title">Family Members</h3>
                    <div className="section-divider"></div>
                </div>
                <div className="family-grid">
                    {validFamilies.map((family, index) => (
                        <div key={index} className="family-card">
                            <div className="family-avatar">
                                <span>{family.nome.charAt(0).toUpperCase()}</span>
                            </div>
                            <div className="family-info">
                                <h4 className="family-name">{family.nome}</h4>
                                <p className="family-relationship">{family.grau}</p>
                                <div className="family-contacts">
                                    {family.telefone && (
                                        <div className="contact-item">
                                            <span className="contact-icon">📱</span>
                                            <span>{family.telefone}</span>
                                        </div>
                                    )}
                                    {family.email&& (
                                        <div className="contact-item">
                                            <span className="contact-icon">✉️</span>
                                            <span>{family.email}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderProperties = () => {
        if (!groupedData.properties || Object.keys(groupedData.properties).length === 0) return null;

        const propertiesMap = {};

        Object.entries(groupedData.properties).forEach(([key, value]) => {
            const propMatch = key.match(/Imóveis de interesse\s*(\d+)\s*(Estado|Fotografia|ZMID|Nickname do imóvel|Preço|Data registo)/i);
            if (propMatch) {
                const propNum = propMatch[1];
                const fieldType = propMatch[2].toLowerCase();
                
                if (!propertiesMap[propNum]) {
                    propertiesMap[propNum] = {};
                }
                propertiesMap[propNum][fieldType] = value;
            }
        });

        const validProperties = Object.values(propertiesMap).filter(property => 
            property.zmid && property.zmid !== '-----' && property.zmid !== ''
        );

        if (validProperties.length === 0) return null;

        return (
            <div className="profile-section">
                <div className="section-header">
                    <h3 className="section-title">Properties of Interest</h3>
                    <div className="section-divider"></div>
                </div>
                <div className="properties-grid">
                    {validProperties.map((property, index) => (
                        <div key={index} className="property-card">
                            <div className="property-image">
                                <div className="property-placeholder">
                                    🏠
                                </div>
                                <div className="property-status">
                                    <span className={`status-tag ${property.estado?.toLowerCase() || 'unknown'}`}>
                                        {property.estado || 'N/A'}
                                    </span>
                                </div>
                            </div>
                            <div className="property-details">
                                <h4 className="property-title">{property.nickname || 'Unnamed Property'}</h4>
                                <div className="property-info">
                                    <div className="info-item">
                                        <span className="info-label">ZMID:</span>
                                        <span className="info-value">{property.zmid}</span>
                                    </div>
                                    {property.preço && property.preço !== '-----' && (
                                        <div className="info-item">
                                            <span className="info-label">Price:</span>
                                            <span className="info-value price">{property.preço}</span>
                                        </div>
                                    )}
                                    {property.data && property.data !== '-----' && (
                                        <div className="info-item">
                                            <span className="info-label">Registered:</span>
                                            <span className="info-value">{formatDate(property.data)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString === 'N/A') return dateString;
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading client profile...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h2>Error Loading Profile</h2>
                <p>{error}</p>
                <button className="retry-button" onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="no-data-container">
                <div className="no-data-icon">📋</div>
                <h2>No Data Available</h2>
                <p>No client profile data found for this ID.</p>
            </div>
        );
    }

    return (
        <div className="client-profile">
            {/* Header Section */}
            <header className="profile-header">
                <div className="header-content">
                    <div className="client-avatar">
                        <span>{getValue('Nome')?.charAt(0) || 'C'}</span>
                    </div>
                    <div className="client-info">
                        <h1 className="client-name">{getValue('Nome')} {getValue('Apelido')}</h1>
                        <p className="client-meta">
                            ID: <span className="highlight">{getValue('id')}</span> • 
                            Lead: <span className="highlight">{getValue('leadId')}</span> • 
                            Consultant: <span className="highlight">{getValue('Consultor')}</span>
                        </p>
                    </div>
                    <div className="header-actions">
                        <button className="action-button primary">
                            Edit Profile
                        </button>
                        <button className="action-button secondary">
                            Export Data
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="profile-content">
                <div className="content-grid">
                    {/* Left Column - Basic Info */}
                    <div className="content-column">
                        {renderFieldGroup('Basic Information', groupedData.basicInfo, 'basic-info')}
                        {renderFieldGroup('Contact Information', groupedData.contact, 'contact')}
                        {renderFieldGroup('Classification', groupedData.classification, 'classification')}
                    </div>

                    {/* Right Column - Detailed Info */}
                    <div className="content-column">
                        {renderFieldGroup('Consent & Communication', groupedData.consent, 'consent')}
                        {renderNotes()}
                        {renderFamily()}
                    </div>

                    {/* Full Width Sections */}
                    <div className="content-fullwidth">
                        {renderProperties()}
                        {renderFieldGroup('Proposals', groupedData.proposals, 'proposals')}
                        {renderFieldGroup('Visits', groupedData.visits, 'visits')}
                        {renderFieldGroup('Acquisitions', groupedData.acquisitions, 'acquisitions')}
                        {renderFieldGroup('Additional Information', groupedData.other, 'other')}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ClientProfile;
