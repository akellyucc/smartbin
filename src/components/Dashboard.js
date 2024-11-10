import React, { useState, useEffect } from 'react';
import binService from '../services/binService';
import '../styles/Dashboard.css';
import BinDetails from './BinDetails';

const Dashboard = () => {
  const [totalBins, setTotalBins] = useState(0);
  const [fullBins, setFullBins] = useState(0);
  const [fullBinsDetails, setFullBinsDetails] = useState([]);
  const [nearFullBins, setNearFullBins] = useState(0);
  const [nearFullBinsDetails, setNearFullBinsDetails] = useState([]);
  const [binDetails, setBinDetails] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeRoutesDetails, setActiveRoutesDetails] = useState([]);
  const [collectionHistoryDetails, setCollectionHistoryDetails] = useState([]);

  // Fetch all data
  const fetchData = async () => {
    try {
      const totalBins = await binService.fetchTotalBinsMonitored();
      setTotalBins(totalBins);

      const fullBins = await binService.fetchTotalFullBins();
      setFullBins(fullBins);

      const fullBinsDetails = await binService.fetchFullBinsDetails();
      setFullBinsDetails(fullBinsDetails);

      const nearFullBinsDetails = await binService.fetchNearFullBinsDetails();
      setNearFullBinsDetails(nearFullBinsDetails);

      const nearFullBins = await binService.fetchNearFullBins();
      setNearFullBins(nearFullBins);

      const fetchedBinDetails = await binService.fetchBinDetails();
      setBinDetails(fetchedBinDetails);

      const activeRoutesDetails = await binService.fetchActiveRoutesDetails();
        setActiveRoutesDetails(activeRoutesDetails);

      const collectionHistoryDetails = await binService.fetchCollectionHistoryDetails();
        setCollectionHistoryDetails(collectionHistoryDetails);


    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch data initially and set up polling every 3 seconds
    fetchData();
    const intervalId = setInterval(fetchData, 3000);

    // Clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const metrics = [
    { title: 'Total Bins Monitored', value: totalBins, icon: '🗑️', details: 'totalBins' },
    { title: 'Full Bins Count', value: fullBins, icon: '❗', details: 'fullBinsDetails' },
    { title: 'Near Full Bins', value: nearFullBins, icon: '⚠️', details: 'nearFullBinsDetails' },
    { title: 'Collection History', value: 'Sep 14, 2024', icon: '📅' , details: 'collectionHistoryDetails'},
    { title: 'Active Routes', value: activeRoutesDetails.total, icon: '🚚', details: 'activeRoutesDetails' },
    { title: 'Total Waste Collected', value: `${collectionHistoryDetails.total} kg`, icon: '⚖️' },
  ];

  const handleMetricClick = (metric) => {
    if (metric.details) {
      setSelectedMetric(metric.details);
      setShowDetails(true);
    }
  };

  const getSelectedData = () => {
    switch (selectedMetric) {
      case 'totalBins':
        return binDetails;
      case 'fullBinsDetails':
        return fullBinsDetails;
      case 'nearFullBinsDetails':
        return nearFullBinsDetails;
      case 'activeRoutesDetails':
        return activeRoutesDetails;
      case 'collectionHistoryDetails':
        return collectionHistoryDetails;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className={`metric-card ${selectedMetric === metric.details ? 'selected' : ''}`}
          onClick={metric.details ? () => handleMetricClick(metric) : undefined}
        >
          <span className="icon">{metric.icon}</span>
          <div className="metric-info">
            <h3>{metric.title}</h3>
            <p>{metric.value}</p>
          </div>
        </div>
      ))}

      {showDetails && (
        <div className="details-modal" aria-labelledby="modal-title">
          <button
            className="close-button"
            onClick={() => setShowDetails(false)}
            aria-label="Close details modal"
          >
            &times;
          </button>
          <h2 id="modal-title">{metrics.find(m => m.details === selectedMetric)?.title} Details</h2>
          {getSelectedData() ? (
            <BinDetails data={getSelectedData()} />
          ) : (
            <p>No data available</p>
          )}
          <button
            onClick={() => setShowDetails(false)}
            aria-label="Close details modal"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
