<template>
    <div class="loader-wrapper">
      <div class="loader"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Loader"
  };
  </script>
  
  <style scoped>
  .loader-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(55, 65, 81, 0.5); /* Tailwind's bg-gray-700 w/opacity */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;
  }
  
  .loader {
    position: relative;
    display: flex;
  }
  
  .loader:before,
  .loader:after {
    content: '';
    width: 15px;
    height: 15px;
    display: inline-block;
    position: relative;
    margin: 0 5px;
    border-radius: 50%;
    color: #FFF;
    background: currentColor;
    box-shadow: 50px 0, -50px 0;
    animation: left 1s infinite ease-in-out;
  }
  
  .loader:after {
    color: #5a6aa0;
    animation: right 1.1s infinite ease-in-out;
  }
  
  @keyframes right {
    0%, 100% { transform: translateY(-10px) }
    50% { transform: translateY(10px) }
  }
  
  @keyframes left {
    0%, 100% { transform: translateY(10px) }
    50% { transform: translateY(-10px) }
  }
  </style>
  