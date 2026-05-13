import axios from 'axios';

async function checkHealth() {
    try {
        const response = await axios.get('http://localhost:4000/health');
        console.log("Health Status:", response.data);
    } catch (error) {
        console.error("Health Check Failed:", error.response ? error.response.data : error.message);
    }
}

checkHealth();
