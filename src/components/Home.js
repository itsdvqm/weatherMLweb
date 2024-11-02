import React from 'react';
import './Home.css';
import section1Image from './icons/section1.png'; 
import section2Image from './icons/section2.png'; 

const Home = () => (
  <div className="home-page-container">
    <section className='welcome-section'>
      <div className='header'>
        <h1>Welcome to Our Machine Learning Project</h1>
        <h2>Explore our model's capabilities, try out predictions, and learn about the team behind it!</h2>
      </div>
      <div className='welcome-buttons'>
        <a href="/model-performance"><button>Model Performance</button></a>
        <a href="/main-function"><button>Main Function</button></a>
      </div>
    </section>
    <div className='line'></div>
    <section className='machine-learning-section'>
      <div className='left'>
        <h1>Machine Learning</h1>
        <p>Unlock the potential of our machine learning weather analysis platform. Our sophisticated algorithms analyze vast datasets to deliver accurate, insightful weather predictions.</p>
        <ul>
          <li>💻 <strong>Advanced Algorithms:</strong> Utilizing the latest in machine learning to provide powerful predictions.</li>
          <li>📈 <strong>Data-Driven Insights:</strong> Transforming raw data into meaningful weather insights.</li>
          <li>⚙️ <strong>Continuous Improvement:</strong> Our model gets smarter with every data point.</li>
          <li>🌐 <strong>Accessible to All:</strong> Designed with simplicity in mind for all users.</li>
        </ul>
      </div>
      <div className='right'><img src={section1Image} alt="Machine Learning"></img></div>
    </section>
    <div className='line'></div>
    <section className='weather-analysis-section'>
      <div className='left'>
        <h1>Weather Analysis</h1>
        <p>Are you looking for reliable weather insights to help you make informed decisions? Look no further! With up to <strong>90% accuracy</strong>, our machine learning-powered weather analysis tool provides predictions you can count on.</p>
        <ul>
          <li>🚀 <strong>High Accuracy:</strong> Achieve up to 90% accuracy with our advanced algorithms.</li>
          <li>🌍 <strong>Real-Time Updates:</strong> Get timely weather trends tailored to your location.</li>
          <li>📊 <strong>Comprehensive Data:</strong> Access metrics like temperature, humidity, wind speed, and more.</li>
          <li>💡 <strong>Easy-to-Use Interface:</strong> User-friendly for all, from enthusiasts to professionals.</li>
        </ul>
      </div>
      <div className='right'><img src={section2Image} alt="Weather Analysis"></img></div>
    </section>
    <div className='line'></div>
    <br /><br />
  </div>
);

export default Home;
