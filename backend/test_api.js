const testFetch = async () => {
    try {
        const userId = '695ccc8246c9f3779b0c8bc2';
        const url = `http://localhost:5001/api/orders/user/${userId}`;
        console.log(`Fetching from: ${url}`);
        const response = await fetch(url);
        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Data:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testFetch();
