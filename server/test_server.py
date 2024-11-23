import os
import sys
import pytest
from server import create_app

def test_app_creation():
    app = create_app()
    assert app is not None
    
    with app.test_client() as client:
        # Test the emotion endpoint exists
        response = client.get('/api/emotion/stats')
        assert response.status_code in [200, 401]
        
        # Test the spotify endpoint exists
        response = client.get('/api/spotify/status')
        assert response.status_code in [200, 401]

if __name__ == '__main__':
    pytest.main([__file__])